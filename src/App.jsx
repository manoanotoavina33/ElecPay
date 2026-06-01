import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";

export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <LoginScreen onLogin={setSession} />;
  }

  if (session.role === "admin") {
    return <AdminDashboard onLogout={() => setSession(null)} />;
  }

  return <ClientDashboard user={session} onLogout={() => setSession(null)} />;
}
