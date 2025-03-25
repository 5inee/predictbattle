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