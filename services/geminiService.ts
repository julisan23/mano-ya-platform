import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, TradeType, MarketingStrategy, CompanyStats, CorporateAction } from "../types";

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set
const ai = new GoogleGenAI({ apiKey });

// Shared model configuration for complex reasoning
const MODEL_NAME = 'gemini-3-pro-preview';

export const analyzeServiceRequest = async (description: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    console.warn("API Key missing, returning mock analysis");
    return {
      trade: TradeType.VARIOS,
      reasoning: "Clasificación automática no disponible (Falta API Key).",
      urgency: 'Media'
    };
  }

  try {
    const model = ai.models;
    
    // We want the AI to map the user description to one of our Enums
    const prompt = `
      Analiza el siguiente problema de un usuario en Buenos Aires y clasificalo en uno de los siguientes rubros profesionales:
      [${Object.values(TradeType).join(', ')}].
      
      Problema del usuario: "${description}"
      
      Devuelve un JSON con el rubro (trade), una breve razón (reasoning) y la urgencia estimada (urgency: Alta, Media, Baja).
    `;

    const response = await model.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trade: { type: Type.STRING, enum: Object.values(TradeType) },
            reasoning: { type: Type.STRING },
            urgency: { type: Type.STRING, enum: ['Alta', 'Media', 'Baja'] }
          },
          required: ['trade', 'reasoning', 'urgency']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AIAnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error
    return {
      trade: TradeType.VARIOS,
      reasoning: "No pudimos clasificar el problema automáticamente, pero aquí hay profesionales generales.",
      urgency: 'Media'
    };
  }
};

export const generateMarketingCampaign = async (target: 'PROFESSIONALS' | 'USERS', goal: string): Promise<MarketingStrategy> => {
  if (!apiKey) {
    return {
      targetAudience: target === 'PROFESSIONALS' ? 'Profesionales' : 'Clientes',
      platform: 'Instagram',
      adCopy: '¡Únite a MANO YA! La mejor app para servicios del hogar.',
      callToAction: 'Descargá la app',
      imageDescription: 'Una persona feliz usando el celular.',
      hashtags: ['#ManoYa', '#Servicios']
    };
  }

  try {
    const prompt = `
      Eres el Agente de Crecimiento (Growth Agent) de la app "MANO YA".
      Objetivo: ${target === 'PROFESSIONALS' ? 'Atraer nuevos profesionales' : 'Atraer usuarios'}.
      Contexto: ${goal}.
      Ubicación: Buenos Aires / AMBA.
      Devuelve JSON con estrategia de anuncio.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetAudience: { type: Type.STRING },
            platform: { type: Type.STRING },
            adCopy: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            imageDescription: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['targetAudience', 'platform', 'adCopy', 'callToAction', 'imageDescription', 'hashtags']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as MarketingStrategy;

  } catch (error) {
    console.error("Marketing Agent Error:", error);
    throw error;
  }
};

// --- AUTONOMOUS CEO LOGIC ---

export const consultCEO = async (stats: CompanyStats): Promise<CorporateAction> => {
  if (!apiKey) {
    // Fallback logic for demo without API key
    const isSupplyLow = stats.activePros < stats.activeUsers * 0.2;
    return {
      role: isSupplyLow ? 'RECRUITER_BOT' : 'MARKETING_BOT',
      action: isSupplyLow ? 'Escaneando LinkedIn en busca de Plomeros...' : 'Lanzando campaña de Google Ads en Zona Norte...',
      outcome: isSupplyLow ? '5 Profesionales contactados.' : '200 Impresiones de anuncios.',
      requiresApproval: Math.random() > 0.8,
      approvalMessage: 'Oportunidad de compra de base de datos de gasistas. Inversión $500 USD.',
      deltaUsers: isSupplyLow ? 0 : Math.floor(Math.random() * 5),
      deltaPros: isSupplyLow ? Math.floor(Math.random() * 2) : 0,
      deltaRevenue: Math.floor(Math.random() * 50)
    };
  }

  const prompt = `
    Actúa como el CEO de Inteligencia Artificial de "MANO YA".
    Estadísticas actuales:
    - Usuarios activos: ${stats.activeUsers}
    - Profesionales: ${stats.activePros}
    - Ingresos: $${stats.monthlyRevenueUSD}
    
    Tu objetivo es escalar la empresa.
    1. Si hay pocos profesionales (Ratio < 0.3), activa RECRUITER_BOT.
    2. Si hay muchos profesionales, activa MARKETING_BOT para conseguir clientes.
    3. Si los ingresos suben, activa STRATEGY_BOT para optimizar.
    
    Genera una acción corporativa en JSON.
    'requiresApproval' debe ser true SOLO si la decisión es arriesgada (ej. gastar mucho dinero, abrir nueva zona).
    
    Formato JSON esperado:
    {
      "role": "RECRUITER_BOT" | "MARKETING_BOT" | "FINANCE_BOT",
      "action": "Descripción técnica de la tarea (ej. Scraping Facebook Groups)",
      "outcome": "Resultado estimado (ej. +3 Pros)",
      "requiresApproval": boolean,
      "approvalMessage": "Mensaje corto al Presidente para pedir permiso (si requiere aprobación)",
      "deltaUsers": number (entero, cuantos usuarios nuevos trae esta acción),
      "deltaPros": number (entero, cuantos pros nuevos),
      "deltaRevenue": number (entero, ganancia estimada)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING, enum: ['RECRUITER_BOT', 'MARKETING_BOT', 'FINANCE_BOT', 'STRATEGY_BOT'] },
            action: { type: Type.STRING },
            outcome: { type: Type.STRING },
            requiresApproval: { type: Type.BOOLEAN },
            approvalMessage: { type: Type.STRING },
            deltaUsers: { type: Type.INTEGER },
            deltaPros: { type: Type.INTEGER },
            deltaRevenue: { type: Type.INTEGER }
          },
          required: ['role', 'action', 'outcome', 'requiresApproval', 'deltaUsers', 'deltaPros', 'deltaRevenue']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI CEO");
    return JSON.parse(text) as CorporateAction;
  } catch (error) {
    console.error("CEO AI Error:", error);
    throw error;
  }
};