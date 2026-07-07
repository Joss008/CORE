/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import CoreXLogo from './CoreXLogo';

interface LoginFormProps {
  onLogin: (profile: UserProfile) => void;
  onNavigateToRegister: () => void;
}

export default function LoginForm({ onLogin, onNavigateToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEmailValid = email.toLowerCase().endsWith('@undc.edu.pe');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMsg('Por favor, ingresa tu correo institucional.');
      return;
    }
    if (!isEmailValid) {
      setErrorMsg('El formato del correo institucional es incorrecto (@undc.edu.pe).');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('La contraseña es incorrecta o muy corta.');
      return;
    }

    // Try logging in with a registered or simulated user
    const emailPrefix = email.split('@')[0];
    const uppercasePrefix = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

    const simulatedProfile: UserProfile = {
      email,
      nickname: `${uppercasePrefix}_ATLETA`,
      selectedDisciplines: ['futbol', 'lol', 'voley'], // simulated disciplines
      xp: 2450, // higher XP for simulated existing user
      level: 4,
      isVerified: true,
      joinedAt: '12 de marzo de 2026',
      fullName: uppercasePrefix.replace(/[^a-zA-Z]/g, ' ') + ' Jeff',
      studentId: '2026' + Math.floor(10000 + Math.random() * 90000),
    };

    onLogin(simulatedProfile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto flex flex-col justify-between"
    >
      {/* Header Section */}
      <header className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <CoreXLogo size={100} animated={true} />
        </div>
        <h1 className="font-display text-2xl font-bold text-on-surface text-center tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="font-sans text-sm text-on-surface-variant text-center mt-1">
          Ingresa a tu cuenta de deportista de la UNDC
        </p>
      </header>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="font-mono text-[11px] font-bold tracking-widest text-primary uppercase ml-1 block">
            Email Institucional
          </label>
          <div className="relative group input-focus-animate">
            <input
              id="login-email"
              className="w-full bg-surface-card border-b-2 border-outline-variant focus:border-primary-container text-on-surface py-3 px-4 outline-none transition-all duration-300 rounded-t"
              placeholder="usuario@undc.edu.pe"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className={`material-symbols-outlined select-none ${isEmailValid ? 'text-tertiary' : 'text-outline'}`}>
                {isEmailValid ? 'verified' : 'alternate_email'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="font-mono text-[11px] font-bold tracking-widest text-primary uppercase block">
              Contraseña
            </label>
            <button
              type="button"
              className="text-[10px] font-sans font-semibold text-primary/80 hover:text-white"
              onClick={() => alert('Para este demo, ingresa cualquier contraseña mayor de 6 dígitos.')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative group input-focus-animate">
            <input
              id="login-password"
              className="w-full bg-surface-card border-b-2 border-outline-variant focus:border-primary-container text-on-surface py-3 px-4 pr-12 outline-none transition-all duration-300 rounded-t"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
            />
            <button
              id="toggle-login-password-btn"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors animate-none"
            >
              <span className="material-symbols-outlined select-none">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <motion.div
            id="login-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-error text-xs font-medium pl-1 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">error</span>
            {errorMsg}
          </motion.div>
        )}

        {/* CTA Section */}
        <section className="pt-4 pb-2">
          <button
            id="login-submit-btn"
            type="submit"
            className="w-full py-4 primary-glow-btn rounded-xl font-display font-bold text-white flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            Ingresar al Portal
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform select-none">
              login
            </span>
          </button>

          <p className="text-center mt-5 text-xs font-sans text-outline">
            ¿No tienes una cuenta aún?{' '}
            <button
              id="go-to-register-btn"
              type="button"
              onClick={onNavigateToRegister}
              className="text-primary hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
            >
              Regístrate aquí
            </button>
          </p>
        </section>
      </form>

      {/* Footer Emblem */}
      <footer className="pt-12 pb-4 flex flex-col items-center justify-center opacity-50">
        <div className="flex items-center gap-2 mb-1.5">
          <img
            id="undc-logo-footer"
            className="w-8 h-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwbUsl0bAO6cG7CyQhZ0eeJuD8reTC0kOLaHLE1t0eUx-Ka2k_CZ4Ezu9lK4EOxVQ34QA4BvVmOmaCHNjI12oxM_WZuILjorz-nqB3hxIA5MZUYbvMJtS_GQ0Ih59d633LEwB54W_P6cSZligMBKLWkjzDqxLpI63FhPg2KR2yfzjIghvkUPTfjEoPIFD9fCr_-CNsaLkq-dLT_6jsWlu_hwwbcJGq3bqSiW6OO6U2907FU-wrmtJv4V5o18xWywj65UEwxkgrZ6-m"
            alt="UNDC Crest"
            referrerPolicy="no-referrer"
          />
          <span className="font-mono text-[10px] tracking-widest uppercase font-bold">
            Propulsado por UNDC
          </span>
        </div>
        <div className="h-0.5 w-10 bg-primary-container/50 rounded-full" />
      </footer>
    </motion.div>
  );
}
