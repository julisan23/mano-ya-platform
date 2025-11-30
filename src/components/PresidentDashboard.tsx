import React, { useState, useEffect } from 'react';
import { Terminal, Users, Briefcase, DollarSign, Activity, Lock, X, Play, Pause } from 'lucide-react';

export function PresidentDashboard({ onClose }: { onClose: () => void }) {
    const [logs, setLogs] = useState<string[]>([
        "Esperando inicialización del núcleo... (Presione INICIAR)"
    ]);
    const [isRunning, setIsRunning] = useState(false);
    const [stats, setStats] = useState({
        users: 1240,
        pros: 85,
        revenue: 4500,
        sentiment: 85
    });

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            const newLog = generateLog();
            setLogs(prev => [...prev.slice(-5), newLog]); // Keep last 6 logs
            
            // Simulate live stats updates
            setStats(prev => ({
                users: prev.users + (Math.random() > 0.7 ? 1 : 0),
                pros: prev.pros,
                revenue: prev.revenue + (Math.random() > 0.9 ? 15 : 0),
                sentiment: Math.min(100, Math.max(0, prev.sentiment + (Math.random() - 0.5)))
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const generateLog = () => {
        const actions = [
            "👷 RECRUITER_BOT: Escaneando LinkedIn...",
            "📢 MARKETING_BOT: Optimizando campaña de Ads...",
            "💰 FINANCE_BOT: Verificando ingresos Mercado Pago...",
            "🧠 CORE: Analizando métricas de rendimiento...",
            "✅ Nuevo usuario registrado desde Buenos Aires.",
            "💲 Pago recibido: $15.00 USD"
        ];
        const timestamp = new Date().toLocaleTimeString();
        return `[${timestamp}] ${actions[Math.floor(Math.random() * actions.length)]}`;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 text-cyan-500 font-mono p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-cyan-900/50 pb-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <Terminal className="w-8 h-8 text-cyan-400" />
                        _ CENTRO DE COMANDO <span className="text-cyan-400">MANO YA</span>
                    </h1>
                    <p className="text-cyan-700 text-sm mt-1">Hola, Presidente Santarsiero. Sistema Operativo Autónomo V3.0.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded border border-cyan-900/30">
                        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-bold tracking-wider">{isRunning ? 'AUTOPILOT: ACTIVE' : 'AUTOPILOT: PAUSED'}</span>
                    </div>
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`px-6 py-2 rounded font-bold transition-all ${isRunning ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'}`}
                    >
                        {isRunning ? 'PAUSAR' : 'INICIAR'}
                    </button>
                    <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded transition-colors">
                        SALIR
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<Users />} label="USUARIOS ACTIVOS" value={stats.users} sub="↗ Creciendo automático" color="text-white" />
                <StatCard icon={<Briefcase />} label="PROFESIONALES" value={stats.pros} sub="Ratio: 0.07" color="text-white" />
                <StatCard icon={<DollarSign />} label="REVENUE (USD)" value={`$${stats.revenue.toFixed(0)}`} sub="Balance PayPal/MP" color="text-green-400" />
                <div className="bg-slate-900/50 border border-cyan-900/30 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-2 text-cyan-600 text-xs font-bold tracking-wider uppercase">
                        <Activity className="w-4 h-4" /> SENTIMENT IA
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{stats.sentiment.toFixed(0)}%</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${stats.sentiment}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Main Content: Logs & Agents */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
                {/* Agents Status */}
                <div className="bg-slate-900/50 border border-cyan-900/30 rounded-xl p-6 overflow-y-auto">
                    <h3 className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-6">Agentes Activos</h3>
                    <div className="space-y-4">
                        <AgentStatus name="RECRUITER_BOT" status="Online" desc="Escaneando LinkedIn, Grupos de Facebook y Webs de oficios." color="text-blue-400" />
                        <AgentStatus name="MARKETING_BOT" status="Working" desc="Generando campañas en Instagram, TikTok y Google Ads." color="text-purple-400" />
                        <AgentStatus name="FINANCE_BOT" status="Standby" desc="Optimizando tarifas, cobros y pasarelas de pago." color="text-green-400" />
                    </div>
                </div>

                {/* Terminal */}
                <div className="md:col-span-2 bg-slate-950 border border-cyan-900/50 rounded-xl p-6 font-mono text-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-6 bg-slate-900 flex items-center px-4 gap-2 border-b border-cyan-900/30">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-slate-500 text-xs">/var/log/mano_ya_autonomous_core</span>
                    </div>
                    <div className="mt-8 space-y-2 h-full overflow-y-auto pb-4">
                        {logs.map((log, i) => (
                            <div key={i} className="text-cyan-300/80 border-l-2 border-cyan-900 pl-3 animate-fade-in">
                                <span className="text-cyan-600 mr-2">$</span>
                                {log}
                            </div>
                        ))}
                        {isRunning && (
                            <div className="animate-pulse text-cyan-500">_</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub, color }: any) {
    return (
        <div className="bg-slate-900/50 border border-cyan-900/30 p-6 rounded-xl hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-2 mb-2 text-cyan-600 text-xs font-bold tracking-wider uppercase">
                {icon} {label}
            </div>
            <div className={`text-4xl font-bold mb-1 ${color}`}>{value}</div>
            <div className="text-xs text-cyan-700">{sub}</div>
        </div>
    );
}

function AgentStatus({ name, status, desc, color }: any) {
    return (
        <div className="p-4 rounded-lg bg-slate-800/50 border border-white/5">
            <div className="flex justify-between items-center mb-2">
                <span className={`font-bold ${color}`}>{name}</span>
                <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-900">{status}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}
