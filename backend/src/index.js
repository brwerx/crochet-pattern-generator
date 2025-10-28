import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "crochet-backend", version: "0.1.0" });
});

// Stub: pattern generator (no OpenAI yet)
app.post("/api/generate", (req, res) => {
  const { itemType = "scarf", skill = "beginner", widthIn = 7, lengthIn = 60 } = req.body || {};
  const pattern = {
    title: `Simple ${itemType} ( ${skill} )`,
    gauge: "16 sts x 20 rows = 4\" in SC (US) with worsted yarn & 5.0 mm hook",
    materials: [
      "Worsted (#4) yarn ~300–400 yds",
      "US H/5.0 mm hook",
      "Tapestry needle, scissors"
    ],
    abbreviations: { CH: "chain", SC: "single crochet", REP: "repeat" },
    instructions: [
      `Foundation: CH multiple to reach ~${widthIn}" (about 20–28 CH).`,
      "Row 1: SC in 2nd CH from hook and in each CH across. CH 1, turn.",
      "Row 2: SC in each stitch across. CH 1, turn.",
      `Rows 3–end: REP Row 2 until length ~${lengthIn}".`,
      "Fasten off. Weave in ends. Block lightly if desired."
    ],
    notes: ["Adjust starting chain for width. Keep edges even by chaining 1 at turn."]
  };
  res.json(pattern);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
