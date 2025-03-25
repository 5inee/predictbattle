import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import FormTextarea from '@/components/FormTextarea';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHashtag,
  faUsers,
  faHourglassHalf,
  faCheckCircle,
  faPaperPlane,
  faPaste,
  faTrashAlt,
  faLightbulb,
  faArrowLeft,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';
import { sessionService, predictionService, getAvatarColor, getInitials, formatDate } from '@/utils/api';
import { toast } from 'react-toastify';

export default function PlaySession() {
  const [session, setSession] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [content, setContent] = useState('');
  const [userPrediction, setUserPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const router = useRouter();
  const { code } = router.query;
  const { user } = useAuth();
  
  // جلب بيانات الجلسة
  useEffect(() => {
    if (!code) return;
    
    const fetchSessionData = async () => {
      try {
        const sessionData = await sessionService.getSessionByCode(code);
        setSession(sessionData);
        
        // جلب التوقعات
        const predictionsData = await predictionService.getSessionPredictions(code);
        setPredictions(predictionsData);
        
        // التحقق مما إذا كان المستخدم قد قدم توقعًا بالفعل
        const userPred = user ? 
          predictionsData.find(p => p.user === user._id) : 
          null;
        
        setUserPrediction(userPred);
        
        // تعيين اسم اللاعب
        if (user) {
          setPlayerName(user.username);
        } else {
          // التحقق من وجود بيانات ضيف في التخزين المحلي
          const guestData = localStorage.getItem('guestSession');
          if (guestData) {
            const parsedData = JSON.parse(guestData);
            if (parsedData.code === code) {
              setPlayerName(parsedData.username);
            }
          }
        }
        
      } catch (error) {
        console.error('خطأ في جلب بيانات الجلسة:', error);
        toast.error('تعذر جلب بيانات الجلسة');
        router.push('/sessions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessionData();
  }, [code, user, router]);
  
  // نسخ كود الجلسة
  const copyCodeToClipboard = () => {
    if (navigator.clipboard && code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopySuccess(true);
          toast.success('تم نسخ الكود');
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(() => {
          toast.error('فشل نسخ الكود');
        });
    }
  };
  
  // إرسال التوقع
  const handleSubmitPrediction = async () => {
    if (!content.trim()) {
      toast.warning('يرجى إدخال التوقع');
      return;
    }
    
    if (!playerName.trim()) {
      toast.warning('يرجى إدخال اسمك');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const predictionData = {
        sessionCode: code,
        playerName,
        content
      };
      
      const newPrediction = await predictionService.addPrediction(predictionData);
      
      // تحديث قائمة التوقعات
      const updatedPredictions = await predictionService.getSessionPredictions(code);
      setPredictions(updatedPredictions);
      
      // تحديث توقع المستخدم
      setUserPrediction(newPrediction);
      
      toast.success('تم إرسال التوقع بنجاح!');
    } catch (error) {
      console.error('خطأ في إرسال التوقع:', error);
      toast.error('تعذر إرسال التوقع');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // لصق من الحافظة
  const pasteFromClipboard = async () => {
    if (navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        setContent(text);
      } catch (error) {
        toast.error('فشل لصق النص من الحافظة');
      }
    }
  };
  
  // مسح النص
  const clearText = () => {
    setContent('');
  };
  
  if (isLoading) {
    return (
      <Layout title="جلسة التوقعات - PredictBattle">
        <Loading text="جاري تحميل بيانات الجلسة..." />
      </Layout>
    );
  }
  
  if (!session) {
    return (
      <Layout title="جلسة غير موجودة - PredictBattle">
        <div className="text-center py-10">
          <h1 className="text-2xl text-error mb-4">الجلسة غير موجودة</h1>
          <Button 
            variant="primary" 
            icon={faArrowLeft}
            className="max-w-xs mx-auto"
            onClick={() => router.push('/sessions')}
          >
            العودة إلى الجلسات
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={`${session.question} - PredictBattle`}>
      <section id="gameScreen" className="screen">
        <Card className="game-card">
          <CardHeader>
            <h1 className="game-title">{session.question}</h1>
            <div className="game-meta">
              <div id="gameCode" className="game-code">
                <FontAwesomeIcon icon={faHashtag} /> كود اللعبة:
                <span id="gameCodeDisplay">{code}</span>
                <button 
                  className="copy-button" 
                  aria-label="نسخ الكود"
                  onClick={copyCodeToClipboard}
                >
                  <FontAwesomeIcon icon={faCopy} className={copySuccess ? 'text-success' : ''} />
                </button>
              </div>
              <div className="player-stat">
                <FontAwesomeIcon icon={faUsers} /> 
                <span className="player-count">
                  اللاعبون: {predictions.length}/{session.maxPlayers}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardBody>
            {predictions.length < session.maxPlayers && !userPrediction && (
              <div id="waitingMessage" className="status-banner waiting">
                <FontAwesomeIcon icon={faHourglassHalf} className="pulse" />
                <span>في انتظار توقعات اللاعبين...</span>
              </div>
            )}
            
            {userPrediction ? (
              // عرض جميع التوقعات المقدمة
              <>
                <div id="statusMessage" className="status-banner success">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>تم إرسال توقعك، يمكنك الاطلاع على التوقعات أدناه.</span>
                </div>
                
                <div id="predictionCount" className="prediction-counter">
                  <div className="counter-icon">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <div className="counter-text">التوقعات: {predictions.length}/{session.maxPlayers}</div>
                </div>
                
                <div id="predictionsList" className="predictions-list">
                  <h2 className="section-title">جميع التوقعات</h2>
                  <div id="predictionsContainer" className="predictions-container">
                    {predictions.map((prediction, index) => {
                      const isCurrentUser = user ? prediction.user === user._id : prediction.playerName === playerName;
                      
                      return (
                        <div key={prediction._id} className={`prediction-card ${index === 0 ? 'fade-in' : ''}`}>
                          <div className="prediction-header">
                            <div className="predictor-info">
                              <div className="predictor-avatar" style={{ backgroundColor: getAvatarColor(prediction.playerName) }}>
                                {getInitials(prediction.playerName)}
                              </div>
                              <div className="predictor-name">
                                {prediction.playerName} {isCurrentUser && "(أنت)"}
                              </div>
                            </div>
                            <div className="timestamp">{formatDate(prediction.createdAt)}</div>
                          </div>
                          <div className="prediction-content">
                            {prediction.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              // نموذج تقديم التوقع
              <div id="predictionForm" className="prediction-panel">
                <div className="panel-header">
                  <h2>توقعك</h2>
                  <div className="prediction-actions">
                    <button id="pastePredictionBtn" className="action-btn" onClick={pasteFromClipboard}>
                      <FontAwesomeIcon icon={faPaste} /> لصق
                    </button>
                    <button id="clearPredictionBtn" className="action-btn" onClick={clearText}>
                      <FontAwesomeIcon icon={faTrashAlt} /> مسح
                    </button>
                  </div>
                </div>
                <div className="prediction-input-container">
                  <textarea 
                    id="prediction" 
                    placeholder="أدخل توقعك هنا..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <Button 
                  variant="primary"
                  size="large"
                  icon={faPaperPlane}
                  onClick={handleSubmitPrediction}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال التوقع'}
                </Button>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Button 
                variant="secondary" 
                className="max-w-xs mx-auto" 
                icon={faArrowLeft}
                onClick={() => router.push('/sessions')}
              >
                العودة إلى الجلسات
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}