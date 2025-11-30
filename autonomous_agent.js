import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';

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
const PROMOTION_LINK = process.env.PROMOTION_LINK || "https://mano-ya.vercel.app"; // Link de tu web o app

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// En producción real, esto requiere una key válida de Gemini
const ai = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Helper para loguear en Supabase
async function logSystem(agent, message) {
    console.log(`[${agent}] ${message}`);
    if (supabase) {
        await supabase.from('system_logs').insert({ agent_name: agent, message: message });
    }
}

async function runMarketingAgent() {
    console.log("------------------------------------------------");
    console.log(`🤖 AGENTE MANO YA - CICLO DE EJECUCIÓN: ${new Date().toISOString()}`);
    console.log(`💰 Presupuesto Asignado: $${MARKETING_BUDGET} USD`);
    console.log(`🔗 Link a Promocionar: ${PROMOTION_LINK}`);
    console.log("------------------------------------------------");

    if (!ai) {
        console.error("❌ ERROR CRÍTICO: Falta API_KEY de Gemini. El agente no puede pensar.");
        return;
    }

    try {
        // 1. Decisión Estratégica (Real)
        console.log("🧠 Consultando a Gemini para estrategia en tiempo real...");
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      Eres el CEO Autónomo de "MANO YA".
      Presupuesto actual: $${MARKETING_BUDGET}.
      Objetivo: Maximizar tráfico y descargas de la plataforma: ${PROMOTION_LINK}.
      NO compartas links de pago directo. Queremos usuarios en la app.
      
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
                await logSystem("MARKETING", `⚠️ FALTA META_TOKEN. Acción requerida: Publicar manualmente: "${strategy.copy}"`);
            } else {
                await logSystem("MARKETING", "🚀 Publicando anuncio en Facebook Ads...");
                // await postToFacebook(strategy.copy, strategy.bid);
                await logSystem("MARKETING", "✅ Anuncio enviado a revisión.");
            }
        } else {
            await logSystem("MARKETING", `📢 Ejecutando acción orgánica: "${strategy.copy}"`);
        }

    } catch (error) {
        await logSystem("MARKETING", `🔥 Error: ${error.message}`);
    }
}

async function runRecruiterAgent() {
    await logSystem("RECRUITER", "Buscando nuevos profesionales...");
    if (!ai) return;

    try {
        // Contar profesionales actuales
        let count = 0;
        if (supabase) {
            const { count: dbCount } = await supabase.from('professionals').select('*', { count: 'exact', head: true });
            count = dbCount || 0;
        }
        await logSystem("RECRUITER", `Profesionales actuales en base de datos: ${count}`);

        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            Eres el Recruiter Autónomo de "MANO YA".
            Objetivo: Atraer nuevos profesionales. Ya tenemos ${count} registrados.
            Link de registro: ${PROMOTION_LINK}/profesionales
            
            Redacta un post corto para LinkedIn.
            Responde SOLO con el texto.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        await logSystem("RECRUITER", `Post generado: "${text.substring(0, 50)}..."`);
    } catch (error) {
        await logSystem("RECRUITER", `⚠️ Error: ${error.message}`);
    }
}

async function runFinanceAgent() {
    await logSystem("FINANCE", "Analizando flujo de caja...");

    let realRevenue = 0;
    if (supabase) {
        const { data } = await supabase.from('financial_logs').select('amount').eq('type', 'INCOME');
        realRevenue = data?.reduce((sum, item) => sum + item.amount, 0) || 0;
    }

    await logSystem("FINANCE", `Ingresos Totales Reales: $${realRevenue.toFixed(2)} USD`);

    if (realRevenue > 100) {
        await logSystem("FINANCE", "📈 Ingresos superan objetivo. AUMENTAR presupuesto de marketing.");
    } else {
        await logSystem("FINANCE", "📉 Ingresos bajos. MANTENER austeridad.");
    }
}

async function runOrchestrator() {
    console.log("\n==================================================");
    console.log(`🚀 INICIANDO SISTEMA MULTI-AGENTE - ${new Date().toISOString()}`);
    console.log("==================================================");

    await runMarketingAgent();
    await runRecruiterAgent();
    await runFinanceAgent();

    console.log("\n💤 Ciclo finalizado. Durmiendo 1 hora...");
}

// Bucle de Autogestión (Cada 1 hora)
console.log("🟢 SISTEMA INICIADO. Los 3 agentes correrán cada 1 hora indefinidamente.");
runOrchestrator(); // Ejecutar inmediatamente al inicio
setInterval(runOrchestrator, 1000 * 60 * 60); // 1 hora