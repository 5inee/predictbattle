// frontend/src/contexts/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // تحقق من وجود المستخدم عند تحميل الصفحة
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`);
          setUser(data);
        } catch (error) {
          console.error('خطأ في التحقق من المستخدم:', error);
          // إزالة التوكن في حالة وجود خطأ
          Cookies.remove('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  // تسجيل الدخول
  const login = async (username, password) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        username,
        password
      });
      
      // حفظ التوكن في الكوكيز
      Cookies.set('token', data.token, { expires: 30 }); // تنتهي بعد 30 يوم
      
      // ضبط التوكن في رأس طلبات axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data);
      toast.success('تم تسجيل الدخول بنجاح!');
      return data;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
      throw error;
    }
  };

  // تسجيل مستخدم جديد
  const register = async (username, password) => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        username,
        password
      });
      
      // حفظ التوكن في الكوكيز
      Cookies.set('token', data.token, { expires: 30 });
      
      // ضبط التوكن في رأس طلبات axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      setUser(data);
      toast.success('تم إنشاء الحساب بنجاح!');
      return data;
    } catch (error) {
      console.error('خطأ في إنشاء الحساب:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
      throw error;
    }
  };

  // تسجيل الخروج
  const logout = () => {
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('تم تسجيل الخروج');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};