import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardBody } from '@/components/Card';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faUserClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  
  // إذا كان المستخدم مسجل دخوله، توجيهه إلى صفحة الجلسات
  if (user) {
    router.push('/sessions');
  }
  
  return (
    <Layout>
      <section id="startScreen" className="screen">
        <Card>
          <CardHeader>
            <h1>مرحبًا بك في PredictBattle</h1>
            <p className="subtitle">منصة توقعات تفاعلية للمجموعات</p>
          </CardHeader>
          <CardBody>
            <Button 
              variant="primary" 
              icon={faSignInAlt} 
              onClick={() => router.push('/login')}
            >
              تسجيل الدخول
            </Button>
            
            <Button 
              variant="secondary" 
              icon={faUserPlus} 
              className="mt-4" 
              onClick={() => router.push('/register')}
            >
              إنشاء حساب
            </Button>
            
            <div className="separator">
              <span>أو</span>
            </div>
            
            <Button 
              variant="text" 
              icon={faUserClock} 
              onClick={() => router.push('/guest')}
            >
              الدخول كضيف
            </Button>
          </CardBody>
        </Card>
      </section>
    </Layout>
  );
}