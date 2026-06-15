import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

console.log("Servidor iniciando...");
console.log("PORT:", process.env.PORT);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware to parse JSON payloads
  app.use(express.json());

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
          error: "Integração do WhatsApp não configurada no servidor. Chaves ausentes nas variáveis de ambiente.",
          isConfigured: false,
          instructions: "Para ativar, configure 'WHATSAPP_ACCESS_TOKEN' e 'WHATSAPP_PHONE_NUMBER_ID' nas variáveis de ambiente do sistema."
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
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Rodando na porta ${PORT} em ambiente de ${process.env.NODE_ENV || 'desenvolvimento'}`);
  });
}

startServer();
