import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, ArrowRight, ScanFace, CheckCircle, ShieldCheck, Camera } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode: 'client' | 'professional';
}

export function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
    const [mode, setMode] = useState<'client' | 'professional'>(initialMode);
    const [step, setStep] = useState<'login' | 'biometric' | 'success'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [biometricProgress, setBiometricProgress] = useState(0);

    useEffect(() => {
        setMode(initialMode);
        setStep('login');
    }, [initialMode, isOpen]);

    if (!isOpen) return null;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (mode === 'professional') {
                setStep('biometric');
                startBiometricSimulation();
            } else {
                setStep('success');
                setTimeout(onClose, 2000);
            }
        }, 1500);
    };

    const startBiometricSimulation = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            setBiometricProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setStep('success');
                setTimeout(onClose, 2000);
            }
        }, 50);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        {step === 'biometric' ? 'Verificación de Identidad' :
                            step === 'success' ? '¡Bienvenido a TECNIA!' :
                                mode === 'client' ? 'Acceso Clientes' : 'Acceso Profesionales'}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">

                    {/* Step 1: Login Form */}
                    {step === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="flex p-1 bg-white/5 rounded-lg mb-8">
                                <button
                                    type="button"
                                    onClick={() => setMode('client')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'client' ? 'bg-brand-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    Soy Cliente
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('professional')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'professional' ? 'bg-brand-500 text-black shadow-lg' : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    Soy Profesional
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-brand-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-500 text-black font-bold py-4 rounded-xl hover:bg-brand-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Procesando...</span>
                                ) : (
                                    <>
                                        {mode === 'client' ? 'Ingresar' : 'Continuar'} <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-zinc-500 text-sm">
                                ¿No tenés cuenta? <a href="#" className="text-brand-500 hover:underline">Registrate gratis</a>
                            </p>
                        </form>
                    )}

                    {/* Step 2: Biometric Simulation (Only for Professionals) */}
                    {step === 'biometric' && (
                        <div className="text-center space-y-8 py-4">
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 rounded-full border-4 border-brand-500/20"></div>
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"
                                    style={{ animationDuration: '2s' }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ScanFace className="w-12 h-12 text-brand-500 animate-pulse" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Verificando Identidad</h3>
                                <p className="text-zinc-400 text-sm">
                                    Estamos analizando tus datos biométricos con RENAPER y bases de antecedentes.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-zinc-500 uppercase tracking-wider font-bold">
                                    <span>Validando Rostro</span>
                                    <span>{biometricProgress}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-500 transition-all duration-100 ease-out"
                                        style={{ width: `${biometricProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4 text-xs text-zinc-600">
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Encriptación Militar
                                </div>
                                <div className="flex items-center gap-1">
                                    <Camera className="w-3 h-3" /> Liveness Check
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 'success' && (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">¡Acceso Correcto!</h3>
                            <p className="text-zinc-400">
                                {mode === 'professional'
                                    ? 'Tu identidad ha sido validada exitosamente.'
                                    : 'Redirigiendo a tu panel de control...'}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
