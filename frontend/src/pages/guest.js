import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUser, faGamepad, faPlusCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { sessionService } from '@/utils/api';
import Loading from '@/components/Loading';

export default function Guest() {
  const [gameId, setGameId] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!gameId.trim()) {
      newErrors.gameId = 'يرجى إدخال كود اللعبة';
    }
    
    if (!username.trim()) {
      newErrors.username = 'يرجى إدخال اسمك';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleJoinSession = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // التحقق من وجود الجلسة
      const session = await sessionService.getSessionByCode(gameId);
      
      // حفظ بيانات الجلسة والمستخدم الضيف في التخزين المحلي
      localStorage.setItem('guestSession', JSON.stringify({
        code: gameId,
        username: username,
        timestamp: new Date().getTime()
      }));
      
      // التوجيه إلى صفحة اللعبة
      router.push(`/play/${gameId}`);
      
    } catch (error) {
      console.error('خطأ في الانضمام للجلسة:', error);
      toast.error('كود اللعبة غير صحيح أو الجلسة غير موجودة');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="الدخول كضيف - PredictBattle">
      <section id="joinScreen" className="screen">
        <Card>
          <CardHeader>
            <h1>جلسات التوقعات</h1>
            <p className="subtitle">انضم إلى جلسة توقعات كضيف</p>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Loading text="جاري التحقق من الجلسة..." />
            ) : (
              <form onSubmit={handleJoinSession}>
                <FormInput
                  id="gameId"
                  label="كود اللعبة"
                  icon={faGamepad}
                  placeholder="أدخل كود اللعبة المكون من 6 أحرف"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  error={errors.gameId}
                  required
                />
                
                <FormInput
                  id="username"
                  label="اسمك"
                  icon={faUser}
                  placeholder="أدخل اسمك"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  required
                />
                
                <Button 
                  type="submit"
                  variant="primary" 
                  icon={faSignInAlt}
                >
                  انضم إلى اللعبة
                </Button>
                
                <div className="separator">
                  <span>أو</span>
                </div>
                
                <Button 
                  variant="secondary" 
                  icon={faPlusCircle} 
                  onClick={() => router.push('/login')}
                >
                  سجل دخول لإنشاء لعبة جديدة
                </Button>
                
                <div className="separator">
                  <span>أو</span>
                </div>
                
                <Button 
                  variant="text" 
                  icon={faArrowRight} 
                  onClick={() => router.push('/')}
                >
                  عودة للصفحة الرئيسية
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}