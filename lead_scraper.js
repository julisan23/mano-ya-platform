import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const TARGET_CITIES = ['Buenos Aires', 'CABA', 'Palermo', 'Recoleta'];
const SERVICES = ['Plomero', 'Electricista', 'Gasista', 'Cerrajero'];

async function scrapeGoogleMaps() {
    console.log("🕵️ INICIANDO LEAD SCRAPER (Google Maps)...");

    if (!supabase) {
        console.error("❌ ERROR: Falta configuración de Supabase (SUPABASE_URL / SUPABASE_KEY).");
        return;
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    for (const service of SERVICES) {
        for (const city of TARGET_CITIES) {
            const query = `${service} en ${city}`;
            console.log(`🔎 Buscando: "${query}"...`);

            try {
                await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`);
                await page.waitForSelector('div[role="feed"]', { timeout: 5000 }).catch(() => console.log("   ⚠️ No se encontraron resultados rápidos."));

                // Scroll para cargar más resultados
                await autoScroll(page);

                // Extraer datos
                const leads = await page.evaluate(() => {
                    const items = Array.from(document.querySelectorAll('div[role="article"]'));
                    return items.map(item => {
                        const text = item.innerText;
                        const lines = text.split('\n');
                        return {
                            name: lines[0],
                            phone: lines.find(l => l.match(/(\+\d{2,4}|\d{2,4})[\s-]?\d{3,4}[\s-]?\d{3,4}/)) || null,
                            website: item.querySelector('a[data-value="Website"]')?.getAttribute('href') || null
                        };
                    }).filter(l => l.phone); // Solo guardar si tiene teléfono
                });

                console.log(`   ✅ Encontrados ${leads.length} profesionales.`);

                // Guardar en Supabase
                for (const lead of leads) {
                    const { error } = await supabase
                        .from('professionals')
                        .insert({
                            name: lead.name,
                            service_type: service,
                            phone: lead.phone,
                            website: lead.website,
                            source: 'Google Maps Scraper'
                        });

                    if (error) console.error("   ❌ Error guardando lead:", error.message);
                }

            } catch (e) {
                console.error(`   ⚠️ Error buscando ${query}:`, e.message);
            }
        }
    }

    await browser.close();
    console.log("🏁 SCRAPING FINALIZADO.");
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        const wrapper = document.querySelector('div[role="feed"]');
        if (!wrapper) return;
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 1000;
            const timer = setInterval(() => {
                const scrollHeight = wrapper.scrollHeight;
                wrapper.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

scrapeGoogleMaps();
