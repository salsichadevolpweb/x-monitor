import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "visits.json");

app.use(cors());
app.use(express.json());

function readVisits() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveVisits(visits) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(visits, null, 2), "utf8");
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "";
}

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "X Monitor API está funcionando.",
    note: "Este sistema registra acessos ao seu próprio site/link; ele não consegue saber quem apenas abriu seu perfil no X."
  });
});

// Link que pode ser colocado no perfil do X.
// Ex.: https://SEU-DOMINIO/r
app.get("/r", (req, res) => {
  const visits = readVisits();

  visits.push({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    source: "X/link",
    referrer: req.get("referer") || "",
    userAgent: req.get("user-agent") || "",
    ip: getClientIp(req),
    path: "/r"
  });

  saveVisits(visits.slice(-1000));

  res.redirect(process.env.REDIRECT_URL || "https://x.com/");
});

// Endpoint usado pela página pública.
app.post("/api/visit", (req, res) => {
  const visits = readVisits();

  visits.push({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    source: req.body?.source || "site",
    referrer: req.get("referer") || "",
    userAgent: req.get("user-agent") || "",
    ip: getClientIp(req),
    path: req.body?.path || "/"
  });

  saveVisits(visits.slice(-1000));
  res.json({ ok: true });
});

app.get("/api/stats", (_req, res) => {
  const visits = readVisits();
  const today = new Date().toISOString().slice(0, 10);

  res.json({
    total: visits.length,
    today: visits.filter(v => v.createdAt.startsWith(today)).length
  });
});

app.get("/api/visits", (_req, res) => {
  const visits = readVisits()
    .slice()
    .reverse()
    .map(v => ({
      id: v.id,
      createdAt: v.createdAt,
      source: v.source,
      referrer: v.referrer,
      userAgent: v.userAgent,
      path: v.path
    }));

  res.json(visits);
});

app.listen(PORT, () => {
  console.log(`X Monitor API rodando em http://localhost:${PORT}`);
});