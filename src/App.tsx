/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import CoreXLogo from './components/CoreXLogo';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import AthleteDashboard from './components/AthleteDashboard';
import { UserProfile } from './types';

type AppState = 'splash' | 'register' | 'login' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Load session from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('core_athlete_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as UserProfile;
        setCurrentUser(parsed);
        setAppState('dashboard');
      } catch (e) {
        console.error('Error loading saved athlete session', e);
      }
    }
  }, []);

  const handleRegister = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('core_athlete_user', JSON.stringify(profile));
    setAppState('dashboard');
  };

  const handleLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('core_athlete_user', JSON.stringify(profile));
    setAppState('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('core_athlete_user');
    setCurrentUser(null);
    setAppState('splash');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    localStorage.setItem('core_athlete_user', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen text-on-surface font-sans selection:bg-primary/30 kinetic-bg relative overflow-x-hidden flex flex-col justify-center">
      {/* Ambient glowing blobs in the background */}
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[100px] pointer-events-none select-none" />

      <div className="w-full max-w-5xl mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {/* STATE 1: INTRO / SPLASH */}
          {appState === 'splash' && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <CoreXLogo size={220} animated={true} />

              <motion.div
                className="mt-8 max-w-md space-y-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-tertiary font-bold tracking-[0.3em] uppercase block">
                    UNIVERSIDAD NACIONAL DE CAÑETE
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight uppercase">
                    Portal de Atletas de Élite
                  </h1>
                </div>
                
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed px-4">
                  Accede a tus estadísticas, completa entrenamientos diarios, sigue transmisiones universitarias en vivo y sube de rango en el circuito deportivo oficial.
                </p>

                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center px-6">
                  <button
                    id="splash-register-btn"
                    onClick={() => setAppState('register')}
                    className="flex-1 py-3.5 primary-glow-btn font-display text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer"
                  >
                    Registrar Perfil
                  </button>

                  <button
                    id="splash-login-btn"
                    onClick={() => setAppState('login')}
                    className="flex-1 py-3.5 secondary-glow-btn font-display text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </motion.div>

              {/* Decorative small footer in splash screen */}
              <motion.div
                className="mt-16 flex items-center gap-2 opacity-30 select-none pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.8 }}
              >
                <img
                  id="undc-logo-splash"
                  className="w-7 h-7 object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwbUsl0bAO6cG7CyQhZ0eeJuD8reTC0kOLaHLE1t0eUx-Ka2k_CZ4Ezu9lK4EOxVQ34QA4BvVmOmaCHNjI12oxM_WZuILjorz-nqB3hxIA5MZUYbvMJtS_GQ0Ih59d633LEwB54W_P6cSZligMBKLWkjzDqxLpI63FhPg2KR2yfzjIghvkUPTfjEoPIFD9fCr_-CNsaLkq-dLT_6jsWlu_hwwbcJGq3bqSiW6OO6U2907FU-wrmtJv4V5o18xWywj65UEwxkgrZ6-m"
                  alt="UNDC shield"
                  referrerPolicy="no-referrer"
                />
                <span className="font-mono text-[8px] tracking-widest uppercase font-bold text-white">
                  UNDC Deportes y Esports Oficial
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* STATE 2: REGISTRATION */}
          {appState === 'register' && (
            <div key="register" className="min-h-[500px] flex items-center justify-center py-6">
              <div className="neon-glass-card p-6 sm:p-10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,242,254,0.12)]">
                <RegistrationForm
                  onRegister={handleRegister}
                  onNavigateToLogin={() => setAppState('login')}
                />
              </div>
            </div>
          )}

          {/* STATE 3: LOGIN */}
          {appState === 'login' && (
            <div key="login" className="min-h-[500px] flex items-center justify-center py-6">
              <div className="neon-glass-card p-6 sm:p-10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,242,254,0.12)]">
                <LoginForm
                  onLogin={handleLogin}
                  onNavigateToRegister={() => setAppState('register')}
                />
              </div>
            </div>
          )}

          {/* STATE 4: DASHBOARD */}
          {appState === 'dashboard' && currentUser && (
            <div key="dashboard" className="w-full">
              <AthleteDashboard
                profile={currentUser}
                onLogout={handleLogout}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
