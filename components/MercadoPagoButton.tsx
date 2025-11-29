import React, { useState } from 'react';
import { CreditCard, QrCode, ExternalLink, CheckCircle } from 'lucide-react';

interface MercadoPagoButtonProps {
  onSuccess: () => void;
  amountArs: number;
  paymentLink: string; // The real MP link
}

const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ onSuccess, amountArs, paymentLink }) => {
  const [linkOpened, setLinkOpened] = useState(false);

  const handlePaymentClick = () => {
    // Open the real Mercado Pago payment link in a new tab
    window.open(paymentLink, '_blank', 'noopener,noreferrer');
    setLinkOpened(true);
  };

  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      <button
        onClick={handlePaymentClick}
        className="group w-full flex flex-col items-center justify-center py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md bg-[#009EE3] hover:bg-[#008ED0] text-white border border-transparent"
      >
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
               <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] font-medium opacity-90 uppercase tracking-wide">Pagar con</span>
              <span className="font-bold text-lg leading-none">Mercado Pago</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xs opacity-80">Total</span>
            <span className="font-bold text-lg">${amountArs.toLocaleString('es-AR')}</span>
          </div>
        </div>
      </button>

      {linkOpened && (
        <div className="animate-fade-in bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-xs text-green-800 mb-2">
            Se abrió una pestaña segura de Mercado Pago.
            <br />
            Una vez completado el pago, confirmalo aquí:
          </p>
          <button
            onClick={onSuccess}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Ya realicé el pago
          </button>
        </div>
      )}
      
      {!linkOpened && (
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-gray-400">
           <CreditCard className="w-3 h-3" />
           <span>Tarjeta, Débito o Dinero en cuenta</span>
           <ExternalLink className="w-3 h-3 ml-1" />
        </div>
      )}
    </div>
  );
};

export default MercadoPagoButton;