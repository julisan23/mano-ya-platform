import React, { useState } from 'react';
import { Hammer, Shield, Zap, Star, ArrowRight, CheckCircle, Lock, Search, MapPin, Phone } from 'lucide-react';
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

    setIsSearching(false);
};

return (
    <div className="min-h-screen bg-brand-950 text-white font-sans selection:bg-action-500 selection:text-white">
        {/* Navbar */}
        <nav className="fixed w-full z-50 bg-brand-950/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-600 p-1.5 rounded-lg">
                            <Hammer className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">MANO YA</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <a href="#" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Servicios</a>
                            <a href="#" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Para Profesionales</a>
                        </div>
                    </div>
                    <div>
                        <button className="bg-white text-brand-950 hover:bg-brand-50 px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
                            Descargar App
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-action-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-400 text-sm font-medium mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-action-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-action-500"></span>
                    </span>
                    Disponible en Buenos Aires
                </div>

                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-100 to-brand-300">
                    Tu hogar, perfecto.<br />
                    <span className="text-action-500">En minutos.</span>
                </h1>

                <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-200 mb-10">
                    Conectamos a los mejores profesionales con tus necesidades urgentes.
                    Plomería, electricidad, gas y más. Verificados y garantizados.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12 relative z-20">
                    <form onSubmit={handleSearch} className="relative flex items-center">
                        <Search className="absolute left-4 w-6 h-6 text-brand-400" />
                        <input
                            type="text"
                            placeholder="¿Qué profesional buscas? (ej: Plomero, Gasista)"
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pl-14 pr-32 text-white placeholder-brand-300 focus:outline-none focus:ring-2 focus:ring-action-500 transition-all text-lg shadow-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 bg-action-600 hover:bg-action-500 text-white px-6 py-2.5 rounded-full font-bold transition-all"
                            disabled={isSearching}
                        >
                            {isSearching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>

                    {/* Search Results */}
                    {hasSearched && (
                        <div className="mt-8 text-left animate-fade-in">
                            <h3 className="text-brand-200 mb-4 font-medium flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Resultados para "{searchQuery}": {searchResults.length} profesionales encontrados
                            </h3>
                            <div className="grid gap-4">
                                {searchResults.map((pro) => (
                                    <div key={pro.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center hover:bg-white/10 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{pro.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-brand-300 mt-1">
                                                <span className="flex items-center gap-1"><Hammer className="w-3 h-3" /> {pro.service_type}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Buenos Aires</span>
                                            </div>
                                        </div>
                                        <button className="bg-brand-700 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            Contactar
                                        </button>
                                    </div>
                                ))}
                                {searchResults.length === 0 && (
                                    <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10 border-dashed text-brand-300">
                                        No encontramos profesionales con ese término exacto. Intenta con "Plomero", "Electricista" o "Gasista".
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="https://link.mercadopago.com.ar/manoya" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-action-600 hover:bg-action-500 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-action-600/25">
                        Solicitar Servicio YA
                        <Zap className="w-5 h-5" />
                    </a>
                    <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all border border-white/10 backdrop-blur-sm">
                        Soy Profesional
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-white/10 pt-10">
                    {[
                        { label: 'Usuarios Activos', value: '10k+' },
                        { label: 'Profesionales', value: '500+' },
                        { label: 'Calificación', value: '4.9/5' },
                        { label: 'Tiempo Promedio', value: '30min' },
                    ].map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <dt className="order-2 mt-2 text-sm font-medium text-brand-200">{stat.label}</dt>
                            <dd className="order-1 text-3xl font-bold text-white">{stat.value}</dd>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Features Grid */}
        <div className="py-24 bg-brand-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">¿Por qué MANO YA?</h2>
                    <p className="text-brand-200">La plataforma estándar para servicios del hogar.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Shield className="w-8 h-8 text-brand-500" />,
                            title: "Garantía Total",
                            desc: "Cada trabajo está asegurado. Si no queda bien, lo arreglamos gratis."
                        },
                        {
                            icon: <CheckCircle className="w-8 h-8 text-green-500" />,
                            title: "Pros Verificados",
                            desc: "Solo aceptamos al top 5% de los profesionales. Antecedentes chequeados."
                        },
                        {
                            icon: <Star className="w-8 h-8 text-yellow-500" />,
                            title: "Precios Claros",
                            desc: "Cotización inmediata antes de contratar. Sin sorpresas ni recargos."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-500/50 transition-all hover:bg-white/[0.07] group">
                            <div className="mb-6 p-4 bg-brand-950 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-brand-200 leading-relaxed">
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
                <div className="flex items-center gap-2 opacity-50">
                    <Hammer className="w-5 h-5 text-white" />
                    <span className="font-bold text-lg">MANO YA</span>
                </div>
                <div className="text-brand-400 text-sm flex items-center gap-4">
                    <span>© 2025 Mano Ya Platform. Todos los derechos reservados.</span>
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
