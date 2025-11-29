import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  label: string;
  instruction: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, label, instruction }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    setLoading(true);
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Prefer back camera, fallback to front
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('No se pudo acceder a la cámara. Por favor verifica los permisos o intenta en otro navegador.');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        stopCamera();
        onCapture(dataUrl);
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => stopCamera();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">{label}</h3>
      <p className="text-sm text-slate-500 mb-4 text-center">{instruction}</p>

      <div className="relative w-full max-w-sm aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-300 shadow-inner flex items-center justify-center">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-red-400">
             <AlertTriangle className="w-10 h-10 mb-2" />
             <p className="text-sm">{error}</p>
             <button onClick={startCamera} className="mt-4 text-xs underline">Reintentar</button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
             <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {!stream && !capturedImage && !loading && !error && (
          <div className="flex flex-col items-center text-slate-400">
            <Camera className="w-12 h-12 mb-2" />
            <button 
              onClick={startCamera}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-full font-bold transition-all"
            >
              Activar Cámara
            </button>
          </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover ${(!stream || capturedImage) ? 'hidden' : 'block'}`}
        />
        
        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-4 flex gap-4">
        {stream && (
          <button 
            onClick={takePhoto}
            className="w-16 h-16 rounded-full border-4 border-white bg-red-600 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
            aria-label="Tomar foto"
          >
             <div className="w-full h-full rounded-full border-2 border-transparent"></div>
          </button>
        )}

        {capturedImage && (
          <button 
            onClick={retake}
            className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800"
          >
            <RefreshCw className="w-4 h-4" /> Retomar Foto
          </button>
        )}
      </div>
      
      {capturedImage && (
         <div className="mt-2 text-green-600 text-sm font-bold flex items-center gap-1 animate-pulse">
           <CheckCircle className="w-4 h-4" /> Imagen capturada
         </div>
      )}
    </div>
  );
};

export default CameraCapture;