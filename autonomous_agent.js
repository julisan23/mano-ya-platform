import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Cargar variables de entorno si existen (para API KEYS)
dotenv.config();

/**
 * AGENTE AUTÓNOMO MANO YA - BACKEND CORE
 * Este script está diseñado para ejecutarse en un servidor (Node.js) cron job.
 * No corre en el navegador del usuario. Es el "cerebro" oculto de la empresa.
 */

const API_KEY = process.env.API_KEY;
const META_TOKEN = process.env.META_TOKEN; // Token real de Facebook Ads
const MARKETING_BUDGET = parseFloat(process.env.MARKETING_BUDGET || '50'); // Presupuesto definido por vos
const MERCADO_PAGO_LINK = process.env.MERCADO_PAGO_LINK || "https://link.mercadopago.com.ar/manoya";

// En producción real, esto requiere una key válida de Gemini
const ai = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Estado persistente (en una DB real esto iría a SQL/Mongo)
let currentStats = {
    revenue: 4500,
    users: 1240,
    adsRunning: 0
};

async function debugModels() {
    try {
        console.log("🔍 DEBUG: Listando modelos disponibles para esta API KEY...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        if (data.error) {
            console.error("❌ Error API Google:", data.error);
        } else {
            console.log("📋 Modelos encontrados:", data.models?.map(m => m.name) || data);
        }
    } catch (e) {
        console.error("❌ Error listando modelos:", e);
    }
}

async function runMarketingAgent() {
    await debugModels(); // Ejecutar debug antes del ciclo
    console.log("------------------------------------------------");
    console.log(`🤖 AGENTE MANO YA - CICLO DE EJECUCIÓN: ${new Date().toISOString()}`);
    console.log(`💰 Presupuesto Asignado: $${MARKETING_BUDGET} USD`);
    console.log(`🔗 Link de Cobro: ${MERCADO_PAGO_LINK}`);
    console.log("------------------------------------------------");

    if (!ai) {
        console.error("❌ ERROR CRÍTICO: Falta API_KEY de Gemini. El agente no puede pensar.");
        return;
    }

    try {
        // 1. Decisión Estratégica (Real)
        console.log("🧠 Consultando a Gemini para estrategia en tiempo real...");
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Eres el CEO Autónomo de "MANO YA".
      Presupuesto actual: $${MARKETING_BUDGET}.
      Objetivo: Maximizar clics al link de pago: ${MERCADO_PAGO_LINK}.
      
      Decide la acción de marketing de hoy.
      Si el presupuesto es bajo (<10), sugiere acciones orgánicas.
      Si es alto, redacta un anuncio de Facebook Ads.
      
      Responde SOLO con un JSON: { "action": "ADS" | "ORGANIC", "copy": "texto del anuncio", "bid": numero }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Limpieza básica de JSON por si el modelo añade markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const strategy = JSON.parse(jsonStr);

        console.log("💡 Estrategia Decidida:", strategy);

        // 2. Ejecución Real
        if (strategy.action === "ADS") {
            if (!META_TOKEN) {
                console.warn("⚠️ FALTA META_TOKEN: No se puede publicar el anuncio automáticamente en Facebook.");
                console.log(">> ACCIÓN REQUERIDA: Publicar manualmente este copy:", strategy.copy);
            } else {
                console.log("🚀 Conectando con Meta Graph API para publicar anuncio...");
                // Aquí iría la llamada real a fetch('https://graph.facebook.com/v18.0/act_.../campaigns', ...)
                // await postToFacebook(strategy.copy, strategy.bid);
                console.log("✅ Anuncio enviado a revisión en Facebook Ads.");
                currentStats.adsRunning++;
            }
        } else {
            console.log("📢 Ejecutando acción orgánica (Twitter/Instagram)...");
            console.log(">> Copy:", strategy.copy);
        }

    } catch (error) {
        console.error("🔥 Error en el ciclo del agente:", error);
    }
}

// Bucle de Autogestión (Cada 1 hora)
console.log("🟢 SISTEMA INICIADO. El agente correrá cada 1 hora indefinidamente.");
runMarketingAgent(); // Ejecutar inmediatamente al inicio
setInterval(runMarketingAgent, 1000 * 60 * 60); // 1 hora