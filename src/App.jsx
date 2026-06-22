import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import { requestForToken, onMessageListener } from './utils/messaging';
import { db } from './config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ThemeProvider } from './context/ThemeContext';

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
    return <ThemeProvider><LoginScreen onLogin={setSession} /></ThemeProvider>;
  }

  const handleLogout = () => {
    localStorage.removeItem('elecpay_user');
    setSession(null);
  };

  if (session.role === 'admin') {
    return <ThemeProvider><AdminDashboard onLogout={handleLogout} /></ThemeProvider>;
  }

  return <ThemeProvider><ClientDashboard user={session} onLogout={handleLogout} /></ThemeProvider>;
}
