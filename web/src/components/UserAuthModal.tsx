import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FactionType } from '../types';
import { 
  X, 
  User, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  LogOut, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  AtSign, 
  BadgeCheck, 
  ArrowLeft,
  Fingerprint
} from 'lucide-react';

const AVATAR_OPTIONS = [
  {
    id: 'av-1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    label: 'Cyber-Sentinel',
  },
  {
    id: 'av-2',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    label: 'Astral-Weaver',
  },
  {
    id: 'av-3',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    label: 'Quantvm-Nomad',
  },
  {
    id: 'av-4',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    label: 'Neon-Architect',
  },
];

const FACTION_OPTIONS: { type: FactionType; desc: string; color: string }[] = [
  {
    type: 'Arquitectos Quantvm',
    desc: 'Constructores de la infraestructura digital e innovadores de la interfaz.',
    color: '#0072ff',
  },
  {
    type: 'Nómadas Cósmicos',
    desc: 'Exploradores de la frontera, recolectores de reliquias y comerciantes.',
    color: '#ff007f',
  },
  {
    type: 'Tejedores Estelares',
    desc: 'Guardianes de la narrativa, filósofos y artistas de la matriz.',
    color: '#8a2be2',
  },
];

export const UserAuthModal: React.FC = () => {
  const { 
    player, 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginUser, 
    logoutUser, 
    updatePlayerProfile, 
    playSoundEffect,
    setActiveTab,
    setIsDailyCheckInOpen
  } = usePlayer();

  const [activeTab, setActiveTabMode] = useState<'register' | 'login' | 'forgot'>('register');

  // Register Fields
  const [fullName, setFullName] = useState(player.name || '');
  const [username, setUsername] = useState('@operador_01');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptNews, setAcceptNews] = useState(false);
  const [factionInput, setFactionInput] = useState<FactionType>(player.faction || 'Arquitectos Quantvm');
  const [avatarInput, setAvatarInput] = useState(player.avatarUrl || AVATAR_OPTIONS[0].url);

  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  // Forgot Password Fields
  const [forgotEmail, setForgotEmail] = useState('');

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isAuthModalOpen) return null;

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate password strength
  const checkPasswordRules = (pass: string) => {
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      symbol: /[^A-Za-z0-9]/.test(pass)
    };
  };

  const rules = checkPasswordRules(registerPassword);
  const rulesMetCount = Object.values(rules).filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!registerPassword) return { label: 'Seguridad: --', color: 'bg-white/10' };
    if (rulesMetCount <= 1) return { label: 'Seguridad: Muy débil', color: 'bg-red-500' };
    if (rulesMetCount === 2) return { label: 'Seguridad: Media', color: 'bg-amber-500' };
    if (rulesMetCount === 3) return { label: 'Seguridad: Buena', color: 'bg-yellow-400' };
    return { label: 'Seguridad: Excelente', color: 'bg-emerald-400' };
  };

  const getInitials = (name: string) => {
    if (!name.trim()) return 'MV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Debes ingresar tu nombre completo', 'error');
      return;
    }
    if (registerPassword.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    if (registerPassword !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (!acceptTerms) {
      showToast('Debes aceptar los Términos y Condiciones', 'error');
      return;
    }

    playSoundEffect('portal');
    loginUser(fullName, factionInput);
    updatePlayerProfile(fullName, factionInput, avatarInput);
    showToast('¡Identidad vinculada con éxito en la Quantvm Matrix!', 'success');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
      setIsDailyCheckInOpen(true);
    }, 800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Por favor completa tu correo y contraseña', 'error');
      return;
    }

    playSoundEffect('portal');
    const nameFromEmail = loginEmail.split('@')[0];
    loginUser(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1), factionInput);
    showToast('¡Sesión iniciada correctamente!', 'success');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
      setIsDailyCheckInOpen(true);
    }, 800);
  };

  const handleGoogleAuth = () => {
    playSoundEffect('click');
    playSoundEffect('portal');
    loginUser('Operador_Google', 'Arquitectos Quantvm');
    showToast('Autenticación mediante Google completada', 'success');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
      setIsDailyCheckInOpen(true);
    }, 800);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Introduce tu correo electrónico', 'error');
      return;
    }
    playSoundEffect('click');
    showToast(`Enlace de recuperación enviado a ${forgotEmail}`, 'success');
    setTimeout(() => {
      setActiveTabMode('login');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05060a]/90 backdrop-blur-xl animate-fade-in font-orbitron overflow-y-auto">
      
      {/* Background Matrix Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#76e8ff 1px, transparent 1px),
            linear-gradient(90deg, #76e8ff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-xl bg-[#0c111c]/95 border border-[#76e8ff]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(118,232,255,0.2)] overflow-hidden my-8">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f]" />

        {/* Close Button */}
        <button
          onClick={() => {
            playSoundEffect('click');
            setIsAuthModalOpen(false);
          }}
          className="absolute top-5 right-5 p-2 bg-[#05060a] border border-[#76e8ff]/30 text-[#a0a5b5] hover:text-[#f8f9fa] hover:border-[#7fffd4] transition-all rounded-full cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className={`mb-4 p-3 rounded-xl border text-xs font-bold tracking-wider flex items-center gap-2 animate-fade-in ${
            toastMessage.type === 'error' 
              ? 'bg-red-500/20 border-red-500/50 text-red-200' 
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
          }`}>
            <BadgeCheck className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-[10px] tracking-[2px] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span>QUANTVM MATRIX ACCESS PORTAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-audiowide text-white uppercase tracking-tight drop-shadow-[0_0_15px_rgba(118,232,255,0.5)]">
            {player.isLoggedIn ? 'Perfil de Operador' : 'ACCESS PORTAL'}
          </h2>
          <p className="text-xs text-[#d6dff3]">
            {player.isLoggedIn 
              ? `Operador Sincronizado: ${player.name} (${player.faction})`
              : 'Ingresa o crea una nueva conciencia dentro de la Matrix.'}
          </p>
        </div>

        {/* Mode Tabs */}
        {!player.isLoggedIn && (
          <div className="flex gap-2 mb-6 p-1 bg-[#05060a] rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setActiveTabMode('register');
              }}
              className={`flex-1 py-3 text-xs font-audiowide uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#8a2be2]/20 border border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'text-[#a0a5b5] hover:text-white hover:bg-white/5'
              }`}
            >
              Registro
            </button>
            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setActiveTabMode('login');
              }}
              className={`flex-1 py-3 text-xs font-audiowide uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#8a2be2]/20 border border-[#00f0ff] text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'text-[#a0a5b5] hover:text-white hover:bg-white/5'
              }`}
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        {/* TAB 1: REGISTRO FORM */}
        {activeTab === 'register' && !player.isLoggedIn && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            
            {/* Avatar Preview & Initials */}
            <div className="flex flex-col items-center justify-center gap-2 mb-2">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00f0ff] via-[#8a2be2] to-[#ff007f] p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <div className="w-full h-full rounded-full bg-[#05060a] flex items-center justify-center text-xl font-bold font-audiowide text-[#76e8ff]">
                  {getInitials(fullName)}
                </div>
              </div>
              <span className="text-[10px] text-[#a0a5b5] tracking-widest uppercase">
                Avatar Temporal Generado
              </span>
            </div>

            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Nombre Completo
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: James Doe"
                  className="w-full pl-10 pr-4 py-3 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
            </div>

            {/* Alias */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Alias de Operador
              </label>
              <div className="relative flex items-center">
                <AtSign className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@jugador_00"
                  className="w-full pl-10 pr-4 py-3 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
              <p className="text-[10px] text-[#a0a5b5]">Este nombre será público dentro de MagnopVS.</p>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
            </div>

            {/* Faction Selector */}
            <div className="space-y-1">
              <label className="text-xs text-[#7fffd4] font-bold uppercase tracking-wider block">
                Facción de Inclinación
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FACTION_OPTIONS.map((f) => (
                  <button
                    key={f.type}
                    type="button"
                    onClick={() => {
                      playSoundEffect('click');
                      setFactionInput(f.type);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      factionInput === f.type
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'bg-[#05060a] border-white/10 text-[#a0a5b5] hover:border-white/30'
                    }`}
                  >
                    <div className="text-[10px] font-bold font-audiowide uppercase truncate">{f.type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 text-[#a0a5b5] hover:text-white"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Strength Meter */}
            {registerPassword && (
              <div className="space-y-1.5 p-2.5 rounded-xl bg-[#05060a] border border-white/5">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-[#a0a5b5]">{getStrengthLabel().label}</span>
                  <span className="text-[#76e8ff]">{rulesMetCount}/4 Reglas</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getStrengthLabel().color}`}
                    style={{ width: `${(rulesMetCount / 4) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] pt-1">
                  <div className={rules.length ? 'text-emerald-400' : 'text-gray-500'}>
                    {rules.length ? '✓' : '○'} Mínimo 8 caracteres
                  </div>
                  <div className={rules.uppercase ? 'text-emerald-400' : 'text-gray-500'}>
                    {rules.uppercase ? '✓' : '○'} Una mayúscula
                  </div>
                  <div className={rules.number ? 'text-emerald-400' : 'text-gray-500'}>
                    {rules.number ? '✓' : '○'} Un número
                  </div>
                  <div className={rules.symbol ? 'text-emerald-400' : 'text-gray-500'}>
                    {rules.symbol ? '✓' : '○'} Un símbolo
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Confirmar Contraseña
              </label>
              <div className="relative flex items-center">
                <Key className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-[#a0a5b5] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1 text-[11px] text-[#a0a5b5]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 accent-[#00f0ff] rounded"
                />
                <span>Acepto los Términos y Condiciones y la Política de Privacidad del Cosmos.</span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={acceptNews}
                  onChange={(e) => setAcceptNews(e.target.checked)}
                  className="mt-0.5 accent-[#00f0ff] rounded"
                />
                <span>Deseo recibir noticias, eventos y transmisiones de MagnopVS.</span>
              </label>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#8a2be2] to-[#ff007f] text-white font-audiowide font-bold text-xs tracking-widest uppercase hover:brightness-125 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Fingerprint className="w-4 h-4 text-[#7fffd4]" />
              <span>Vincular Identidad</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-[#a0a5b5] uppercase tracking-wider">o continuar con</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

          </form>
        )}

        {/* TAB 2: INICIAR SESIÓN FORM */}
        {activeTab === 'login' && !player.isLoggedIn && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Contraseña
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3.5 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 text-[#a0a5b5] hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs text-[#a0a5b5] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="accent-[#00f0ff] rounded"
                />
                <span>Mantener sesión iniciada</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setActiveTabMode('forgot');
                }}
                className="text-[#00f0ff] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#0072ff] to-[#8a2be2] text-white font-audiowide font-bold text-xs tracking-widest uppercase hover:brightness-125 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4 text-[#7fffd4]" />
              <span>Iniciar Sesión</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-[#a0a5b5] uppercase tracking-wider">o continuar con</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-orbitron text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {activeTab === 'forgot' && !player.isLoggedIn && (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-left">
            <div className="text-center space-y-2 mb-4">
              <h3 className="font-audiowide text-lg text-[#00f0ff] uppercase">Recuperar Acceso</h3>
              <p className="text-xs text-[#a0a5b5]">
                Introduce tu correo electrónico y te enviaremos un enlace cuántico para restablecer tu contraseña.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#d6dff3] font-bold uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#76e8ff]" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#05060a] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#00f0ff] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0072ff] text-white font-audiowide font-bold text-xs tracking-widest uppercase hover:brightness-125 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer mt-4"
            >
              Enviar Enlace
            </button>

            <button
              type="button"
              onClick={() => {
                playSoundEffect('click');
                setActiveTabMode('login');
              }}
              className="w-full py-3 rounded-xl border border-white/10 bg-transparent text-[#a0a5b5] hover:text-white font-orbitron text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Iniciar Sesión</span>
            </button>
          </form>
        )}

        {/* LOGGED IN USER PROFILE MODE */}
        {player.isLoggedIn && (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#05060a] border border-[#00f0ff]/30">
              <img src={player.avatarUrl} alt={player.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#00f0ff]" />
              <div>
                <h3 className="font-audiowide text-lg text-white">{player.name}</h3>
                <span className="inline-block text-xs text-[#7fffd4] font-bold">{player.faction}</span>
                <p className="text-[10px] text-[#a0a5b5] uppercase mt-0.5">Nivel {player.level} • {player.exp} EXP</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  logoutUser();
                  setIsAuthModalOpen(false);
                }}
                className="px-5 py-3 border border-[#ff007f]/40 text-[#ff007f] hover:bg-[#ff007f]/10 text-xs font-audiowide uppercase flex items-center gap-2 transition-all cursor-pointer rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSoundEffect('click');
                  setIsAuthModalOpen(false);
                  setActiveTab('dashboard');
                }}
                className="px-6 py-3 bg-[#00f0ff] text-[#05060a] font-black font-audiowide text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 transition-all cursor-pointer rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ir al Dashboard</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
