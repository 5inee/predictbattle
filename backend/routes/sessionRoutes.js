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