/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface DigitalPassProps {
  profile: UserProfile;
}

export default function DigitalPass({ profile }: DigitalPassProps) {
  const disciplineInfo: Record<string, { label: string; icon: string }> = {
    futbol: { label: 'Fútbol', icon: 'sports_soccer' },
    basquet: { label: 'Básquet', icon: 'sports_basketball' },
    voley: { label: 'Vóley', icon: 'sports_volleyball' },
    lol: { label: 'LoL Esports', icon: 'swords' },
    dota2: { label: 'Dota 2', icon: 'stadia_controller' },
    valorant: { label: 'Valorant', icon: 'target' },
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Credential Container */}
      <motion.div
        id="digital-pass-card"
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 80, delay: 0.1 }}
        className="w-full max-w-sm bg-gradient-to-br from-[#131b2e] via-[#050811] to-[#2b4c7e]/40 border-2 border-[#ffcdb2]/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,205,178,0.35)] relative overflow-hidden print:border-black print:bg-white print:text-black print:shadow-none scanline"
      >
        {/* Holographic glowing stripes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcdb2]/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none select-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2b4c7e]/15 blur-3xl rounded-full -ml-10 -mb-10 pointer-events-none select-none" />

        {/* Diagonal Tech lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none bg-[linear-gradient(45deg,transparent_45%,#fff_50%,transparent_55%)] bg-[size:20px_20px]" />

        {/* PASS HEADER */}
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <img
              id="undc-logo-badge"
              className="w-8 h-8 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwbUsl0bAO6cG7CyQhZ0eeJuD8reTC0kOLaHLE1t0eUx-Ka2k_CZ4Ezu9lK4EOxVQ34QA4BvVmOmaCHNjI12oxM_WZuILjorz-nqB3hxIA5MZUYbvMJtS_GQ0Ih59d633LEwB54W_P6cSZligMBKLWkjzDqxLpI63FhPg2KR2yfzjIghvkUPTfjEoPIFD9fCr_-CNsaLkq-dLT_6jsWlu_hwwbcJGq3bqSiW6OO6U2907FU-wrmtJv4V5o18xWywj65UEwxkgrZ6-m"
              alt="UNDC logo"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-display text-[10px] tracking-widest font-bold text-tertiary uppercase">
                UNDC DEPORTES
              </span>
              <span className="font-sans text-[8px] text-on-surface-variant font-medium uppercase">
                Universidad Nacional de Cañete
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-display text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-[#cbd5e1] select-none">
              CORE
            </span>
            <div className="flex items-center gap-0.5 bg-primary/10 border border-primary/30 px-1.5 py-0.5 rounded text-[8px] text-primary font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              ACTIVO
            </div>
          </div>
        </div>

        {/* PASS CONTENT */}
        <div className="flex gap-4">
          {/* Avatar side */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-28 bg-surface border border-outline-variant/40 rounded-xl overflow-hidden relative flex flex-col justify-center items-center group">
              {/* Futuristic camera grid */}
              <div className="absolute inset-x-0 top-0 h-1 bg-primary-container/20 animate-bounce" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] to-transparent pointer-events-none select-none z-10" />
              
              {/* Cyber Athlete generic placeholder silhouette */}
              <span className="material-symbols-outlined text-5xl text-outline-variant/80 select-none">
                sports_kabaddi
              </span>

              {/* Verified Badge overlay */}
              {profile.isVerified && (
                <div className="absolute bottom-2 right-2 bg-background/80 p-0.5 rounded-full border border-tertiary select-none z-20">
                  <span className="material-symbols-outlined text-sm text-tertiary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">
                NIVEL
              </span>
              <span className="font-display text-lg font-extrabold text-white">
                {profile.level}
              </span>
            </div>
          </div>

          {/* Details side */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div>
                <span className="font-mono text-[8px] text-outline uppercase tracking-widest block">
                  APODO DE COMPETICIÓN
                </span>
                <span className="font-display text-sm font-bold text-white tracking-tight uppercase">
                  {profile.nickname}
                </span>
              </div>

              <div>
                <span className="font-mono text-[8px] text-outline uppercase tracking-widest block">
                  NOMBRE COMPLETO
                </span>
                <span className="font-sans text-xs font-semibold text-on-surface">
                  {profile.fullName || 'Atleta No Registrado'}
                </span>
              </div>

              <div>
                <span className="font-mono text-[8px] text-outline uppercase tracking-widest block">
                  CÓDIGO DE ESTUDIANTE
                </span>
                <span className="font-mono text-xs text-primary font-bold">
                  {profile.studentId || '2026-N/A'}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-outline-variant/20">
              <span className="font-mono text-[8px] text-outline uppercase tracking-widest block mb-1">
                DISCIPLINAS REGISTRADAS
              </span>
              <div className="flex flex-wrap gap-1">
                {profile.selectedDisciplines.map((id) => {
                  const info = disciplineInfo[id] || { label: id.toUpperCase(), icon: 'sports' };
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-0.5 bg-surface-card border border-glass-border rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[10px] select-none text-primary">
                        {info.icon}
                      </span>
                      {info.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* PASS FOOTER (With mock barcode & QR Code) */}
        <div className="mt-5 pt-3 border-t border-outline-variant/30 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-mono text-[7px] text-outline uppercase tracking-widest">
              FECHA DE REGISTRO
            </span>
            <span className="font-mono text-[10px] font-bold text-on-surface">
              {profile.joinedAt}
            </span>
          </div>

          {/* Barcode representation */}
          <div className="flex flex-col items-end">
            <div className="flex gap-0.5 h-6 items-center bg-white/5 p-1 rounded">
              {[1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 2, 1, 4, 1].map((width, i) => (
                <div
                  key={i}
                  className="bg-on-surface-variant hover:bg-primary transition-colors"
                  style={{ width: `${width}px`, height: '100%' }}
                />
              ))}
            </div>
            <span className="font-mono text-[6px] text-outline mt-0.5 tracking-[0.2em]">
              UNDC-CORE-ATHLETE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 print:hidden">
        <button
          id="print-pass-btn"
          onClick={handlePrint}
          className="flex items-center gap-2 py-2.5 px-5 secondary-glow-btn rounded-xl text-xs font-mono font-bold transition-all cursor-pointer transform hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-sm select-none">print</span>
          IMPRIMIR PASE
        </button>

        <button
          id="share-pass-btn"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(`Mi apodo de atleta en CORE es: ${profile.nickname}`);
              alert('¡Copiado al portapapeles! Comparte tu perfil con tus compañeros.');
            } else {
              alert(`Tu apodo CORE: ${profile.nickname}`);
            }
          }}
          className="flex items-center gap-2 py-2.5 px-5 primary-glow-btn text-xs font-mono tracking-wider rounded-xl transition-all cursor-pointer transform hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-sm select-none">share</span>
          COMPARTIR APODO
        </button>
      </div>
    </div>
  );
}
