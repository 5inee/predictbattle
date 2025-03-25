// backend/server.js - مشروع PredictBattle
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');

// تحميل متغيرات البيئة
dotenv.config();

// إنشاء تطبيق Express
const app = express();

// الوسائط (Middlewares)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// نقطة نهاية للتحقق من حالة الخادم
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'الخادم يعمل بشكل صحيح',
    project: 'PredictBattle'
  });
});

// مسارات API بسيطة للاختبار
app.get('/api/welcome', (req, res) => {
  res.json({ message: 'مرحباً بك في واجهة برمجة تطبيق PredictBattle!' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    // اختبار الاتصال بقاعدة البيانات
    const dbStatus = mongoose.connection.readyState;
    const statusText = {
      0: 'غير متصل',
      1: 'متصل',
      2: 'جاري الاتصال',
      3: 'جاري قطع الاتصال'
    };
    
    res.json({ 
      status: 'success', 
      project: 'PredictBattle',
      dbConnection: statusText[dbStatus] || 'غير معروف',
      dbInfo: {
        host: mongoose.connection.host,
        name: mongoose.connection.name
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// معالج الأخطاء البسيط
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('تم الاتصال بقاعدة البيانات بنجاح - PredictBattle');
    
    // تشغيل الخادم بعد الاتصال بقاعدة البيانات
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`تم تشغيل خادم PredictBattle على المنفذ ${PORT}`));
  })
  .catch((err) => console.log('خطأ في الاتصال بقاعدة البيانات PredictBattle:', err.message));