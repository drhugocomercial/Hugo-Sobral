import express from "express";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

console.log("Servidor iniciando...");
console.log("PORT:", process.env.PORT);

// Set up directories and file paths for server persistent storage
const DATA_DIR = path.join(process.cwd(), "data");
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const PROFESSIONALS_FILE = path.join(DATA_DIR, "professionals.json");
const PROCEDURES_FILE = path.join(DATA_DIR, "procedures.json");

// Safe helper to read from JSON file
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    if (existsSync(filePath)) {
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`[Server DB] Erro lendo ${filePath}:`, err);
  }
  return defaultValue;
}

// Safe helper to write to JSON file
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[Server DB] Erro gravando ${filePath}:`, err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

  // API Endpoints for persistent datastore
  app.get("/api/bookings", async (req, res) => {
    const list = await readJsonFile<any[]>(BOOKINGS_FILE, []);
    res.json(list);
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { bookings } = req.body;
      if (!Array.isArray(bookings)) {
        return res.status(400).json({ success: false, error: "dados de agendamentos inválidos. Deve ser uma array." });
      }
      await writeJsonFile(BOOKINGS_FILE, bookings);
      res.json({ success: true, count: bookings.length });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/professionals", async (req, res) => {
    const list = await readJsonFile<any[]>(PROFESSIONALS_FILE, []);
    res.json(list);
  });

  app.post("/api/professionals", async (req, res) => {
    try {
      const { professionals } = req.body;
      if (!Array.isArray(professionals)) {
        return res.status(400).json({ success: false, error: "dados de profissionais inválidos. Deve ser uma array." });
      }
      await writeJsonFile(PROFESSIONALS_FILE, professionals);
      res.json({ success: true, count: professionals.length });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/procedures", async (req, res) => {
    const list = await readJsonFile<any[]>(PROCEDURES_FILE, []);
    res.json(list);
  });

  app.post("/api/procedures", async (req, res) => {
    try {
      const { procedures } = req.body;
      if (!Array.isArray(procedures)) {
        return res.status(400).json({ success: false, error: "dados de procedimentos inválidos. Deve ser uma array." });
      }
      await writeJsonFile(PROCEDURES_FILE, procedures);
      res.json({ success: true, count: procedures.length });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // API Route: Send secure server-side WhatsApp message
  app.post("/api/whatsapp/send", async (req, res) => {
    try {
      const { to, text } = req.body;

      if (!to || !text) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios ausentes: 'to' (destinatário) e 'text' (mensagem) são necessários."
        });
      }

      // Read credentials from environment
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      // Graceful checking of missing credentials
      if (!accessToken || !phoneNumberId) {
        return res.status(503).json({
          success: false,
          isConfigured: false,
          error: "Integração do WhatsApp não configurada."
        });
      }

      // Format phone number to numbers only
      let cleanPhone = to.replace(/\D/g, '');
      if (cleanPhone.length === 11 || cleanPhone.length === 10) {
        cleanPhone = '55' + cleanPhone; // Ensure Brazilian country code if missing
      }

      const metaUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "text",
        text: {
          preview_url: false,
          body: text
        }
      };

      console.log(`[WhatsApp Server Log] Enviando mensagem para ${cleanPhone} através do Phone ID ${phoneNumberId}...`);

      const response = await fetch(metaUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json() as any;

      if (!response.ok) {
        console.error("[WhatsApp Server Log] Erro retornado pela API da Meta:", responseData);
        return res.status(response.status).json({
          success: false,
          error: responseData.error?.message || "Erro desconhecido retornado pela API da Meta.",
          details: responseData
        });
      }

      console.log("[WhatsApp Server Log] Mensagem enviada com sucesso!", responseData);
      return res.json({
        success: true,
        messageId: responseData.messages?.[0]?.id,
        status: "sent",
        details: responseData
      });

    } catch (err: any) {
      console.error("[WhatsApp Server Log] Falha geral no servidor de envio:", err);
      return res.status(500).json({
        success: false,
        error: err.message || "Falha interna ao tentar enviar a mensagem de WhatsApp."
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");

    const vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: "spa"
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Rodando na porta ${PORT} em ambiente de ${process.env.NODE_ENV || 'desenvolvimento'}`);
  });
}

startServer();
