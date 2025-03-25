import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faLock, faArrowRight, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'يرجى إدخال اسم المستخدم';
    } else if (username.length < 3) {
      newErrors.username = 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
    }
    
    if (!password) {
      newErrors.password = 'يرجى إدخال كلمة المرور';
    } else if (password.length < 6) {
      newErrors.password = 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await register(username, password);
      router.push('/sessions');
    } catch (error) {
      // تم التعامل مع الخطأ في سياق المصادقة
      console.error('خطأ إنشاء الحساب:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="إنشاء حساب - PredictBattle">
      <section id="registerScreen" className="screen">
        <Card>
          <CardHeader>
            <h1>إنشاء حساب جديد</h1>
            <p className="subtitle">سجل للوصول إلى كافة المميزات</p>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Loading text="جاري إنشاء الحساب..." />
            ) : (
              <form onSubmit={handleSubmit}>
                <FormInput
                  id="registerUsername"
                  label="اسم المستخدم"
                  icon={faUser}
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  required
                />
                
                <FormInput
                  id="registerPassword"
                  label="كلمة المرور"
                  type="password"
                  icon={faLock}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />
                
                <FormInput
                  id="confirmPassword"
                  label="تأكيد كلمة المرور"
                  type="password"
                  icon={faLock}
                  placeholder="أعد إدخال كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  required
                />
                
                <Button 
                  type="submit"
                  variant="primary" 
                  icon={faUserPlus}
                >
                  إنشاء حساب
                </Button>
                
                <div className="separator">
                  <span>أو</span>
                </div>
                
                <Button 
                  variant="text" 
                  icon={faArrowRight} 
                  onClick={() => router.push('/')}
                >
                  عودة
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}
