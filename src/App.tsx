import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Routine } from './pages/Routine';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { Download } from './pages/Download';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { useStore } from './store/useStore';
import { useFirebase } from './components/FirebaseProvider';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore(state => state.user);
  const { isAuthReady } = useFirebase();

  if (!isAuthReady) {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-bold">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const user = useStore(state => state.user);
  const theme = useStore(state => state.theme);
  const { isAuthReady } = useFirebase();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  if (!isAuthReady) {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-bold">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/download" element={<Download />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="routine" element={<Routine />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
