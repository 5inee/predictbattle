// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    تسجيل مستخدم جديد
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('اسم المستخدم مسجل بالفعل');
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('بيانات المستخدم غير صالحة');
  }
});

// @desc    تسجيل دخول المستخدم
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  }
});

// @desc    الحصول على بيانات المستخدم المسجل
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
    });
  } else {
    res.status(404);
    throw new Error('المستخدم غير موجود');
  }
});

module.exports = { registerUser, loginUser, getUserProfile };

// backend/controllers/sessionController.js
const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const Prediction = require('../models/Prediction');

// @desc    إنشاء جلسة توقعات جديدة
// @route   POST /api/sessions
// @access  Public/Private
const createSession = asyncHandler(async (req, res) => {
  const { question, maxPlayers, secretCode } = req.body;

  // توليد كود جلسة عشوائي
  let code = Session.generateCode();
  let existingSession = await Session.findOne({ code });

  // التأكد من أن الكود فريد
  while (existingSession) {
    code = Session.generateCode();
    existingSession = await Session.findOne({ code });
  }

  // إنشاء الجلسة
  const session = await Session.create({
    code,
    question,
    maxPlayers,
    secretCode,
    creator: req.user ? req.user._id : null,
    status: 'active'
  });

  if (session) {
    res.status(201).json(session);
  } else {
    res.status(400);
    throw new Error('بيانات الجلسة غير صالحة');
  }
});

// @desc    الانضمام إلى جلسة باستخدام الكود
// @route   GET /api/sessions/:code
// @access  Public
const getSessionByCode = asyncHandler(async (req, res) => {
  const session = await Session.findOne({ code: req.params.code });

  if (session) {
    // عدد التوقعات المقدمة حاليًا
    const predictionsCount = await Prediction.countDocuments({ session: session._id });
    
    res.json({
      ...session.toObject(),
      currentPlayers: predictionsCount
    });
  } else {
    res.status(404);
    throw new Error('الجلسة غير موجودة');
  }
});

// @desc    الحصول على جميع الجلسات للمستخدم المسجل
// @route   GET /api/sessions/my-sessions
// @access  Private
const getUserSessions = asyncHandler(async (req, res) => {
  // الحصول على جميع الجلسات التي أنشأها المستخدم
  const createdSessions = await Session.find({ creator: req.user._id });
  
  // الحصول على جميع الجلسات التي شارك فيها المستخدم
  const predictions = await Prediction.find({ user: req.user._id }).select('session');
  const participatedSessionIds = predictions.map(p => p.session);
  
  const participatedSessions = await Session.find({
    _id: { $in: participatedSessionIds },
    creator: { $ne: req.user._id } // استبعاد الجلسات التي أنشأها المستخدم لتجنب التكرار
  });
  
  // دمج القائمتين
  res.json({
    created: createdSessions,
    participated: participatedSessions
  });
});

// @desc    تحديث حالة الجلسة إلى مكتملة
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    res.status(404);
    throw new Error('الجلسة غير موجودة');
  }

  // التحقق من أن المستخدم هو منشئ الجلسة
  if (session.creator && session.creator.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('غير مصرح، أنت لست منشئ هذه الجلسة');
  }

  session.status = 'completed';
  
  const updatedSession = await session.save();
  res.json(updatedSession);
});

module.exports = { 
  createSession, 
  getSessionByCode, 
  getUserSessions, 
  completeSession 
};

// backend/controllers/predictionController.js
const asyncHandler = require('express-async-handler');
const Prediction = require('../models/Prediction');
const Session = require('../models/Session');

// @desc    إضافة توقع جديد للجلسة
// @route   POST /api/predictions
// @access  Public/Private
const addPrediction = asyncHandler(async (req, res) => {
  const { sessionCode, playerName, content } = req.body;

  // التحقق من وجود الجلسة
  const session = await Session.findOne({ code: sessionCode });

  if (!session) {
    res.status(404);
    throw new Error('الجلسة غير موجودة');
  }

  // التحقق من حالة الجلسة
  if (session.status === 'completed') {
    res.status(400);
    throw new Error('الجلسة مكتملة ولا يمكن إضافة توقعات جديدة');
  }

  // التحقق من عدد اللاعبين
  const predictionsCount = await Prediction.countDocuments({ session: session._id });
  
  if (predictionsCount >= session.maxPlayers) {
    res.status(400);
    throw new Error('تم الوصول إلى الحد الأقصى لعدد اللاعبين');
  }

  // التحقق من عدم وجود توقع للمستخدم في هذه الجلسة من قبل
  if (req.user) {
    const existingPrediction = await Prediction.findOne({
      session: session._id,
      user: req.user._id
    });

    if (existingPrediction) {
      res.status(400);
      throw new Error('لقد قمت بالفعل بإضافة توقع لهذه الجلسة');
    }
  }

  // إنشاء التوقع
  const prediction = await Prediction.create({
    session: session._id,
    user: req.user ? req.user._id : null,
    playerName,
    content
  });

  if (prediction) {
    res.status(201).json(prediction);
  } else {
    res.status(400);
    throw new Error('بيانات التوقع غير صالحة');
  }
});

// @desc    الحصول على جميع التوقعات لجلسة معينة
// @route   GET /api/predictions/session/:code
// @access  Public
const getSessionPredictions = asyncHandler(async (req, res) => {
  const session = await Session.findOne({ code: req.params.code });

  if (!session) {
    res.status(404);
    throw new Error('الجلسة غير موجودة');
  }

  const predictions = await Prediction.find({ session: session._id })
    .sort({ createdAt: 1 });

  res.json(predictions);
});

module.exports = { addPrediction, getSessionPredictions };

// backend/routes/userRoutes.js
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;

// backend/routes/sessionRoutes.js
const express = require('express');
const { 
  createSession, 
  getSessionByCode, 
  getUserSessions, 
  completeSession 
} = require('../controllers/sessionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createSession);
router.get('/:code', getSessionByCode);
router.get('/user/my-sessions', protect, getUserSessions);
router.put('/:id/complete', protect, completeSession);

module.exports = router;

// backend/routes/predictionRoutes.js
const express = require('express');
const { 
  addPrediction, 
  getSessionPredictions 
} = require('../controllers/predictionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// المسار يدعم المستخدمين المسجلين والضيوف
router.post('/', addPrediction);
router.get('/session/:code', getSessionPredictions);

module.exports = router;