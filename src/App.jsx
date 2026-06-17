import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { requestForToken, onMessageListener } from './utils/messaging';
import { db } from './config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (session && session.role === 'client' && session.tenant) {
      requestForToken().then(token => {
        if (token) {
          const tenantRef = doc(db, 'clients', session.tenant.id);
          updateDoc(tenantRef, { fcmToken: token })
            .catch(err => console.error('Erreur token:', err));
        }
      });
    }

    onMessageListener()
      .then((payload) => {
        alert('Notification: ' + payload.notification.title + '\n' + payload.notification.body);
      })
      .catch((err) => console.log('Erreur écoute:', err));
  }, [session]);

  if (!session) {
    return <LoginScreen onLogin={setSession} />;
  }

  if (session.role === 'admin') {
    return <AdminDashboard onLogout={() => setSession(null)} />;
  }

  return <ClientDashboard user={session} onLogout={() => setSession(null)} />;
}
