/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import CoreXLogo from './CoreXLogo';

interface RegistrationFormProps {
  onRegister: (profile: UserProfile) => void;
  onNavigateToLogin: () => void;
}

export default function RegistrationForm({ onRegister, onNavigateToLogin }: RegistrationFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const disciplines = [
    { id: 'futbol', name: 'Fútbol', icon: 'sports_soccer' },
    { id: 'basquet', name: 'Básquet', icon: 'sports_basketball' },
    { id: 'voley', name: 'Vóley', icon: 'sports_volleyball' },
    { id: 'lol', name: 'LoL', icon: 'swords' },
    { id: 'dota2', name: 'Dota 2', icon: 'stadia_controller' },
    { id: 'valorant', name: 'Valorant', icon: 'target' },
  ];

  const handleToggleDiscipline = (id: string) => {
    if (selectedDisciplines.includes(id)) {
      setSelectedDisciplines(selectedDisciplines.filter(d => d !== id));
    } else {
      setSelectedDisciplines([...selectedDisciplines, id]);
    }
    setErrorMsg('');
  };

  const isEmailValid = email.toLowerCase().endsWith('@undc.edu.pe');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMsg('Por favor, ingresa tu correo institucional.');
      return;
    }
    if (!isEmailValid) {
      setErrorMsg('Debes usar un correo institucional válido (@undc.edu.pe).');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (selectedDisciplines.length < 1) {
      setErrorMsg('Selecciona al menos 1 disciplina deportiva o eSport.');
      return;
    }

    // Generate nice default athlete values
    const emailPrefix = email.split('@')[0];
    const uppercasePrefix = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    
    const profile: UserProfile = {
      email,
      nickname: `${uppercasePrefix}`,
      selectedDisciplines,
      xp: 120, // Start with some XP
      level: 1,
      isVerified: true,
      joinedAt: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      fullName: uppercasePrefix.replace(/[^a-zA-Z]/g, ' ') + ' Jeff',
      studentId: '2026' + Math.floor(10000 + Math.random() * 90000),
    };

    onRegister(profile);
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
      <header className="flex flex-col items-center mb-6">
        <div className="mb-4">
          <CoreXLogo size={100} animated={true} />
        </div>
        <h1 className="font-display text-2xl font-bold text-on-surface text-center tracking-tight">
          Bienvenido 
        </h1>
        <p className="font-sans text-sm text-on-surface-variant text-center mt-1">
          Únete a la élite deportiva de la UNDC
        </p>
      </header>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="font-mono text-[11px] font-bold tracking-widest text-primary uppercase ml-1 block">
            Email Institucional
          </label>
          <div className="relative group input-focus-animate">
            <input
              id="athlete-email"
              className="w-full bg-surface-card border-b-2 border-outline-variant focus:border-primary-container text-on-surface py-3 px-4 outline-none transition-all duration-300 rounded-t"
              placeholder="usuario@undc.edu.pe"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg('');
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
              {isEmailValid ? (
                <span 
                  id="email-verified-icon"
                  className="material-symbols-outlined text-tertiary select-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  title="Correo Institucional Verificado"
                >
                  verified
                </span>
              ) : (
                <span 
                  id="email-unverified-icon"
                  className="material-symbols-outlined text-outline select-none"
                >
                  alternate_email
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[11px] font-bold tracking-widest text-primary uppercase ml-1 block">
            Contraseña
          </label>
          <div className="relative group input-focus-animate">
            <input
              id="athlete-password"
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
              id="toggle-password-btn"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors"
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
            id="register-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-error text-xs font-medium pl-1 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">error</span>
            {errorMsg}
          </motion.div>
        )}

        {/* Interests Section */}
        <section className="mt-6">
          <div className="flex justify-between items-end mb-3">
            <h2 className="font-display text-md font-semibold text-on-surface">
              Selecciona tus Disciplinas
            </h2>
            <span className="font-mono text-[10px] text-on-surface-variant font-bold">
              Min. 1
            </span>
          </div>

          <div id="disciplines-grid" className="grid grid-cols-2 gap-3">
            {disciplines.map((disc) => {
              const isSelected = selectedDisciplines.includes(disc.id);
              return (
                <button
                  id={`discipline-btn-${disc.id}`}
                  key={disc.id}
                  type="button"
                  onClick={() => handleToggleDiscipline(disc.id)}
                  className={`group flex flex-col items-center justify-center p-4 bg-surface-card border ${
                    isSelected
                      ? 'border-primary selected-card'
                      : 'border-glass-border hover:bg-surface-bright/20'
                  } rounded-xl transition-all duration-300 cursor-pointer`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl mb-1.5 transition-colors select-none ${
                      isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                    }`}
                    style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {disc.icon}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-center uppercase tracking-wider">
                    {disc.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-4 pb-2">
          <button
            id="register-submit-btn"
            type="submit"
            className="w-full py-4 primary-glow-btn rounded-xl font-display font-bold text-white flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            Crear mi Perfil 
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform select-none">
              arrow_forward
            </span>
          </button>

          <p className="text-center mt-4 text-xs font-sans text-outline">
            ¿Ya tienes una cuenta?{' '}
            <button
              id="go-to-login-btn"
              type="button"
              onClick={onNavigateToLogin}
              className="text-primary hover:underline font-bold bg-transparent border-none p-0 cursor-pointer"
            >
              Inicia Sesión
            </button>
          </p>
        </section>
      </form>

      {/* Footer Emblem */}
      <footer className="pt-6 pb-4 flex flex-col items-center justify-center opacity-50">
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
