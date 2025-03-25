// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

// إنشاء تطبيق Express
const app = express();

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