// frontend/src/utils/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// إعداد الإعدادات الافتراضية
axios.defaults.baseURL = API_URL;

// اعتراض الاستجابات للتعامل مع الأخطاء بشكل موحد
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'حدث خطأ غير متوقع';
    console.error('API Error:', message);
    // تجنب إظهار رسائل الخطأ المتعلقة بالمصادقة هنا لأنها تعالج في سياق المصادقة
    if (!error.config.url.includes('/users/login') && !error.config.url.includes('/users')) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

// خدمات الجلسات
export const sessionService = {
  // إنشاء جلسة جديدة
  createSession: async (sessionData) => {
    const response = await axios.post('/sessions', sessionData);
    return response.data;
  },

  // الحصول على جلسة باستخدام الكود
  getSessionByCode: async (code) => {
    const response = await axios.get(`/sessions/${code}`);
    return response.data;
  },

  // الحصول على جلسات المستخدم
  getUserSessions: async () => {
    const response = await axios.get('/sessions/user/my-sessions');
    return response.data;
  },

  // وضع علامة على الجلسة كمكتملة
  completeSession: async (sessionId) => {
    const response = await axios.put(`/sessions/${sessionId}/complete`);
    return response.data;
  }
};

// خدمات التوقعات
export const predictionService = {
  // إضافة توقع جديد
  addPrediction: async (predictionData) => {
    const response = await axios.post('/predictions', predictionData);
    return response.data;
  },

  // الحصول على توقعات جلسة معينة
  getSessionPredictions: async (sessionCode) => {
    const response = await axios.get(`/predictions/session/${sessionCode}`);
    return response.data;
  }
};

// وظائف مساعدة
export const getInitials = (name) => {
  if (!name) return '';
  return name.charAt(0).toUpperCase();
};

export const getAvatarColor = (name) => {
  if (!name) return '#5e60ce';
  const colors = [
    '#5e60ce', // Primary
    '#007bff', // Blue
    '#28a745', // Green
    '#dc3545', // Red
    '#6f42c1', // Purple
    '#fd7e14', // Orange
    '#20c997', // Teal
    '#e83e8c', // Pink
    '#6610f2', // Indigo
    '#17a2b8'  // Cyan
  ];
  
  // استخدم الحرف الأول من الاسم لاختيار لون ثابت
  const charCode = name.charCodeAt(0);
  return colors[charCode % colors.length];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // تنسيق اليوم والشهر
  const day = date.getDate();
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const month = monthNames[date.getMonth()];
  
  // تنسيق الوقت (12 ساعة)
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day} ${month} | ${hours}:${minutes} ${ampm}`;
};