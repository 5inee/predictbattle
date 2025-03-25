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