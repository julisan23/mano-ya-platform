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
                <h3 className="text-brand-200 mb-4 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Resultados para "{searchQuery}": {searchResults.length} Capos encontrados
                </h3>
                <div className="grid gap-4">
                  {searchResults.map((pro) => (
                    <div key={pro.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:border-brand-500/50 transition-colors group">
                      <div>
                        <h4 className="font-bold text-lg text-white flex items-center gap-2 group-hover:text-brand-400 transition-colors">
                          {pro.name}
                          {pro.status === 'VERIFIED' && (
                            <span title="Capo Verificado" className="bg-brand-500/20 p-1 rounded">
                              <Shield className="w-4 h-4 text-brand-500" />
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><HardHat className="w-3 h-3" /> {pro.service_type}</span>
                          <span className="flex items-center gap-1 text-brand-400"><Star className="w-3 h-3 fill-brand-400" /> {pro.rating || 'N/A'}</span>
                        </div>
                      </div>
                      <button className="bg-white/10 hover:bg-brand-500 hover:text-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        <Phone className="w-4 h-4" />
                        Contactar
                      </button>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 border-dashed text-gray-500">
                      No encontramos Capos con ese término exacto. Probá con "Plomero" o "Gasista".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="https://link.mercadopago.com.ar/manoya" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-400 text-black px-8 py-4 rounded-lg text-lg font-black uppercase tracking-wide transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(245,158,11,0.4)]">
              Reservar un Capo
              <Shield className="w-5 h-5" />
            </a>
            <button className="flex items-center justify-center gap-3 bg-transparent hover:bg-white/5 text-white px-8 py-4 rounded-lg text-lg font-bold border-2 border-white/10 hover:border-white/30 transition-all uppercase tracking-wide">
              Soy Profesional
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-white/10 pt-12">
            {[
              { label: 'Usuarios Activos', value: '10k+' },
              { label: 'Capos Verificados', value: '500+' },
              { label: 'Calificación Media', value: '4.9/5' },
              { label: 'Tiempo Respuesta', value: '< 15m' },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center group cursor-default">
                <dt className="order-2 mt-2 text-sm font-bold text-gray-500 uppercase tracking-wider group-hover:text-brand-500 transition-colors">{stat.label}</dt>
                <dd className="order-1 text-4xl font-black text-white">{stat.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works Section (New) */}
      <div className="py-24 bg-brand-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase italic">¿Cómo funciona CAPOS?</h2>
            <p className="text-gray-400">Simple. Seguro. Sin vueltas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* User Flow */}
            <div>
              <h3 className="text-xl font-bold text-brand-500 mb-8 flex items-center gap-2 uppercase">
                <Search className="w-6 h-6" /> Para Clientes
              </h3>
              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-white/10">
                {[
                  { title: "1. Buscá tu solución", desc: "Decinos qué necesitás. Plomería, Gas, Electricidad." },
                  { title: "2. Elegí a un Capo", desc: "Verificá su reputación, precio y validación biométrica." },
                  { title: "3. Reservá con Garantía", desc: "Tu pago se libera solo cuando el trabajo está terminado y aprobado." }
                ].map((step, i) => (
                  <div key={i} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-brand-950 border-2 border-brand-500 rounded-full flex items-center justify-center font-bold text-brand-500 text-sm">
                      {i + 1}
                    </div>
                    <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Flow */}
            <div>
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2 uppercase">
                <HardHat className="w-6 h-6" /> Para Profesionales
              </h3>
              <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-white/10">
                {[
                  { title: "1. Postulate", desc: "Completá tu perfil y pasá nuestro filtro de calidad." },
                  { title: "2. Verificate", desc: "Validamos tu identidad y antecedentes para darte la insignia de Capo." },
                  { title: "3. Trabajá seguro", desc: "Recibí pagos garantizados y construí tu reputación digital." }
                ].map((step, i) => (
                  <div key={i} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-brand-950 border-2 border-white/20 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                      {i + 1}
                    </div>
                    <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4 uppercase italic">¿Por qué elegir un Capo?</h2>
            <p className="text-gray-400 text-lg">No somos un directorio. Somos un filtro de calidad.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-10 h-10 text-brand-500" />,
                title: "Garantía de Trabajo",
                desc: "Si el trabajo queda mal, CAPOS responde. Tu dinero está protegido hasta que des el OK."
              },
              {
                icon: <Award className="w-10 h-10 text-brand-500" />,
                title: "Solo el Top 5%",
                desc: "Rechazamos al 95% de los postulantes. Solo entran los que tienen referencias reales y validación técnica."
              },
              {
                icon: <Zap className="w-10 h-10 text-brand-500" />,
                title: "Al Toque",
                desc: "Sin vueltas. Cotización inmediata y disponibilidad en tiempo real. Valoramos tu tiempo."
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-brand-500 transition-all hover:bg-white/[0.07] group hover:-translate-y-1">
                <div className="mb-6 p-4 bg-brand-950 rounded-lg w-fit border border-white/10 group-hover:border-brand-500/50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-3 uppercase">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-brand-950 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <HardHat className="w-6 h-6 text-brand-500" />
            <span className="font-black text-xl italic tracking-tighter">CAPOS</span>
          </div>
          <div className="text-gray-500 text-sm flex items-center gap-4 font-medium">
            <span>© 2025 CAPOS Argentina. Todos los derechos reservados.</span>
            <button
              onClick={() => setShowDashboard(true)}
              className="opacity-20 hover:opacity-100 transition-opacity cursor-pointer"
              title="Acceso Presidente"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* President Dashboard Overlay */}
      {showDashboard && (
        <PresidentDashboard onClose={() => setShowDashboard(false)} />
      )}
    </div>
  );
}

export default App;