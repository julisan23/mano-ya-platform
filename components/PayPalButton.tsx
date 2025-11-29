import React, { useState } from 'react';

interface PayPalButtonProps {
  onSuccess: () => void;
  amount: number;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ onSuccess, amount }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
        <p className="text-gray-600 mb-4 text-sm">Pago de servicio de conexión</p>
        <p className="text-3xl font-bold text-slate-900 mb-6">USD ${amount}.00</p>
        
        <button
          onClick={handleClick}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full font-bold transition-all ${
            loading 
              ? 'bg-gray-200 cursor-not-allowed text-gray-400' 
              : 'bg-[#FFC439] hover:bg-[#F4BB2E] text-[#003087]'
          }`}
        >
          {loading ? (
            <span>Procesando...</span>
          ) : (
            <>
              <span className="italic font-serif font-bold text-lg">Pay</span>
              <span className="italic font-serif font-bold text-lg text-[#009cde]">Pal</span>
            </>
          )}
        </button>
        <p className="text-xs text-gray-400 mt-4">Tarjeta de crédito o saldo PayPal</p>
      </div>
    </div>
  );
};

export default PayPalButton;