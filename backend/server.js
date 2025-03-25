// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middlewares/errorMiddleware');

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch((err) => console.log('خطأ في الاتصال بقاعدة البيانات:', err.message));

// الوسائط (Middlewares)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// مسارات API
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));

// نقطة نهاية للتحقق من حالة الخادم
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'الخادم يعمل بشكل صحيح' });
});

// معالج الأخطاء
app.use(errorHandler);

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`تم تشغيل الخادم على المنفذ ${PORT}`));

// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`تم الاتصال بقاعدة البيانات MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`خطأ: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // الحصول على التوكن من الترويسة
      token = req.headers.authorization.split(' ')[1];

      // فك تشفير التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // الحصول على معلومات المستخدم باستثناء كلمة المرور
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('غير مصرح، التوكن غير صالح');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('غير مصرح، لا يوجد توكن');
  }
});

module.exports = { protect };

// backend/middlewares/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };

// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
