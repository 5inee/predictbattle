import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import Loading from '@/components/Loading';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'يرجى إدخال اسم المستخدم';
    }
    
    if (!password) {
      newErrors.password = 'يرجى إدخال كلمة المرور';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await login(username, password);
      router.push('/sessions');
    } catch (error) {
      // تم التعامل مع الخطأ في سياق المصادقة
      console.error('خطأ تسجيل الدخول:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="تسجيل الدخول - PredictBattle">
      <section id="loginScreen" className="screen">
        <Card>
          <CardHeader>
            <h1>تسجيل الدخول</h1>
            <p className="subtitle">أدخل بيانات حسابك للمتابعة</p>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Loading text="جاري تسجيل الدخول..." />
            ) : (
              <form onSubmit={handleSubmit}>
                <FormInput
                  id="loginUsername"
                  label="اسم المستخدم"
                  icon={faUser}
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  required
                />
                
                <FormInput
                  id="loginPassword"
                  label="كلمة المرور"
                  type="password"
                  icon={faLock}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />
                
                <Button 
                  type="submit"
                  variant="primary" 
                  icon={faSignInAlt}
                >
                  تسجيل الدخول
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
