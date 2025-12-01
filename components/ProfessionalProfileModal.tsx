import React, { useState } from 'react';
import { X, Star, Shield, CheckCircle, MapPin, Clock, CreditCard, ArrowRight } from 'lucide-react';

interface Professional {
    id: number;
    name: string;
    service_type: string;
    phone?: string;
    website?: string;
    source?: string;
}

interface ProfessionalProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    professional: Professional | null;
}

export function ProfessionalProfileModal({ isOpen, onClose, professional }: ProfessionalProfileModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !professional) return null;

    const handleHire = () => {
        setIsProcessing(true);
        // Simulate redirection to payment gateway
        setTimeout(() => {
            setIsProcessing(false);
            // In a real app, this would be a Mercado Pago link
            // window.location.href = process.env.VITE_MERCADO_PAGO_LINK || '#';
            alert('Redirigiendo a Mercado Pago para abonar la visita técnica...');
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row">

                {/* Left Column: Profile Info */}
                <div className="w-full md:w-1/3 bg-zinc-800/50 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-white/5">
                    <div className="w-32 h-32 bg-brand-500 rounded-full flex items-center justify-center text-black font-bold text-4xl mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        {professional.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">{professional.name}</h2>
                    <p className="text-brand-500 font-medium text-sm mb-4">{professional.service_type}</p>

                    <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10 mb-6">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-zinc-300 font-medium">Identidad Validada</span>
                    </div>

                    <div className="w-full space-y-3 text-left">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Reputación</span>
                            <div className="flex items-center gap-1 text-brand-500">
                                <Star className="w-3 h-3 fill-brand-500" /> 5.0
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Trabajos</span>
                            <span className="text-white">124+</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Zona</span>
                            <span className="text-white">CABA</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Action */}
                <div className="w-full md:w-2/3 p-8 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-brand-500" /> Garantía TECNIA
                    </h3>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                        Este profesional ha superado nuestro riguroso proceso de validación de 5 puntos.
                        Tu contratación incluye seguro de accidentes y garantía de satisfacción de 30 días.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <Clock className="w-4 h-4 text-brand-500 mb-2" />
                            <div className="text-xs text-zinc-500">Disponibilidad</div>
                            <div className="text-sm font-bold text-white">Inmediata</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <CreditCard className="w-4 h-4 text-brand-500 mb-2" />
                            <div className="text-xs text-zinc-500">Visita Técnica</div>
                            <div className="text-sm font-bold text-white">$15.000</div>
                        </div>
                    </div>

                    <button
                        onClick={handleHire}
                        disabled={isProcessing}
                        className="w-full bg-brand-500 text-black font-bold py-4 rounded-xl hover:bg-brand-400 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <span className="animate-pulse">Procesando pago...</span>
                        ) : (
                            <>
                                CONTRATAR AHORA <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-zinc-600 mt-4">
                        Pago seguro procesado por Mercado Pago.
                    </p>
                </div>
            </div>
        </div>
    );
}
