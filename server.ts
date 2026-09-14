import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // PRD Bagian 9.2: Keepalive Cron Endpoint
  // Method: GET
  // Validasi: Authorization: Bearer {CRON_SECRET}
  // Query: SELECT id FROM projects LIMIT 1
  // Response: { ok: true } status 200
  app.get("/api/cron/keepalive", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    // Validate cron secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ ok: false, message: "Unauthorized cron request" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      try {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const { error } = await supabase.from("projects").select("id").limit(1);
        if (error) {
          return res.status(500).json({ ok: false, error: error.message });
        }
      } catch (err: any) {
        return res.status(500).json({ ok: false, error: err.message });
      }
    }

    return res.status(200).json({ ok: true });
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
