import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextarea';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faUsers,
  faLock,
  faRocket,
  faArrowLeft,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { sessionService } from '@/utils/api';
import { toast } from 'react-toastify';

export default function CreateSession() {
  const [question, setQuestion] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [secretCode, setSecretCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  
  // التحقق من وجود مستخدم مسجل دخوله
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!question.trim()) {
      newErrors.question = 'يرجى إدخال سؤال التحدي';
    }
    
    if (maxPlayers < 2 || maxPlayers > 20) {
      newErrors.maxPlayers = 'يجب أن يكون عدد اللاعبين بين 2 و 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const sessionData = {
        question,
        maxPlayers,
        secretCode
      };
      
      const newSession = await sessionService.createSession(sessionData);
      
      toast.success('تم إنشاء الجلسة بنجاح!');
      router.push(`/play/${newSession.code}`);
    } catch (error) {
      console.error('خطأ في إنشاء الجلسة:', error);
      toast.error('حدث خطأ أثناء إنشاء الجلسة');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout title="إنشاء جلسة جديدة - PredictBattle">
      <section id="createGameScreen" className="screen">
        <Card>
          <CardHeader>
            <h1>إنشاء جلسة جديدة</h1>
            <p className="subtitle">قم بإعداد جلسة التوقعات الخاصة بك</p>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Loading text="جاري إنشاء الجلسة..." />
            ) : (
              <form onSubmit={handleCreateSession}>
                <FormTextarea
                  id="gameQuestion"
                  label="سؤال التحدي"
                  icon={faQuestionCircle}
                  placeholder="ما الذي تريد أن يتوقعه اللاعبون؟"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  error={errors.question}
                  required
                />
                
                <FormInput
                  id="maxPlayers"
                  label="عدد اللاعبين (2-20)"
                  type="number"
                  icon={faUsers}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                  error={errors.maxPlayers}
                  min={2}
                  max={20}
                  required
                />
                
                <FormInput
                  id="secretCode"
                  label="الرمز السري (اختياري)"
                  type="password"
                  icon={faLock}
                  placeholder="أدخل الرمز السري لمزيد من الخصوصية"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                />
                
                <div className="flex gap-3 flex-col md:flex-row">
                  <Button 
                    type="submit"
                    variant="primary" 
                    icon={faRocket}
                  >
                    ابدأ الجلسة
                  </Button>
                  
                  <Button 
                    variant="text" 
                    icon={faArrowLeft} 
                    onClick={() => router.push('/sessions')}
                  >
                    عودة
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}