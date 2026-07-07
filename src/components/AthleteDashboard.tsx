/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Match, Quest, MatchStatus } from '../types';
import DigitalPass from './DigitalPass';
import CoreXLogo from './CoreXLogo';

interface AthleteDashboardProps {
  profile: UserProfile;
  onLogout: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export default function AthleteDashboard({ profile, onLogout, onUpdateProfile }: AthleteDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'quests' | 'achievements' | 'pass'>('overview');
  const [matches, setMatches] = useState<Match[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeFilter, setActiveFilter] = useState<MatchStatus | 'all'>('all');
  const [selectedMatchForStream, setSelectedMatchForStream] = useState<Match | null>(null);
  const [streamChat, setStreamChat] = useState<{ sender: string; text: string; team?: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [achievementNotification, setAchievementNotification] = useState<string | null>(null);

  // Initialize data tailored to athlete's disciplines
  useEffect(() => {
    // Generate matches
    const initialMatches: Match[] = [
      {
        id: 'm1',
        disciplineId: 'futbol',
        disciplineName: 'Fútbol',
        teamA: { name: 'UNDC Orcas', score: 2 },
        teamB: { name: 'UNMSM Toros', score: 1 },
        status: 'live',
        timeString: '72\' en juego',
        venueOrPlatform: 'Estadio San Vicente de Cañete',
        liveViewers: 145,
        description: 'Copa Universitaria Regional de Cañete - Cuartos de Final',
      },
      {
        id: 'm2',
        disciplineId: 'valorant',
        disciplineName: 'Valorant',
        teamA: { name: 'UNDC eSports', score: 9 },
        teamB: { name: 'UNI Águilas', score: 11 },
        status: 'live',
        timeString: 'Mapa 2: Bind',
        venueOrPlatform: 'Servidor Latam Sur (Twitch/Discord)',
        liveViewers: 289,
        description: 'Torneo Interuniversitario de Esports - Fase de Grupos',
      },
      {
        id: 'm3',
        disciplineId: 'basquet',
        disciplineName: 'Básquet',
        teamA: { name: 'UNDC Orcas' },
        teamB: { name: 'UNAC Delfines' },
        status: 'upcoming',
        timeString: 'Mañana, 18:30',
        venueOrPlatform: 'Coliseo Municipal de Cañete',
        description: 'Liga Regional Universitaria - Fecha 3',
      },
      {
        id: 'm4',
        disciplineId: 'lol',
        disciplineName: 'LoL',
        teamA: { name: 'UNDC eSports' },
        teamB: { name: 'UTP Esports' },
        status: 'upcoming',
        timeString: 'Jueves 9, 20:00',
        venueOrPlatform: 'Canal Oficial Twitch UNDC',
        description: 'Clasificatorias Nacionales LUP Esports',
      },
      {
        id: 'm5',
        disciplineId: 'voley',
        disciplineName: 'Vóley',
        teamA: { name: 'UNDC Orcas (F)', score: 3 },
        teamB: { name: 'UNFV Halcones (F)', score: 0 },
        status: 'finished',
        timeString: 'Finalizado',
        venueOrPlatform: 'Polideportivo UNDC',
        description: 'Amistoso de Preparación - Set Scores: 25-18, 25-21, 25-15',
      },
      {
        id: 'm6',
        disciplineId: 'dota2',
        disciplineName: 'Dota 2',
        teamA: { name: 'UNDC Esports', score: 1 },
        teamB: { name: 'UNMSM Esports', score: 2 },
        status: 'finished',
        timeString: 'Finalizado',
        venueOrPlatform: 'Clasificatoria Regional',
        description: 'Gran Final de Clasificatoria Universitaria - Bo3',
      },
    ];

    // Filter matches to match the athlete's interests, but keep at least 1-2 others to show full ecosystem
    const filteredMatches = initialMatches.sort((a, b) => {
      const aInterested = profile.selectedDisciplines.includes(a.disciplineId) ? 1 : 0;
      const bInterested = profile.selectedDisciplines.includes(b.disciplineId) ? 1 : 0;
      return bInterested - aInterested;
    });

    setMatches(filteredMatches);

    // Generate Quests
    const initialQuests: Quest[] = [
      {
        id: 'q1',
        title: 'Asistir al entrenamiento semanal',
        description: 'Preséntate al entrenamiento presencial de tu equipo federado y escanea el código QR de asistencia.',
        xpReward: 350,
        isCompleted: false,
        isClaimed: false,
      },
      {
        id: 'q2',
        title: 'Entrenamiento de Puntería / Reflejos',
        description: 'Completa una sesión de 15 minutos en Aim Lab o en la cancha de tiros de fútbol/básquet.',
        xpReward: 200,
        isCompleted: false,
        isClaimed: false,
        disciplineId: 'valorant',
      },
      {
        id: 'q3',
        title: 'Victoria de Comunidad en Discord',
        description: 'Gana una partida personalizada en el canal oficial de Esports UNDC de League of Legends o Dota 2.',
        xpReward: 300,
        isCompleted: true, // Mark this one completed so they can claim it!
        isClaimed: false,
        disciplineId: 'lol',
      },
      {
        id: 'q4',
        title: 'Apoyo incondicional',
        description: 'Observa una transmisión en vivo de un equipo de la UNDC en la pestaña de Partidos por al menos 5 minutos.',
        xpReward: 150,
        isCompleted: false,
        isClaimed: false,
      },
      {
        id: 'q5',
        title: 'Condición Física de Élite',
        description: 'Completa 30 minutos de entrenamiento de cardio/gimnasio certificado por el entrenador UNDC.',
        xpReward: 400,
        isCompleted: false,
        isClaimed: false,
      },
    ];

    // Filter quests: bring the ones matching selected disciplines to the top
    const sortedQuests = initialQuests.sort((a, b) => {
      const aMatch = a.disciplineId && profile.selectedDisciplines.includes(a.disciplineId) ? 1 : 0;
      const bMatch = b.disciplineId && profile.selectedDisciplines.includes(b.disciplineId) ? 1 : 0;
      return bMatch - aMatch;
    });

    setQuests(sortedQuests);
  }, [profile.selectedDisciplines]);

  // Handle Match Stream chat mock messages generator
  useEffect(() => {
    if (!selectedMatchForStream) return;

    // Reset chat
    setStreamChat([
      { sender: 'Coach_UNDC', text: '¡Vamos Orcas! Enfocados en la defensa.', team: 'UNDC' },
      { sender: 'GamerCañete', text: '¡Qué buen contraataque!', team: 'UNDC' },
      { sender: 'RivalFan99', text: 'La UNI está jugando muy sólido', team: 'Oponente' },
    ]);

    const chatPool = [
      { sender: 'InvocadorCañetano', text: '¡UNDC CORRE! VAMOS', team: 'UNDC' },
      { sender: 'Val_Pro_04', text: 'Ese triple kill estuvo de locos 🤯', team: 'UNDC' },
      { sender: 'Santi_V', text: '¡Estadio lleno hoy en San Vicente!', team: 'UNDC' },
      { sender: 'Lore_G', text: '¡Vamos chicas del vóley, imparables!', team: 'UNDC' },
      { sender: 'DotaKing', text: 'Ese gank cambió toda la partida', team: 'UNDC' },
      { sender: 'CañetePower', text: '¡Grande UNDC!', team: 'UNDC' },
    ];

    const timer = setInterval(() => {
      const randomChat = chatPool[Math.floor(Math.random() * chatPool.length)];
      setStreamChat(prev => [...prev.slice(-30), randomChat]);
    }, 4500);

    return () => clearInterval(timer);
  }, [selectedMatchForStream]);

  const handleClaimXp = (questId: string, xpReward: number) => {
    // Claim XP
    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        return { ...q, isClaimed: true };
      }
      return q;
    });
    setQuests(updatedQuests);

    // Calculate level up
    let newXp = profile.xp + xpReward;
    let newLevel = profile.level;
    const xpPerLevel = 1000;

    if (newXp >= xpPerLevel) {
      newLevel += Math.floor(newXp / xpPerLevel);
      newXp = newXp % xpPerLevel;
      // Trigger level-up banner!
      setAchievementNotification(`¡SUBISTE DE NIVEL! Ahora eres Nivel ${newLevel} de Atleta de Élite.`);
      setTimeout(() => setAchievementNotification(null), 6000);
    }

    onUpdateProfile({
      ...profile,
      xp: newXp,
      level: newLevel,
    });
  };

  const handleSimulateQuestComplete = (questId: string) => {
    setQuests(quests.map(q => {
      if (q.id === questId) {
        return { ...q, isCompleted: true };
      }
      return q;
    }));
  };

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setStreamChat(prev => [
      ...prev,
      { sender: profile.nickname, text: chatInput.trim(), team: 'UNDC' }
    ]);
    setChatInput('');

    // Trigger complete stream-watcher quest if they chat
    const watchQuest = quests.find(q => q.id === 'q4');
    if (watchQuest && !watchQuest.isCompleted) {
      setTimeout(() => {
        handleSimulateQuestComplete('q4');
        setAchievementNotification('¡Misión "Apoyo incondicional" Completada! Reclama tu XP.');
        setTimeout(() => setAchievementNotification(null), 5000);
      }, 1500);
    }
  };

  const activeMatches = matches.filter(m => activeFilter === 'all' || m.status === activeFilter);

  // Stats calculate
  const totalCompletedQuests = quests.filter(q => q.isCompleted).length;
  const totalClaimedQuests = quests.filter(q => q.isClaimed).length;

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* HEADER HUD */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-glass-border sticky top-0 z-40 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CoreXLogo size={32} animated={true} showText={false} />
            <span className="font-display text-xl font-extrabold tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-white to-[#cbd5e1] select-none pl-1">
              CORE
            </span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-extrabold tracking-widest text-primary hidden sm:inline">
              HUD PORTAL ATLETA
            </span>
          </div>
        </div>

        {/* User Info Capsule */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('pass')}
            className="flex items-center gap-2 bg-surface-card border border-glass-border rounded-full py-1 px-3 cursor-pointer hover:bg-surface-bright/30 transition-all"
          >
            <div className="w-6 h-6 bg-primary-container/20 rounded-full flex items-center justify-center border border-primary-container/40">
              <span className="material-symbols-outlined text-sm text-primary select-none">sports_kabaddi</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="font-display text-[10px] font-extrabold text-white leading-none">
                {profile.nickname}
              </span>
              <span className="font-mono text-[8px] text-on-surface-variant font-bold">
                Nivel {profile.level}
              </span>
            </div>
          </div>

          <button
            id="logout-btn"
            onClick={onLogout}
            title="Cerrar Sesión"
            className="w-8 h-8 bg-surface-card hover:bg-[#2e1215] border border-glass-border hover:border-error/30 rounded-lg flex items-center justify-center text-outline hover:text-error transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-md select-none">logout</span>
          </button>
        </div>
      </header>

      {/* ACHIEVEMENT / NOTIFICATION FLOATER */}
      <AnimatePresence>
        {achievementNotification && (
          <motion.div
            id="achievement-popup"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 inset-x-4 max-w-sm mx-auto z-50 bg-gradient-to-r from-tertiary-container via-[#201c10] to-tertiary-container border-2 border-tertiary p-4 rounded-xl shadow-[0_0_25px_rgba(255,186,56,0.3)] flex items-start gap-3"
          >
            <span className="material-symbols-outlined text-2xl text-tertiary select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <div>
              <h4 className="font-display text-sm font-bold text-white tracking-tight uppercase">
                LOGRO DE ATLETA CORE
              </h4>
              <p className="font-sans text-xs text-on-surface/90 mt-0.5 leading-relaxed">
                {achievementNotification}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* SIDE BAR NAVIGATION */}
        <aside className="w-full md:w-56 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-glass-border/30 md:pr-4">
          <button
            id="tab-overview-btn"
            onClick={() => {
              setActiveTab('overview');
              setSelectedMatchForStream(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap md:whitespace-normal border ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#ffcdb2]/15 to-[#2b4c7e]/5 text-[#ffcdb2] border-[#ffcdb2]/40 shadow-[0_0_15px_rgba(255,205,178,0.15)]'
                : 'text-outline hover:text-white hover:bg-surface-card border-transparent'
            }`}
          >
            <span className="material-symbols-outlined select-none text-base">dashboard</span>
            Panel General
          </button>

          <button
            id="tab-matches-btn"
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap md:whitespace-normal border ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-[#ffcdb2]/15 to-[#2b4c7e]/5 text-[#ffcdb2] border-[#ffcdb2]/40 shadow-[0_0_15px_rgba(255,205,178,0.15)]'
                : 'text-outline hover:text-white hover:bg-surface-card border-transparent'
            }`}
          >
            <span className="material-symbols-outlined select-none text-base">sports_score</span>
            Centro de Partidos
            {matches.some(m => m.status === 'live') && (
              <span className="w-2 h-2 rounded-full bg-status-live animate-ping ml-auto hidden md:block" />
            )}
          </button>

          <button
            id="tab-quests-btn"
            onClick={() => {
              setActiveTab('quests');
              setSelectedMatchForStream(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap md:whitespace-normal border ${
              activeTab === 'quests'
                ? 'bg-gradient-to-r from-[#ffcdb2]/15 to-[#2b4c7e]/5 text-[#ffcdb2] border-[#ffcdb2]/40 shadow-[0_0_15px_rgba(255,205,178,0.15)]'
                : 'text-outline hover:text-white hover:bg-surface-card border-transparent'
            }`}
          >
            <span className="material-symbols-outlined select-none text-base">task_alt</span>
            Misiones
            {quests.some(q => q.isCompleted && !q.isClaimed) && (
              <span className="bg-[#ffcdb2]/20 text-[#ffcdb2] text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-auto hidden md:block border border-[#ffcdb2]/30">
                XP
              </span>
            )}
          </button>

          <button
            id="tab-achievements-btn"
            onClick={() => {
              setActiveTab('achievements');
              setSelectedMatchForStream(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap md:whitespace-normal border ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-[#ffcdb2]/15 to-[#2b4c7e]/5 text-[#ffcdb2] border-[#ffcdb2]/40 shadow-[0_0_15px_rgba(255,205,178,0.15)]'
                : 'text-outline hover:text-white hover:bg-surface-card border-transparent'
            }`}
          >
            <span className="material-symbols-outlined select-none text-base">workspace_premium</span>
            Logros UNDC
          </button>

          <button
            id="tab-pass-btn"
            onClick={() => {
              setActiveTab('pass');
              setSelectedMatchForStream(null);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full text-left whitespace-nowrap md:whitespace-normal border ${
              activeTab === 'pass'
                ? 'bg-gradient-to-r from-[#ffcdb2]/15 to-[#2b4c7e]/5 text-[#ffcdb2] border-[#ffcdb2]/40 shadow-[0_0_15px_rgba(255,205,178,0.15)]'
                : 'text-outline hover:text-white hover:bg-surface-card border-transparent'
            }`}
          >
            <span className="material-symbols-outlined select-none text-base">badge</span>
            Pase de Atleta
          </button>
        </aside>

        {/* MAIN HUD VIEWER */}
        <main className="flex-1 min-h-[450px] overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex-1"
              >
                {/* Level Card Widget */}
                <div className="neon-glass-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 blur-3xl rounded-full" />
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-container flex flex-col justify-center items-center shadow-lg shadow-primary/20 text-white">
                        <span className="font-mono text-[9px] font-bold opacity-80 leading-none select-none">LEVEL</span>
                        <span className="font-display text-2xl font-black mt-0.5 leading-none">{profile.level}</span>
                      </div>
                      <div>
                        <h2 className="font-display text-lg font-extrabold text-white tracking-tight uppercase">
                          {profile.fullName || 'Deportista UNDC'}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                          <span className="font-mono text-[10px] text-primary">{profile.email}</span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant" />
                          <span className="text-tertiary text-[10px] font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            VERIFICADO
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-mono text-[10px] text-outline uppercase tracking-wider">EXPERIENCIA</span>
                      <div className="font-display text-lg font-bold text-white mt-0.5">
                        {profile.xp} <span className="text-secondary-container">/ 1000 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Up Progress Bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-[10px] text-outline uppercase font-mono tracking-wider mb-1.5">
                      <span>Rango Atleta Novato</span>
                      <span>Siguiente nivel: {1000 - profile.xp} XP</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#0b111e] rounded-full overflow-hidden border border-glass-border">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.35)] transition-all duration-500"
                        style={{ width: `${(profile.xp / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Dashboard Stats Panel */}
                <div id="stats-dashboard-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="neon-glass-card p-4 rounded-xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(0,242,254,0.12)]">
                    <span className="material-symbols-outlined text-primary text-xl select-none mb-2">sports_kabaddi</span>
                    <div>
                      <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">Disciplinas</span>
                      <span className="font-display text-xl font-bold text-white">{profile.selectedDisciplines.length}</span>
                    </div>
                  </div>

                  <div className="neon-glass-card p-4 rounded-xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                    <span className="material-symbols-outlined text-[#f97316] text-xl select-none mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                    <div>
                      <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">Racha de Entrenamientos</span>
                      <span className="font-display text-xl font-bold text-white">4 Días</span>
                    </div>
                  </div>

                  <div className="neon-glass-card p-4 rounded-xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(0,242,254,0.12)]">
                    <span className="material-symbols-outlined text-primary text-xl select-none mb-2">military_tech</span>
                    <div>
                      <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">Misiones Completas</span>
                      <span className="font-display text-xl font-bold text-white">{totalCompletedQuests}</span>
                    </div>
                  </div>

                  <div className="neon-glass-card p-4 rounded-xl flex flex-col justify-between hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                    <span className="material-symbols-outlined text-[#a855f7] text-xl select-none mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    <div>
                      <span className="font-mono text-[9px] text-outline uppercase tracking-wider block">Copas / Títulos</span>
                      <span className="font-display text-xl font-bold text-white">2 Copa UNDC</span>
                    </div>
                  </div>
                </div>

                {/* Live matches quick preview */}
                <section>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                      Partidos en Vivo
                    </h3>
                    <button
                      id="view-all-matches-link"
                      onClick={() => setActiveTab('matches')}
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5"
                    >
                      Ver todos
                      <span className="material-symbols-outlined text-xs select-none">chevron_right</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {matches.filter(m => m.status === 'live').map(match => (
                      <div 
                        key={match.id}
                        className="bg-surface border-l-4 border-[#ffcdb2] border-r border-t border-b border-[#ffcdb2]/30 p-4 rounded-r-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_0_15px_rgba(255,205,178,0.1)]"
                      >
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                           <span className="bg-[#ffcdb2]/10 text-[#ffcdb2] text-[9px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 border border-[#ffcdb2]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffcdb2] animate-ping" />
                            EN VIVO
                          </span>
                          <span className="font-mono text-[10px] text-outline uppercase tracking-wider">
                            {match.disciplineName}
                          </span>
                        </div>

                        {/* Match Scores */}
                        <div className="flex items-center gap-6 justify-center my-1 sm:my-0">
                          <div className="text-right">
                            <span className="font-display text-sm font-bold text-white block">{match.teamA.name}</span>
                          </div>
                          <div className="bg-surface-dim py-1 px-3 border border-glass-border rounded font-mono font-bold text-lg text-[#ffcdb2] min-w-[70px] text-center shadow-[0_0_10px_rgba(255,205,178,0.1)]">
                            {match.teamA.score} - {match.teamB.score}
                          </div>
                          <div className="text-left">
                            <span className="font-display text-sm font-bold text-white block">{match.teamB.name}</span>
                          </div>
                        </div>

                        <button
                          id={`quick-watch-btn-${match.id}`}
                          onClick={() => {
                            setSelectedMatchForStream(match);
                            setActiveTab('matches');
                          }}
                          className="w-full sm:w-auto bg-gradient-to-r from-[#ffcdb2] to-[#2b4c7e] text-black text-[10px] font-mono font-extrabold uppercase tracking-wider py-2.5 px-4 rounded-lg hover:shadow-[0_0_20px_rgba(255,205,178,0.5)] transition-all flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.02]"
                        >
                          <span className="material-symbols-outlined text-sm select-none">play_circle</span>
                          Ver Stream
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Daily Quest Section */}
                <section className="bg-gradient-to-r from-[#17253d] via-[#0a1020] to-surface-card border border-[#ffcdb2]/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_0_30px_rgba(255,205,178,0.1)]">
                  <div className="flex gap-3">
                    <div className="bg-[#ffcdb2]/15 border border-[#ffcdb2]/40 rounded-xl p-2.5 flex items-center justify-center text-[#ffcdb2] shadow-[0_0_15px_rgba(255,205,178,0.25)]">
                      <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>sports_fire</span>
                    </div>
                    <div>
                      <span className="bg-[#ffcdb2]/25 text-[#ffeedd] text-[8px] font-mono font-black px-2 py-0.5 rounded border border-[#ffcdb2]/35 tracking-widest">MISIÓN EXCLUSIVA</span>
                      <h4 className="font-display text-sm font-black text-white mt-1 uppercase tracking-tight">¡Clasificación Universitaria!</h4>
                      <p className="font-sans text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Completa una victoria de disciplina para ganar un bonus masivo de +400 XP.
                      </p>
                    </div>
                  </div>
                  <button
                    id="go-to-quests-tab-link"
                    onClick={() => setActiveTab('quests')}
                    className="w-full sm:w-auto bg-[#ffcdb2] hover:bg-[#ffe1d1] text-black py-2.5 px-4 rounded-xl font-mono text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,205,178,0.4)] hover:shadow-[0_0_30px_rgba(255,205,178,0.65)] cursor-pointer transform hover:scale-[1.02]"
                  >
                    Ir a Misiones
                  </button>
                </section>
              </motion.div>
            )}

            {/* TAB 2: MATCH CENTER */}
            {activeTab === 'matches' && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex-1 flex flex-col"
              >
                {!selectedMatchForStream ? (
                  <>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-glass-border/30 pb-4">
                      <div>
                        <h2 className="font-display text-lg font-extrabold text-white tracking-tight uppercase">
                          Centro de Partidos
                        </h2>
                        <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                          Sigue en vivo los encuentros de los seleccionados de la UNDC.
                        </p>
                      </div>

                      {/* Filters */}
                      <div className="flex bg-surface border border-glass-border rounded-lg p-1 overflow-x-auto">
                        {(['all', 'live', 'upcoming', 'finished'] as const).map((filter) => (
                          <button
                            id={`match-filter-btn-${filter}`}
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              activeFilter === filter
                                ? 'bg-[#1F2630] text-primary'
                                : 'text-outline hover:text-white'
                            }`}
                          >
                            {filter === 'all' ? 'Todos' : filter === 'live' ? 'En Vivo' : filter === 'upcoming' ? 'Próximos' : 'Finalizados'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div id="matches-display-grid" className="grid grid-cols-1 gap-3.5">
                      {activeMatches.map((match) => {
                        const isLive = match.status === 'live';
                        const isFinished = match.status === 'finished';
                        const isInterested = profile.selectedDisciplines.includes(match.disciplineId);

                        return (
                          <div
                            id={`match-card-${match.id}`}
                            key={match.id}
                            className={`neon-glass-card rounded-2xl overflow-hidden relative ${
                              isLive 
                                ? 'border-[#ffcdb2]/45 shadow-[0_0_20px_rgba(255,205,178,0.18)]' 
                                : isInterested 
                                ? 'border-[#2b4c7e]/30 shadow-[0_0_15px_rgba(43,76,126,0.05)]' 
                                : 'border-glass-border/40'
                            }`}
                          >
                            {/* Decorative stripe on the left */}
                            <div 
                              className={`absolute left-0 inset-y-0 w-1.5 ${
                                isLive ? 'bg-[#ffcdb2]' : isInterested ? 'bg-[#2b4c7e]' : 'bg-outline-variant/60'
                              }`} 
                            />

                            <div className="p-4 pl-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex items-center gap-3">
                                {isLive ? (
                                  <span className="bg-[#ffcdb2]/10 text-[#ffcdb2] text-[9px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 select-none border border-[#ffcdb2]/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffcdb2] animate-ping" />
                                    EN VIVO
                                  </span>
                                ) : isFinished ? (
                                  <span className="bg-[#1e2023] text-outline text-[9px] font-mono font-bold px-2 py-0.5 rounded select-none">
                                    FINALIZADO
                                  </span>
                                ) : (
                                  <span className="bg-[#2b4c7e]/10 text-[#2b4c7e] text-[9px] font-mono font-bold px-2 py-0.5 rounded select-none border border-[#2b4c7e]/20">
                                    PRÓXIMO
                                  </span>
                                )}
                                <span className="font-mono text-[10px] text-outline font-bold uppercase tracking-wider">
                                  {match.disciplineName}
                                </span>
                                {isInterested && (
                                  <span className="text-[9px] font-mono font-bold text-[#ffcdb2] bg-[#ffcdb2]/10 border border-[#ffcdb2]/20 px-1.5 rounded select-none">
                                    TU DISCIPLINA
                                  </span>
                                )}
                              </div>

                              <span className="font-mono text-[10px] text-on-surface-variant">
                                {match.timeString}
                              </span>
                            </div>

                            {/* Contestants and Score area */}
                            <div className="px-6 py-4 border-t border-b border-glass-border/30 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#131b2e]/40">
                              <div className="flex-1 text-center sm:text-right">
                                <span className="font-display text-sm sm:text-base font-extrabold text-white block">
                                  {match.teamA.name}
                                </span>
                              </div>

                              <div className="flex flex-col items-center gap-1">
                                <div className="bg-[#050811] border border-glass-border px-4 py-2 rounded-lg font-mono font-black text-xl text-[#ffcdb2] min-w-[90px] text-center tracking-wider select-all shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                                  {isFinished || isLive ? (
                                    <span>
                                      {match.teamA.score} - {match.teamB.score}
                                    </span>
                                  ) : (
                                    <span className="text-outline text-xs tracking-normal">VS</span>
                                  )}
                                </div>
                                <span className="font-mono text-[8.5px] text-outline-variant uppercase tracking-widest text-center mt-0.5">
                                  {match.venueOrPlatform}
                                </span>
                              </div>

                              <div className="flex-1 text-center sm:text-left">
                                <span className="font-display text-sm sm:text-base font-extrabold text-white block">
                                  {match.teamB.name}
                                </span>
                              </div>
                            </div>

                            {/* Card actions */}
                            <div className="p-3.5 pl-6 flex justify-between items-center bg-[#131b2e]/20">
                              <span className="font-sans text-xs text-on-surface-variant flex items-center gap-1 max-w-[250px] truncate">
                                <span className="material-symbols-outlined text-xs text-outline select-none">info</span>
                                {match.description}
                              </span>

                              {isLive && (
                                <button
                                  id={`watch-match-stream-btn-${match.id}`}
                                  onClick={() => setSelectedMatchForStream(match)}
                                  className="bg-gradient-to-r from-[#ffcdb2] to-[#2b4c7e] text-black text-[10px] font-mono font-extrabold uppercase tracking-wider py-1.5 px-4 rounded-md transition-all flex items-center gap-1 cursor-pointer hover:shadow-[0_0_15px_rgba(255,205,178,0.4)] transform hover:scale-[1.02]"
                                >
                                  <span className="material-symbols-outlined text-sm select-none">live_tv</span>
                                  Sintonizar Stream
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {activeMatches.length === 0 && (
                        <div className="text-center py-10 bg-surface-card border border-glass-border rounded-xl">
                          <span className="material-symbols-outlined text-4xl text-outline-variant select-none mb-2">sports_and_outdoors</span>
                          <p className="font-sans text-sm text-outline font-semibold">No se encontraron encuentros en esta categoría.</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* SIMULATOR STREAM INTERFACE (IMMERSIVE VIDEO PLAYER) */
                  <div className="flex-1 flex flex-col gap-4">
                    {/* Return button */}
                    <button
                      id="close-stream-btn"
                      onClick={() => setSelectedMatchForStream(null)}
                      className="flex items-center gap-1 text-xs font-mono font-semibold text-primary hover:text-white transition-colors text-left bg-transparent border-none cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
                      Volver al Listado de Partidos
                    </button>

                    {/* Stream Split Pane */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 border border-glass-border/30 rounded-xl overflow-hidden bg-[#07090d]">
                      {/* Video screen pane */}
                      <div className="lg:col-span-2 relative flex flex-col justify-between p-4 bg-[#0a0f18] min-h-[300px]">
                        {/* Stream HUD overlay top */}
                        <div className="flex justify-between items-center z-10">
                          <div className="flex items-center gap-2">
                            <span className="bg-status-live text-white text-[8px] font-mono font-black px-1.5 py-0.5 rounded flex items-center gap-1 select-none">
                              <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                              RETRANSMISIÓN CORE
                            </span>
                            <span className="text-[10px] font-mono text-outline font-bold uppercase tracking-wider">
                              {selectedMatchForStream.disciplineName}
                            </span>
                          </div>

                          <div className="bg-background/80 border border-glass-border rounded-full py-0.5 px-2 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs text-outline select-none">group</span>
                            <span className="font-mono text-[9px] font-bold text-white">
                              {selectedMatchForStream.liveViewers} ESPECTADORES
                            </span>
                          </div>
                        </div>

                        {/* Animated Visual Match Simulator */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center z-0 p-8 select-none">
                          <div className="text-center space-y-4">
                            {/* Neon spinning orbit indicator */}
                            <div className="relative w-16 h-16 mx-auto">
                              <div className="absolute inset-0 border-4 border-dashed border-primary-container/30 rounded-full animate-[spin_10s_linear_infinite]" />
                              <div className="absolute inset-2 border-4 border-dashed border-secondary-container/40 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
                              <div className="absolute inset-4 bg-background border border-glass-border rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg text-primary select-none animate-pulse">sensors</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-center gap-3 font-display text-lg font-extrabold text-white">
                                <span>{selectedMatchForStream.teamA.name}</span>
                                <span className="text-secondary-container bg-surface px-2.5 py-0.5 border border-glass-border rounded">
                                  {selectedMatchForStream.teamA.score}
                                </span>
                                <span className="text-outline text-xs">vs</span>
                                <span className="text-secondary-container bg-surface px-2.5 py-0.5 border border-glass-border rounded">
                                  {selectedMatchForStream.teamB.score}
                                </span>
                                <span>{selectedMatchForStream.teamB.name}</span>
                              </div>
                              <p className="font-mono text-[10px] text-outline mt-1 uppercase tracking-wider">
                                {selectedMatchForStream.timeString}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Stream HUD overlay bottom */}
                        <div className="flex justify-between items-center z-10 mt-auto">
                          {/* Controls */}
                          <div className="flex items-center gap-3">
                            <button className="w-8 h-8 rounded-full bg-background/80 hover:bg-surface-card border border-glass-border text-white flex items-center justify-center transition-colors cursor-pointer select-none">
                              <span className="material-symbols-outlined text-base select-none">pause</span>
                            </button>
                            <button className="w-8 h-8 rounded-full bg-background/80 hover:bg-surface-card border border-glass-border text-white flex items-center justify-center transition-colors cursor-pointer select-none">
                              <span className="material-symbols-outlined text-base select-none">volume_up</span>
                            </button>
                            <div className="h-4 w-[1px] bg-outline-variant/50" />
                            <span className="font-mono text-[10px] text-[#2ff801] font-bold tracking-widest uppercase">
                              1080P60 HD
                            </span>
                          </div>

                          <div className="text-right text-[10px] font-mono text-outline">
                            ALIMENTADOR EN VIVO DESDE EL POLIDEPORTIVO
                          </div>
                        </div>
                      </div>

                      {/* Chat Sidebar Pane */}
                      <div className="border-t lg:border-t-0 lg:border-l border-glass-border/30 flex flex-col bg-surface-card">
                        {/* Chat header */}
                        <div className="p-3 border-b border-glass-border/30 bg-[#0a1020] flex justify-between items-center">
                          <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white">
                            Chat de la Comunidad
                          </span>
                          <span className="bg-[#ffcdb2]/10 text-[#ffcdb2] border border-[#ffcdb2]/20 text-[7px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                            MODERADO
                          </span>
                        </div>

                        {/* Chat scrolling log */}
                        <div id="stream-chat-box" className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[220px] lg:max-h-[300px]">
                          {streamChat.map((chat, i) => (
                            <div key={i} className="text-xs leading-snug">
                              <span 
                                className={`font-mono text-[10px] font-bold mr-1.5 ${
                                  chat.sender === profile.nickname 
                                    ? 'text-[#ffcdb2]' 
                                    : chat.team === 'UNDC' 
                                    ? 'text-[#2b4c7e]' 
                                    : 'text-error'
                                }`}
                              >
                                {chat.sender}:
                              </span>
                              <span className="text-on-surface-variant font-sans text-[11.5px]">
                                {chat.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Chat input box */}
                        <form onSubmit={handleSendChat} className="p-2 border-t border-glass-border/30 bg-[#0a1020]">
                          <div className="flex gap-1.5 bg-background border border-glass-border rounded-lg p-1.5">
                            <input
                              id="chat-text-input"
                              type="text"
                              placeholder="Anima a tu equipo..."
                              className="flex-1 bg-transparent border-none text-xs text-white outline-none px-1.5"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button
                              id="send-chat-btn"
                              type="submit"
                              className="w-7 h-7 bg-primary-container text-white rounded-md flex items-center justify-center hover:bg-primary transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm select-none">send</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: QUESTS / MISIONES */}
            {activeTab === 'quests' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h2 className="font-display text-lg font-extrabold text-white tracking-tight uppercase">
                    Misiones de Atleta
                  </h2>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    Completa objetivos deportivos para ganar Experiencia (XP) y subir tu reputación en la UNDC.
                  </p>
                </div>

                <div id="quests-list-container" className="grid grid-cols-1 gap-4">
                  {quests.map((quest) => {
                    const isClaimed = quest.isClaimed;
                    const isCompleted = quest.isCompleted;
                    const isMatched = !quest.disciplineId || profile.selectedDisciplines.includes(quest.disciplineId);

                    return (
                      <div
                        id={`quest-card-${quest.id}`}
                        key={quest.id}
                        className={`bg-surface-card border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                          isClaimed 
                            ? 'opacity-45 border-glass-border' 
                            : isCompleted 
                            ? 'border-secondary-container/40 bg-secondary-container/5 shadow-[0_0_15px_rgba(47,248,1,0.02)]' 
                            : isMatched 
                            ? 'border-primary-container/20' 
                            : 'border-glass-border'
                        }`}
                      >
                        <div className="flex gap-3.5 items-start">
                          <div className={`p-2.5 rounded-lg border flex items-center justify-center mt-0.5 ${
                            isClaimed 
                              ? 'bg-[#1a1c1f] border-glass-border text-outline' 
                              : isCompleted 
                              ? 'bg-secondary-container/10 border-secondary-container/30 text-secondary-container' 
                              : 'bg-primary-container/10 border-primary-container/30 text-primary-container'
                          }`}>
                            <span className="material-symbols-outlined text-2xl select-none">
                              {isCompleted ? 'task_alt' : 'sports_gymnastics'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-sm font-bold text-white tracking-tight leading-tight">
                                {quest.title}
                              </h4>
                              {quest.disciplineId && (
                                <span className="bg-[#24221e] border border-glass-border text-[8.5px] font-mono font-bold text-primary-container px-2 rounded uppercase select-none">
                                  {quest.disciplineId}
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed max-w-md">
                              {quest.description}
                            </p>
                          </div>
                        </div>

                        <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-3 border-t sm:border-t-0 border-glass-border/20 pt-3 sm:pt-0">
                          <div>
                            <span className="font-mono text-[9px] text-outline uppercase tracking-wider block sm:text-right">Recompensa</span>
                            <span className="font-display text-sm font-black text-secondary-container sm:text-right block">
                              +{quest.xpReward} XP
                            </span>
                          </div>

                          {isClaimed ? (
                            <span className="bg-surface/50 border border-glass-border px-3 py-1.5 rounded-md text-[10px] font-mono text-outline font-bold uppercase select-none">
                              RECLAMADO
                            </span>
                          ) : isCompleted ? (
                            <button
                              id={`claim-xp-btn-${quest.id}`}
                              onClick={() => handleClaimXp(quest.id, quest.xpReward)}
                              className="bg-secondary-container hover:bg-[#25cc02] text-[#022100] font-display text-[10px] font-black uppercase tracking-wider py-1.5 px-3.5 rounded-lg transition-all animate-pulse hover:animate-none cursor-pointer"
                            >
                              Reclamar XP
                            </button>
                          ) : (
                            <button
                              id={`simulate-complete-btn-${quest.id}`}
                              onClick={() => handleSimulateQuestComplete(quest.id)}
                              className="bg-surface-card hover:bg-surface border border-glass-border text-on-surface text-[10px] font-mono font-semibold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                            >
                              Marcar Hecho
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 4: ACHIEVEMENTS / LOGROS */}
            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex-1"
              >
                <div>
                  <h2 className="font-display text-lg font-extrabold text-white tracking-tight uppercase">
                    Logros & Trofeos
                  </h2>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    Hitos competitivos desbloqueados en representación de la Universidad Nacional de Cañete.
                  </p>
                </div>

                <div id="achievements-gallery" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Achievement 1 */}
                  <div className="bg-surface-card border border-[#ffcdb2]/20 p-4 rounded-xl flex gap-3.5 items-start">
                    <div className="w-11 h-11 rounded-lg bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-[#ffcdb2] select-none">
                      <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    </div>
                    <div>
                      <span className="font-mono text-[8.5px] text-[#ffcdb2] font-bold tracking-widest uppercase">INSIGNIA DE ORO</span>
                      <h4 className="font-display text-sm font-bold text-white mt-0.5">Espíritu Competitivo</h4>
                      <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Completa exitosamente el registro en el circuito de atletas CORE de la UNDC.
                      </p>
                      <span className="inline-block bg-[#050811] border border-glass-border rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-[#ffcdb2] mt-2 select-none">
                        DESBLOQUEADO ✔
                      </span>
                    </div>
                  </div>

                  {/* Achievement 2 */}
                  <div className="bg-surface-card border border-[#ffcdb2]/20 p-4 rounded-xl flex gap-3.5 items-start">
                    <div className="w-11 h-11 rounded-lg bg-tertiary/10 border border-tertiary/30 flex items-center justify-center text-[#ffcdb2] select-none">
                      <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                    </div>
                    <div>
                      <span className="font-mono text-[8.5px] text-[#ffcdb2] font-bold tracking-widest uppercase">INSIGNIA DE ORO</span>
                      <h4 className="font-display text-sm font-bold text-white mt-0.5">Atleta Verificado</h4>
                      <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Verifica tu identidad con un correo electrónico institucional activo de la UNDC.
                      </p>
                      <span className="inline-block bg-[#050811] border border-glass-border rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-[#ffcdb2] mt-2 select-none">
                        DESBLOQUEADO ✔
                      </span>
                    </div>
                  </div>

                  {/* Achievement 3 */}
                  <div className="bg-surface-card/60 border border-glass-border p-4 rounded-xl flex gap-3.5 items-start opacity-55 hover:opacity-100 transition-opacity">
                    <div className="w-11 h-11 rounded-lg bg-[#1f293d]/50 border border-glass-border flex items-center justify-center text-outline select-none">
                      <span className="material-symbols-outlined text-2xl select-none">lock</span>
                    </div>
                    <div>
                      <span className="font-mono text-[8.5px] text-outline font-bold tracking-widest uppercase">INSIGNIA DE PLATA</span>
                      <h4 className="font-display text-sm font-bold text-white mt-0.5">Campeón de Zona</h4>
                      <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Consigue un podio destacado (Top 3) en cualquiera de los torneos oficiales presenciales.
                      </p>
                      <span className="inline-block bg-[#050811] border border-glass-border rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-outline mt-2 select-none">
                        BLOQUEADO 🔒
                      </span>
                    </div>
                  </div>

                  {/* Achievement 4 */}
                  <div className="bg-surface-card/60 border border-glass-border p-4 rounded-xl flex gap-3.5 items-start opacity-55 hover:opacity-100 transition-opacity">
                    <div className="w-11 h-11 rounded-lg bg-[#1f293d]/50 border border-glass-border flex items-center justify-center text-outline select-none">
                      <span className="material-symbols-outlined text-2xl select-none">lock</span>
                    </div>
                    <div>
                      <span className="font-mono text-[8.5px] text-outline font-bold tracking-widest uppercase">INSIGNIA DE BRONCE</span>
                      <h4 className="font-display text-sm font-bold text-white mt-0.5">Invocador Letal</h4>
                      <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Completa todas las misiones asociadas a LoL Esports o Valorant en una sola temporada.
                      </p>
                      <span className="inline-block bg-[#050811] border border-glass-border rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-outline mt-2 select-none">
                        BLOQUEADO 🔒
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: ATHLETE PASS */}
            {activeTab === 'pass' && (
              <motion.div
                key="pass"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 flex-1 flex flex-col items-center"
              >
                <div className="text-center max-w-sm">
                  <h2 className="font-display text-lg font-extrabold text-white tracking-tight uppercase">
                    Pase Digital de Atleta
                  </h2>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    Tu credencial deportiva digitalizada de la Universidad Nacional de Cañete.
                  </p>
                </div>

                <DigitalPass profile={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
