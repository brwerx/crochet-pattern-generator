import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

// Load env first
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Simple request log (dev)
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static frontend from ../public
app.use(express.static(path.join(__dirname, "..", "public")));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "crochet-backend", version: "0.1.0" });
});

// Simple example pattern (static)
app.get("/api/generate/example", (_req, res) => {
  res.json({
    title: "Simple Scarf (Beginner)",
    gauge: "16 sts x 20 rows = 4\" in SC with worsted yarn & 5.0 mm hook",
    materials: [
      "Worsted (#4) yarn ~300–400 yds",
      "US H/5.0 mm hook",
      "Tapestry needle",
      "Scissors"
    ],
    abbreviations: { ch: "chain", sc: "single crochet", "sl st": "slip stitch", sts: "stitches" },
    instructions: [
      "Foundation: CH 20–28 to reach ~7\" width.",
      "Row 1: SC in 2nd CH from hook and in each CH across. CH 1, turn.",
      "Row 2: SC in each stitch across. CH 1, turn.",
      "Rows 3–end: Repeat Row 2 until the scarf measures ~60\". Fasten off; weave in ends."
    ],
    notes: ["Adjust starting chain for width; block lightly if desired."]
  });
});

// AI generation endpoint (Chat Completions JSON mode)
app.post("/api/generate", async (req, res) => {
  const {
    itemType = "scarf",
    skill = "beginner",
    widthIn = 7,
    lengthIn = 60
  } = req.body || {};

  // very light input clamp
  const w = Math.max(1, Math.min(60, Number(widthIn) || 7));
  const l = Math.max(1, Math.min(120, Number(lengthIn) || 60));

  const itemHints = {
    scarf: "Worked flat in rows, rectangular shape.",
    coaster: "Small flat circle or square, about 4–5 inches across.",
    beanie: "Worked in the round, sized for an adult head."
  };
  const hint = itemHints[itemType] || "";

  const prompt = `
You are a professional crochet designer.
Generate a ${skill} crochet pattern for a ${itemType}. ${hint}
Use US crochet terms.

Target width: ${w} inches.
Target length: ${l} inches (or finished size if round).

Return ONLY valid JSON with the following fields:
{
  "title": "string",
  "gauge": "string",
  "materials": ["string"],
  "abbreviations": { "ABBR": "meaning" },
  "instructions": ["string"],
  "notes": ["string"]
}

Keep each instruction concise and ensure stitch counts are consistent within a row/round.
Do NOT include any commentary outside of the JSON.
`;

  try {
    // Stable path: Chat Completions with JSON mode
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a precise crochet pattern generator that outputs strict JSON." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    let raw = completion.choices?.[0]?.message?.content || "{}";

    // Safe parsing
    let pattern;
    try {
      pattern = JSON.parse(raw);
    } catch {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      pattern = JSON.parse(raw.slice(start, end + 1));
    }

    // Sanity check
    if (!Array.isArray(pattern.instructions) || pattern.instructions.length === 0) {
      throw new Error("No instructions returned from model");
    }

    res.json(pattern);
  } catch (err) {
    console.error("Error generating pattern:", err);
    res.status(500).json({
      error: "Pattern generation failed",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
