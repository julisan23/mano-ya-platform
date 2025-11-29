import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, MapPin, Star, Phone, CheckCircle, Search, Wrench, AlertTriangle, ArrowRight, Menu, Bot, Sparkles, Megaphone, Copy, Camera, ScanFace, CreditCard, UserCheck, X, FileText, ChevronRight, RefreshCw, Smartphone, TrendingUp, Users, Briefcase, Activity, Terminal, Lock, Check, Image, ChevronDown, ChevronUp, Mail, KeyRound, Upload, Plus } from 'lucide-react';
import { UserRequest, Professional, AIAnalysisResult, MarketingStrategy, CompanyStats, CorporateAction, TradeType } from './types';
import { LOCATIONS_BA, MOCK_PROFESSIONALS } from './constants';
import { analyzeServiceRequest, generateMarketingCampaign, consultCEO } from './services/geminiService';
import { saveUserRegistration, saveProfessionalRegistration } from './services/dataService';
import PayPalButton from './components/PayPalButton';
import MercadoPagoButton from './components/MercadoPagoButton';
import CameraCapture from './components/CameraCapture';

type AppStep = 'LANDING' | 'FORM' | 'ANALYZING' | 'LIST' | 'VERIFICATION' | 'PRO_DETAILS' | 'PAYMENT' | 'CONTACT' | 'PRESIDENT_DASHBOARD';
type VerificationStep = 'EMAIL_CHECK' | 'INTRO' | 'DNI_FRONT' | 'DNI_BACK' | 'SELFIE' | 'PROCESSING' | 'SUCCESS';

// REPLACE THIS WITH YOUR REAL MERCADO PAGO PAYMENT LINK FROM YOUR DASHBOARD
const MP_PAYMENT_LINK = "https://link.mercadopago.com.ar/manoya"; 
const ADMIN_PASSWORD = "1234";

// --- Subcomponent: Professional Card with Portfolio ---
const ProfessionalCard: React.FC<{ pro: Professional; onSelect: (p: Professional) => void }> = ({ pro, onSelect }) => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
          <img src={pro.imageUrl} alt={pro.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white shadow-sm" />
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star className="w-4 h-4 fill-current" />
              {pro.rating}
            </div>
            <span className="text-xs text-slate-400">({pro.reviewCount} reseñas)</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                {pro.name} 
                {pro.verified && <ShieldCheck className="w-4 h-4 text-brand-500" title="Identidad Verificada" />}
              </h3>
              <div className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3" /> {pro.location}
              </div>
            </div>
            <div className="text-right hidden md:block">
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{pro.trade}</span>
            </div>
          </div>
          
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{pro.description}</p>
          
          {pro.reviews.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-lg mb-4 text-xs text-slate-600 italic border-l-2 border-brand-200">
                "{pro.reviews[0].comment}" - {pro.reviews[0].author}
              </div>
          )}

          <div className="flex flex-wrap items-center justify-between mt-auto pt-4 border-t border-slate-100 gap-4">
            <div className="text-sm font-medium text-slate-500">
              {pro.hourlyRateArg ? `Est. $${pro.hourlyRateArg.toLocaleString('es-AR')} / hr` : 'Precio a convenir'}
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {pro.portfolio.length > 0 && (
                <button 
                  onClick={() => setShowPortfolio(!showPortfolio)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  {showPortfolio ? 'Ocultar' : 'Ver Trabajos'}
                  {showPortfolio ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              <button 
                onClick={() => onSelect(pro)}
                className="flex-1 sm:flex-none bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Contactar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      {showPortfolio && pro.portfolio.length > 0 && (
        <div className="mt-2 pt-4 border-t border-slate-100 animate-fade-in">
          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-500" /> Portafolio de Trabajos
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pro.portfolio.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-3">
                  <h5 className="font-bold text-xs text-slate-900 mb-1">{item.title}</h5>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('LANDING');
  const [userRequest, setUserRequest] = useState<UserRequest>({
    name: '',
    email: '',
    phone: '',
    location: '',
    problemDescription: ''
  });
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [filteredPros, setFilteredPros] = useState<Professional[]>([]);
  
  // Verification State
  const [verifStep, setVerifStep] = useState<VerificationStep>('EMAIL_CHECK');
  const [isProFlow, setIsProFlow] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  // Specifically for Pros to enter email before code
  const [proEmailSent, setProEmailSent] = useState(false);
  
  // Professional Details State
  const [proDetails, setProDetails] = useState({
    email: '', // Capture email here for pros
    trade: TradeType.VARIOS,
    description: '',
    portfolioFiles: [] as string[]
  });
  
  // Real Biometric Data Storage
  const [biometricData, setBiometricData] = useState({
    dniFront: '',
    dniBack: '',
    selfie: ''
  });

  // Admin / President Mode
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // --- CORPORATE AUTONOMY STATE ---
  const [stats, setStats] = useState<CompanyStats>({
    activeUsers: 1240,
    activePros: 85,
    monthlyRevenueUSD: 4500,
    marketSentiment: 85
  });
  const [autoPilot, setAutoPilot] = useState(false);
  const [actionLog, setActionLog] = useState<CorporateAction[]>([]);
  const [pendingApproval, setPendingApproval] = useState<CorporateAction | null>(null);
  const scrollLogRef = useRef<HTMLDivElement>(null);

  // Autonomous CEO Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (autoPilot && !pendingApproval) {
      interval = setInterval(async () => {
        try {
          const decision = await consultCEO(stats);
          
          if (decision.requiresApproval) {
            setPendingApproval(decision);
            setAutoPilot(false); // Pause for president
          } else {
            // Execute automatically
            setStats(prev => ({
              ...prev,
              activeUsers: prev.activeUsers + decision.deltaUsers,
              activePros: prev.activePros + decision.deltaPros,
              monthlyRevenueUSD: prev.monthlyRevenueUSD + decision.deltaRevenue
            }));
            setActionLog(prev => [decision, ...prev].slice(50)); // Keep last 50
          }
        } catch (e) {
          console.error("CEO Error", e);
        }
      }, 4000); // CEO thinks every 4 seconds
    }

    return () => clearInterval(interval);
  }, [autoPilot, stats, pendingApproval]);

  // Smooth scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, verifStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserRequest(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('ANALYZING');
    
    // AI Call
    const result = await analyzeServiceRequest(userRequest.problemDescription);
    setAnalysis(result);

    // Filter Professionals
    const matching = MOCK_PROFESSIONALS.filter(p => p.trade === result.trade);
    matching.sort((a, b) => b.rating - a.rating);
    
    setFilteredPros(matching);
    setStep('LIST');
  };

  const handleSelectPro = (pro: Professional) => {
    setSelectedPro(pro);
    setIsProFlow(false);
    setVerifStep('EMAIL_CHECK');
    setStep('VERIFICATION');
  };

  const startProOnboarding = () => {
    setIsProFlow(true);
    // Reset pro specific verification states
    setProEmailSent(false);
    setEmailCode('');
    setProDetails(prev => ({...prev, email: ''}));
    
    setVerifStep('EMAIL_CHECK');
    setStep('VERIFICATION');
  }

  const handleVerificationSuccess = () => {
    if (isProFlow) {
      // Instead of saving immediately, go to Profile Details
      setStep('PRO_DETAILS');
    } else {
      // SAVE USER DATA TO DB
      saveUserRegistration(userRequest, biometricData);
      setStep('PAYMENT');
    }
  };

  const submitProDetails = () => {
     // SAVE PROFESSIONAL DATA TO DB
      saveProfessionalRegistration({
        name: "Nuevo Profesional", 
        email: proDetails.email, // Use validated email
        phone: "11-0000-0000",
        trade: proDetails.trade,
        description: proDetails.description,
        location: "Buenos Aires",
        portfolio: proDetails.portfolioFiles
      }, biometricData);
      
      alert("¡Registro completo! Tu perfil profesional, biometría y portafolio han sido guardados en la base de datos de MANO YA. Te contactaremos en breve.");
      setStep('LANDING');
  }

  const handlePaymentSuccess = () => {
    setStep('CONTACT');
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: any) => URL.createObjectURL(file));
      setProDetails(prev => ({
        ...prev,
        portfolioFiles: [...prev.portfolioFiles, ...newFiles]
      }));
    }
  };

  // --- Admin Logic ---
  const handleAdminAccess = () => {
    setShowAdminLogin(true);
  }

  const submitAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setShowAdminLogin(false);
      setPasswordInput('');
      setStep('PRESIDENT_DASHBOARD');
    } else {
      alert('Acceso denegado. Contraseña incorrecta.');
    }
  }

  const handleApproveAction = () => {
    if (pendingApproval) {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + pendingApproval.deltaUsers,
        activePros: prev.activePros + pendingApproval.deltaPros,
        monthlyRevenueUSD: prev.monthlyRevenueUSD + pendingApproval.deltaRevenue
      }));
      setActionLog(prev => [{...pendingApproval, action: `[APROBADO POR PRESIDENTE] ${pendingApproval.action}`}, ...prev]);
      setPendingApproval(null);
      setAutoPilot(true); // Resume
    }
  };

  const handleRejectAction = () => {
    if (pendingApproval) {
      setActionLog(prev => [{...pendingApproval, action: `[RECHAZADO POR PRESIDENTE] ${pendingApproval.action}`, outcome: 'Acción cancelada.'}, ...prev]);
      setPendingApproval(null);
      setAutoPilot(true); // Resume
    }
  }

  // --- Render Sections ---

  const renderHeader = () => (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setStep('LANDING')}
        >
          <div className="bg-brand-600 p-1.5 rounded-lg">
             <Wrench className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-brand-900">
            MANO <span className="text-action-500 italic">YA</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600 items-center">
          <button onClick={() => setStep('LANDING')} className="hover:text-brand-600 transition-colors">Inicio</button>
          <button onClick={() => setStep('FORM')} className="hover:text-brand-600 transition-colors">Buscar Profesional</button>
        </nav>
        <button className="md:hidden text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );

  const renderPresidentDashboard = () => (
     <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-mono">
      {/* Modal for Approval */}
      {pendingApproval && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-brand-500 rounded-xl max-w-lg w-full p-6 shadow-2xl shadow-brand-500/20 animate-scale-in">
             <div className="flex items-center gap-3 mb-4 text-brand-400">
               <AlertTriangle className="w-8 h-8" />
               <h2 className="text-xl font-bold uppercase tracking-widest">Autorización Presidencial Requerida</h2>
             </div>
             <p className="text-slate-300 text-lg mb-4">
               El CEO Autónomo solicita permiso para:
             </p>
             <div className="bg-black/50 p-4 rounded border border-slate-700 mb-6">
                <p className="font-bold text-white mb-2">{pendingApproval.action}</p>
                <p className="text-sm text-slate-400 italic">"{pendingApproval.approvalMessage}"</p>
                <div className="mt-3 flex gap-4 text-xs">
                   <span className="text-green-400">+{pendingApproval.deltaRevenue} USD Est.</span>
                   <span className="text-blue-400">+{pendingApproval.deltaUsers} Usuarios</span>
                </div>
             </div>
             <div className="flex gap-4">
               <button 
                 onClick={handleRejectAction}
                 className="flex-1 py-3 rounded border border-red-500 text-red-500 hover:bg-red-500/10 font-bold uppercase tracking-wider"
               >
                 Denegar
               </button>
               <button 
                 onClick={handleApproveAction}
                 className="flex-1 py-3 rounded bg-brand-600 hover:bg-brand-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-brand-500/20"
               >
                 Autorizar Ejecución
               </button>
             </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Terminal className="w-8 h-8 text-brand-500" />
              CENTRO DE COMANDO <span className="text-brand-500">MANO YA</span>
            </h1>
            <p className="text-slate-500 mt-1">Hola, Presidente Santarsiero. Sistema Operativo Autónomo V3.0.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className={`w-3 h-3 rounded-full ${autoPilot ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-sm font-bold uppercase">{autoPilot ? 'Autopilot: ON' : 'Autopilot: PAUSED'}</span>
              <button 
                onClick={() => setAutoPilot(!autoPilot)}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${autoPilot ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'}`}
              >
                {autoPilot ? 'Detener' : 'Iniciar'}
              </button>
            </div>
            <button 
              onClick={() => setStep('LANDING')}
              className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 px-4 py-2 rounded-lg text-xs font-bold uppercase"
            >
              Salir
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                <Users className="w-4 h-4" /> Usuarios Activos
              </div>
              <div className="text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Creciendo automático</div>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                <Briefcase className="w-4 h-4" /> Profesionales
              </div>
              <div className="text-3xl font-bold text-white">{stats.activePros.toLocaleString()}</div>
              <div className="text-xs text-brand-500 mt-1">Ratio: {(stats.activePros / stats.activeUsers).toFixed(2)}</div>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard className="w-16 h-16" /></div>
              <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                <Activity className="w-4 h-4" /> Revenue (USD)
              </div>
              <div className="text-3xl font-bold text-green-400">${stats.monthlyRevenueUSD.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Balance PayPal/MP</div>
           </div>
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase">
                <ScanFace className="w-4 h-4" /> Sentiment IA
              </div>
              <div className="text-3xl font-bold text-white">{stats.marketSentiment}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-500 h-full" style={{ width: `${stats.marketSentiment}%` }}></div>
              </div>
           </div>
        </div>

        {/* Live Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
          {/* Active Agents Visualizer */}
          <div className="lg:col-span-1 bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Agentes Activos</h3>
             
             <div className="space-y-6 flex-1">
               <div className={`p-4 rounded-lg border transition-all ${actionLog[0]?.role === 'RECRUITER_BOT' ? 'bg-brand-900/20 border-brand-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
                 <div className="flex justify-between items-center mb-2">
                   <div className="font-bold text-sm text-brand-400">RECRUITER_BOT</div>
                   {actionLog[0]?.role === 'RECRUITER_BOT' && <span className="text-[10px] bg-brand-500 text-black px-1 rounded animate-pulse">BUSY</span>}
                 </div>
                 <div className="text-xs text-slate-400">Escaneando LinkedIn, Grupos de Facebook y Webs de oficios.</div>
               </div>

               <div className={`p-4 rounded-lg border transition-all ${actionLog[0]?.role === 'MARKETING_BOT' ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
                 <div className="flex justify-between items-center mb-2">
                   <div className="font-bold text-sm text-purple-400">MARKETING_BOT</div>
                   {actionLog[0]?.role === 'MARKETING_BOT' && <span className="text-[10px] bg-purple-500 text-black px-1 rounded animate-pulse">BUSY</span>}
                 </div>
                 <div className="text-xs text-slate-400">Generando campañas en Instagram, TikTok y Google Ads.</div>
               </div>

               <div className={`p-4 rounded-lg border transition-all ${actionLog[0]?.role === 'FINANCE_BOT' ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-slate-900 border-slate-800 opacity-50'}`}>
                 <div className="flex justify-between items-center mb-2">
                   <div className="font-bold text-sm text-green-400">FINANCE_BOT</div>
                   {actionLog[0]?.role === 'FINANCE_BOT' && <span className="text-[10px] bg-green-500 text-black px-1 rounded animate-pulse">BUSY</span>}
                 </div>
                 <div className="text-xs text-slate-400">Optimizando tarifas, cobros y pasarelas de pago.</div>
               </div>
             </div>
          </div>

          {/* Terminal Log */}
          <div className="lg:col-span-2 bg-black rounded-xl border border-slate-800 p-4 font-mono text-xs md:text-sm overflow-hidden flex flex-col relative shadow-inner">
             <div className="absolute top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 p-2 flex gap-2 items-center">
                <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-2 text-slate-500">/var/log/mano_ya_autonomous_core</span>
             </div>
             
             <div className="flex-1 overflow-y-auto mt-8 space-y-3 custom-scrollbar p-2" ref={scrollLogRef}>
                {actionLog.length === 0 && <div className="text-slate-600 italic">Esperando inicialización del núcleo... (Presione INICIAR)</div>}
                
                {actionLog.map((log, i) => (
                  <div key={i} className="animate-fade-in border-l-2 border-slate-700 pl-3 py-1 hover:bg-slate-900/30 transition-colors">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                        <span className={`${
                          log.role === 'RECRUITER_BOT' ? 'text-brand-400' : 
                          log.role === 'MARKETING_BOT' ? 'text-purple-400' : 'text-green-400'
                        } font-bold`}>{log.role}</span>
                        {log.action.includes("APROBADO") && <span className="text-xs bg-green-900 text-green-300 px-1 rounded">APPROVED</span>}
                        {log.action.includes("RECHAZADO") && <span className="text-xs bg-red-900 text-red-300 px-1 rounded">REJECTED</span>}
                     </div>
                     <div className="text-slate-300">{log.action}</div>
                     <div className="text-slate-500 flex gap-3 mt-1 text-[10px] uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> {log.outcome}</span>
                        {log.deltaRevenue > 0 && <span className="text-green-500">+${log.deltaRevenue} USD</span>}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanding = () => (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 px-4 py-12 md:py-20 max-w-4xl mx-auto flex flex-col items-center text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-brand-50 text-brand-600 text-xs font-bold tracking-wide uppercase mb-6 border border-brand-100">
          Powered by Gemini 3.0 Pro
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Soluciones expertas,<br/>
          <span className="text-brand-600">en la puerta de tu casa.</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl">
          Plomeros, electricistas, gasistas y Arquitectos. Profesionales verificados biométricamente. Sin demoras, sin sorpresas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => setStep('FORM')}
            className="flex-1 bg-action-500 hover:bg-action-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-action-500/20 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
          >
            Buscar Profesional <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={startProOnboarding}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Soy Profesional
          </button>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <ScanFace className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Identidad Biométrica</h3>
            <p className="text-slate-500 text-sm">Validamos identidad con DNI y reconocimiento facial para tu seguridad.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Calificación Real</h3>
            <p className="text-slate-500 text-sm">Sistema de doble puntaje. Vos calificás al profesional y ellos a vos.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Tecnología IA</h3>
            <p className="text-slate-500 text-sm">Gemini 3.0 Pro analiza tu problema y encuentra al experto exacto.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderForm = () => (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Contanos qué necesitas</h2>
        <p className="text-slate-500">Completá tus datos para encontrar al mejor profesional cerca tuyo.</p>
      </div>
      
      <form onSubmit={submitForm} className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tu Nombre</label>
            <input 
              required
              name="name"
              type="text" 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
              placeholder="Ej. Juan Pérez"
              value={userRequest.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono / Celular</label>
            <input 
              required
              name="phone"
              type="tel" 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
              placeholder="11 1234 5678"
              value={userRequest.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
          <input 
            required
            name="email"
            type="email" 
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none"
            placeholder="juan@email.com"
            value={userRequest.email}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Zona / Barrio</label>
          <select 
            required
            name="location"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none bg-white"
            value={userRequest.location}
            onChange={handleInputChange}
          >
            <option value="">Seleccioná tu zona</option>
            {LOCATIONS_BA.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción del Problema</label>
          <textarea 
            required
            name="problemDescription"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none resize-none"
            placeholder="Ej. Tengo una pérdida de agua bajo la pileta de la cocina..."
            value={userRequest.problemDescription}
            onChange={handleInputChange}
          ></textarea>
          <p className="text-xs text-slate-400 mt-2 text-right">Nuestra IA analizará esto para encontrar al especialista.</p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
        >
          Buscar Solución Ahora
        </button>
      </form>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-slate-100 border-t-brand-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search className="w-8 h-8 text-brand-500" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Analizando tu solicitud...</h3>
      <p className="text-slate-500 max-w-md">Estamos buscando los mejores profesionales en tu zona para tu problema específico.</p>
    </div>
  );

  const renderList = () => (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl mb-8 flex items-start gap-4">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <AlertTriangle className="w-6 h-6 text-action-500" />
        </div>
        <div>
          <h3 className="font-bold text-brand-900">Diagnóstico IA: {analysis?.trade}</h3>
          <p className="text-sm text-brand-700 mt-1">{analysis?.reasoning}</p>
          <div className="mt-2 flex gap-2">
            <span className={`text-xs px-2 py-1 rounded font-bold ${analysis?.urgency === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              Urgencia: {analysis?.urgency}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Profesionales Disponibles</h2>
      
      {filteredPros.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">No encontramos profesionales en este rubro exacto por ahora en tu zona.</p>
          <button 
             onClick={() => setStep('FORM')}
             className="mt-4 text-brand-600 font-semibold hover:underline"
          >
            Intentar otra búsqueda
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPros.map(pro => (
            <ProfessionalCard key={pro.id} pro={pro} onSelect={handleSelectPro} />
          ))}
        </div>
      )}
    </div>
  );

  const renderVerification = () => {
    // Handler for captured images
    const handleCapture = (imageData: string, type: 'dniFront' | 'dniBack' | 'selfie') => {
      setBiometricData(prev => ({ ...prev, [type]: imageData }));
      // Advance step
      if (type === 'dniFront') setVerifStep('DNI_BACK');
      if (type === 'dniBack') setVerifStep('SELFIE');
      if (type === 'selfie') {
        setVerifStep('PROCESSING');
        setTimeout(() => setVerifStep('SUCCESS'), 3000);
      }
    };

    const handleSendProEmailCode = () => {
      if(proDetails.email && proDetails.email.includes('@')) {
        setProEmailSent(true);
        // Simulate sending email...
        alert(`Código enviado a ${proDetails.email}. (Usar 123456)`);
      } else {
        alert("Por favor ingresa un email válido.");
      }
    }

    const verifyEmailCode = () => {
      if (emailCode === '123456') { // Mock validation code
        setEmailVerified(true);
        setVerifStep('INTRO');
      } else {
        alert("Código incorrecto. Intenta con 123456");
      }
    }

    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full mb-4">
            <UserCheck className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Validación de Identidad</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {isProFlow 
              ? "Para ofrecer servicios en MANO YA, necesitamos validar que sos vos." 
              : "Para mantener la comunidad segura, verificamos la identidad de todos los usuarios."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative min-h-[450px] flex flex-col">
          
          {/* Progress Bar */}
          <div className="flex w-full h-2 bg-slate-100">
             <div 
                className="bg-brand-500 transition-all duration-500 ease-out"
                style={{
                  width: verifStep === 'EMAIL_CHECK' ? '5%' :
                         verifStep === 'INTRO' ? '15%' : 
                         verifStep === 'DNI_FRONT' ? '35%' : 
                         verifStep === 'DNI_BACK' ? '60%' : 
                         verifStep === 'SELFIE' ? '80%' : '100%' 
                }}
             />
          </div>

          <div className="p-8 h-full flex flex-col items-center justify-center flex-1">
            
            {verifStep === 'EMAIL_CHECK' && (
              <div className="text-center w-full animate-fade-in">
                <div className="mb-6">
                  <Mail className="w-12 h-12 text-slate-300 mx-auto" />
                </div>
                
                {/* Logic for Professionals to enter email first */}
                {isProFlow && !proEmailSent ? (
                   <>
                    <h3 className="text-lg font-bold mb-2">Ingresa tu Email Profesional</h3>
                    <p className="text-sm text-slate-500 mb-6">Te enviaremos un código de verificación.</p>
                    <input 
                      type="email" 
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all outline-none mb-6"
                      value={proDetails.email}
                      onChange={(e) => setProDetails(prev => ({...prev, email: e.target.value}))}
                    />
                    <button 
                      onClick={handleSendProEmailCode}
                      className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Enviar Código
                    </button>
                   </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold mb-2">Verifica tu Correo</h3>
                    <p className="text-sm text-slate-500 mb-6">
                       Hemos enviado un código a {isProFlow ? proDetails.email : 'tu casilla'}. (Usa 123456)
                    </p>
                    <input 
                      type="text" 
                      placeholder="000000"
                      className="w-full text-center text-2xl tracking-[0.5em] font-mono border-2 border-slate-200 rounded-lg py-3 mb-6 focus:border-brand-500 outline-none uppercase"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value)}
                      maxLength={6}
                    />
                    <button 
                      onClick={verifyEmailCode}
                      className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all"
                    >
                      Verificar Código
                    </button>
                    {isProFlow && (
                      <button 
                        onClick={() => setProEmailSent(false)} 
                        className="mt-4 text-xs text-brand-600 hover:underline"
                      >
                        Cambiar email
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {verifStep === 'INTRO' && (
              <div className="text-center space-y-6 animate-fade-in">
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="bg-white p-2 rounded shadow-sm"><FileText className="w-6 h-6 text-brand-600" /></div>
                      <div>
                        <h4 className="font-bold text-sm">Documento de Identidad</h4>
                        <p className="text-xs text-slate-500">Necesitarás tu DNI físico a mano.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="bg-white p-2 rounded shadow-sm"><ScanFace className="w-6 h-6 text-brand-600" /></div>
                      <div>
                        <h4 className="font-bold text-sm">Prueba de Vida</h4>
                        <p className="text-xs text-slate-500">Te pediremos una selfie rápida.</p>
                      </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => setVerifStep('DNI_FRONT')}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                 >
                   Comenzar Biometría <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            )}

            {verifStep === 'DNI_FRONT' && (
              <CameraCapture 
                label="Frente del DNI"
                instruction="Asegurate que el texto sea legible y no haya reflejos."
                onCapture={(img) => handleCapture(img, 'dniFront')}
              />
            )}

            {verifStep === 'DNI_BACK' && (
              <CameraCapture 
                label="Dorso del DNI"
                instruction="Captura la parte trasera de tu documento."
                onCapture={(img) => handleCapture(img, 'dniBack')}
              />
            )}

            {verifStep === 'SELFIE' && (
              <CameraCapture 
                label="Selfie de Prueba de Vida"
                instruction="Mirá a la cámara y asegurate de tener buena luz."
                onCapture={(img) => handleCapture(img, 'selfie')}
              />
            )}

            {verifStep === 'PROCESSING' && (
              <div className="text-center animate-fade-in">
                 <RefreshCw className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-800">Procesando biometría...</h3>
                 <p className="text-slate-500 text-sm mt-2">Estamos guardando tus datos en el servidor seguro.</p>
                 <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400">
                    <span className="flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Email Validado</span>
                    <span className="flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /> Imágenes capturadas</span>
                 </div>
              </div>
            )}

            {verifStep === 'SUCCESS' && (
              <div className="text-center animate-scale-in">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-green-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Identidad Validada!</h3>
                 <p className="text-slate-500 max-w-xs mx-auto mb-8">
                   Hemos asegurado tu perfil.
                 </p>
                 <button 
                   onClick={handleVerificationSuccess}
                   className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                 >
                   Continuar
                 </button>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  const renderProDetails = () => (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Completá tu Perfil Profesional</h2>
        <p className="text-slate-500">Esta información es clave para que los clientes te elijan. Incluye fotos de tus trabajos.</p>
      </div>
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Tu Especialidad Principal</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
            value={proDetails.trade}
            onChange={(e) => setProDetails(prev => ({...prev, trade: e.target.value as TradeType}))}
          >
            {Object.values(TradeType).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {proDetails.trade === TradeType.ARQUITECTO && (
             <p className="text-xs text-brand-600 mt-2 bg-brand-50 p-2 rounded">
               * Habilitado para: Obras Nuevas, Reformas, Renders, Dirección de Obra.
             </p>
          )}
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-700 mb-2">Sobre vos y tu experiencia</label>
           <textarea 
             rows={4}
             className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none resize-none"
             placeholder="Ej. Tengo 10 años de experiencia en el rubro, matrícula al día..."
             value={proDetails.description}
             onChange={(e) => setProDetails(prev => ({...prev, description: e.target.value}))}
           />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Portafolio de Trabajos (Fotos)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
             <input 
               type="file" 
               multiple 
               accept="image/*" 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               onChange={handlePortfolioUpload}
             />
             <div className="flex flex-col items-center pointer-events-none">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Tocá para subir fotos</p>
                <p className="text-xs text-slate-400">JPG, PNG (Máx 5MB)</p>
             </div>
          </div>
          
          {/* Previews */}
          {proDetails.portfolioFiles.length > 0 && (
             <div className="grid grid-cols-3 gap-2 mt-4">
                {proDetails.portfolioFiles.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                     <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          )}
        </div>

        <button 
          onClick={submitProDetails}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          Guardar y Finalizar
        </button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Conexión Segura</h2>
        <p className="text-slate-500">Para ver los datos de contacto y coordinar la visita, solicitamos un cargo único de servicio.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
           <img src={selectedPro?.imageUrl} className="w-12 h-12 rounded-full object-cover" alt="Pro" />
           <div className="text-left">
             <div className="font-bold text-slate-900">{selectedPro?.name}</div>
             <div className="text-xs text-slate-500">{selectedPro?.trade} • Verificado</div>
           </div>
        </div>
        
        <div className="space-y-4">
          <PayPalButton amount={5} onSuccess={handlePaymentSuccess} />
          
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span>O pagá en pesos (Argentina)</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          
          {/* Equivalent of 5 USD in ARS (Approx 6500) */}
          <MercadoPagoButton 
            amountArs={6500} 
            onSuccess={handlePaymentSuccess}
            paymentLink={MP_PAYMENT_LINK}
          />
        </div>
      </div>

      <button onClick={() => setStep('LIST')} className="text-sm text-slate-400 hover:text-slate-600">
        Cancelar y volver
      </button>
    </div>
  );

  const renderContact = () => (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
       <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
       </div>
       <h2 className="text-3xl font-bold text-slate-900 mb-4">¡Match Exitoso!</h2>
       <p className="text-slate-600 mb-8">Aquí tenés los datos de contacto de tu profesional. ¡Escribile ya!</p>
       
       <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-100 space-y-6">
          <img src={selectedPro?.imageUrl} className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-sm" alt="Pro" />
          
          <div>
            <h3 className="text-xl font-bold text-slate-900">{selectedPro?.name}</h3>
            <span className="bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded-full font-bold">{selectedPro?.trade}</span>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
             <a href={`tel:${selectedPro?.phone}`} className="flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                <Phone className="w-5 h-5" /> Llamar Ahora
             </a>
             <div className="flex flex-col gap-2 text-sm text-slate-500">
                <div className="flex items-center justify-center gap-2">
                   <span className="font-mono bg-slate-100 px-2 py-1 rounded">{selectedPro?.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                   <span className="font-mono bg-slate-100 px-2 py-1 rounded">{selectedPro?.email}</span>
                </div>
             </div>
          </div>
       </div>
       
       <button onClick={() => setStep('LANDING')} className="mt-12 text-brand-600 font-bold hover:underline">
         Volver al Inicio
       </button>
    </div>
  );

  const renderFooter = () => (
    <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center mt-auto border-t border-slate-800">
       <div className="max-w-4xl mx-auto flex flex-col items-center">
         <div className="mb-4">
            <span className="font-bold text-lg tracking-tight text-white">
              MANO <span className="text-action-500 italic">YA</span>
            </span>
         </div>
         <p className="mb-2 text-sm flex items-center gap-2 justify-center">
           &copy; {new Date().getFullYear()} MANO YA - Arq. Julián Santarsiero.
           <button onClick={handleAdminAccess} className="text-slate-800 hover:text-slate-700 transition-colors" aria-label="Admin Access">
             <Lock className="w-3 h-3" />
           </button>
         </p>
         <p className="text-xs text-slate-600">Todos los derechos reservados. Buenos Aires, Argentina.</p>
       </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {renderHeader()}
      
      {showAdminLogin && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
           <form onSubmit={submitAdminLogin} className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-brand-500"></div>
              <button 
                type="button" 
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 text-slate-900">
                 <div className="bg-slate-100 p-2 rounded-full"><KeyRound className="w-6 h-6" /></div>
                 <h2 className="text-xl font-bold">Acceso Presidencial</h2>
              </div>
              
              <div className="mb-6">
                <input 
                  autoFocus
                  type="password" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none text-center text-2xl tracking-widest"
                  placeholder="••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Ingresar al Sistema
              </button>
           </form>
        </div>
      )}

      <main className="flex-1">
        {step === 'LANDING' && renderLanding()}
        {step === 'PRESIDENT_DASHBOARD' && renderPresidentDashboard()}
        {step === 'FORM' && renderForm()}
        {step === 'ANALYZING' && renderAnalyzing()}
        {step === 'LIST' && renderList()}
        {step === 'VERIFICATION' && renderVerification()}
        {step === 'PRO_DETAILS' && renderProDetails()}
        {step === 'PAYMENT' && renderPayment()}
        {step === 'CONTACT' && renderContact()}
      </main>

      {step !== 'PRESIDENT_DASHBOARD' && renderFooter()}
    </div>
  );
};

export default App;