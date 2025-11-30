import React, { useState } from 'react';
import { Hammer, Shield, Zap, Star, ArrowRight, CheckCircle, Lock, Search, MapPin, Phone, Award, HardHat } from 'lucide-react';
import { PresidentDashboard } from './components/PresidentDashboard';
import { createClient } from '@supabase/supabase-js';

// Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Hack: Si el usuario escribe "Plomero en Palermo", nos quedamos con "Plomero"
    const cleanQuery = searchQuery.split(' en ')[0].trim();

    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .or(`service_type.ilike.%${cleanQuery}%,name.ilike.%${cleanQuery}%`)
      .limit(20);

    if (data) {
      setSearchResults(data);
    }
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-brand-950 text-white font-sans selection:bg-brand-500 selection:text-black">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-brand-950/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-brand-500 p-1.5 rounded-lg transform -rotate-3">
                <HardHat className="w-6 h-6 text-black" />
              </div>
              <span className="font-black text-2xl tracking-tighter italic">CAPOS</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide">Servicios</a>
                <a href="#" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wide">Soy un Capo</a>
              </div>
            </div>
            <div>
              <button className="bg-brand-500 hover:bg-brand-400 text-black px-6 py-2 rounded-none skew-x-[-10deg] font-black uppercase tracking-wider transition-all transform hover:scale-105 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                <span className="skew-x-[10deg] inline-block">Descargar App</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/20 via-brand-950 to-brand-950"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none skew-x-[-10deg] bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Solo Expertos Verificados
            </span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter mb-8 text-white uppercase leading-[0.9]">
            No busques un profesional.<br />
            <span className="text-brand-500">Encontrá un Capo.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400 mb-12 font-medium">
            La comunidad de élite de oficios en Buenos Aires.
            <br />Identidad biométrica validada. Garantía real. Sin vueltas.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16 relative z-20">
            <form onSubmit={handleSearch} className="relative flex items-center group">
              <Search className="absolute left-5 w-6 h-6 text-gray-500 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="¿Qué necesitás arreglar? (ej: Plomero, Gasista)"
                className="w-full bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-xl py-5 pl-16 pr-36 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-all text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 bg-brand-500 hover:bg-brand-400 text-black px-8 py-3 rounded-lg font-black uppercase tracking-wide transition-all"
                disabled={isSearching}
              >
                {isSearching ? '...' : 'Buscar'}
              </button>
            </form>

            {/* Search Results */}
            {hasSearched && (
              <div className="mt-8 text-left animate-fade-in">
                const [showDashboard, setShowDashboard] = useState(false);

                return (
                <div className="min-h-screen bg-brand-950 text-zinc-100 font-sans selection:bg-brand-500/30">
                  {/* Subtle Grid Background */}
                  <div className="fixed inset-0 z-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }}></div>

                  {/* Navbar */}
                  <nav className="fixed w-full z-50 bg-brand-950/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                      <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <HardHat className="w-5 h-5 text-brand-500" />
                          </div>
                          <span className="font-bold text-xl tracking-widest text-white">CAPOS</span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                          <a href="#" className="hover:text-white transition-colors">Servicios</a>
                          <a href="#" className="hover:text-white transition-colors">Garantía</a>
                          <a href="#" className="hover:text-white transition-colors">Empresas</a>
                          <button className="bg-white text-brand-950 px-5 py-2 rounded-full font-semibold hover:bg-zinc-200 transition-colors">
                            Descargar App
                          </button>
                        </div>
                      </div>
                    </div>
                  </nav>

                  {/* Hero Section */}
                  <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
                    {/* Premium 3D Background */}
                    <div className="absolute inset-0 z-0">
                      <img src="/hero-bg.png" alt="Premium Tech Background" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
                      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/90 via-brand-950/60 to-brand-950"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-400 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-2xl animate-fade-in-up">
                        <Star className="w-3 h-3 fill-brand-400" /> Excellence or Nothing
                      </div>
                      <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9] drop-shadow-2xl">
                        ELITE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-brand-400 to-brand-600">TECHNICAL</span> <br />
                        SQUAD.
                      </h1>
                      <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed tracking-wide">
                        La plataforma definitiva para servicios de alta gama. <br />
                        <span className="text-white font-medium">Biometría. Garantía Real. Sin Amateurs.</span>
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="group relative px-8 py-4 bg-brand-500 text-brand-950 rounded-full font-black text-lg tracking-wider overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]">
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                          <span className="relative flex items-center gap-2">
                            SOLICITAR CAPO <ArrowRight className="w-5 h-5" />
                          </span>
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg tracking-wider hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md">
                          ACCESO PROFESIONAL
                        </button>
                      </div>

                      {/* Premium Trust Indicators */}
                      <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 opacity-80">
                        {[
                          { icon: Lock, text: 'AES-256 Encrypted' },
                          { icon: Shield, text: 'Biometric Verified' },
                          { icon: Award, text: 'Top 1% Talent' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            <item.icon className="w-4 h-4 text-brand-500" /> {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>      </div>

                {/* Minimalist 'How it Works' */}
                <div className="py-32 bg-zinc-900/50 border-y border-white/5">
                  <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      {[
                        { step: "01", title: "Solicitud Inteligente", desc: "Describí tu problema. Nuestra IA selecciona al especialista exacto para tu caso." },
                        { step: "02", title: "Match Certificado", desc: "Recibí el perfil de un Capo verificado. Foto, matrícula y reputación validada." },
                        { step: "03", title: "Garantía Total", desc: "El pago se libera solo cuando confirmás que el trabajo quedó perfecto." }
                      ].map((item, i) => (
                        <div key={i} className="relative group">
                          <div className="text-6xl font-black text-white/5 group-hover:text-brand-500/10 transition-colors mb-4">{item.step}</div>
                          <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                          <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium Features */}
                <div className="py-32">
                  <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Estándar CAPOS.</h2>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                          Elevamos la vara. Lo que para otros es "premium", para nosotros es el piso.
                          Rechazamos al 95% de los postulantes para que vos no tengas que filtrar a nadie.
                        </p>
                        <ul className="space-y-4">
                          {[
                            "Antecedentes penales verificados",
                            "Validación de matrícula técnica",
                            "Examen psicotécnico de ingreso",
                            "Monitoreo de trabajos por IA"
                          ].map((feat, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-brand-500/20 blur-3xl rounded-full opacity-20"></div>
                        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                              <Shield className="w-6 h-6 text-brand-500" />
                            </div>
                            <div>
                              <div className="text-white font-bold">Garantía de Satisfacción</div>
                              <div className="text-zinc-500 text-sm">Cobertura total del servicio</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="h-2 bg-white/5 rounded-full w-full overflow-hidden">
                              <div className="h-full bg-brand-500 w-3/4"></div>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-500">
                              <span>Nivel de Confianza</span>
                              <span className="text-brand-500 font-bold">98.5%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <footer className="py-12 border-t border-white/5 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-50 mb-4">
                    <HardHat className="w-5 h-5 text-zinc-500" />
                    <span className="font-bold text-zinc-500 tracking-widest">CAPOS</span>
                  </div>
                  <p className="text-zinc-600 text-sm">© 2025 CAPOS Argentina. Tecnología de confianza.</p>
                  <button
                    onClick={() => setShowDashboard(true)}
                    className="mt-8 text-zinc-800 hover:text-zinc-600 transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                  </button>
                </footer>

                {/* President Dashboard Overlay */}
                {showDashboard && (
                  <PresidentDashboard onClose={() => setShowDashboard(false)} />
                )}
              </div>
            );
}

            export default App;