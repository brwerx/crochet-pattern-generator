import { useState } from "react";
import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });

export default function App() {
  const [itemType, setItemType] = useState("scarf");
  const [skill, setSkill] = useState("beginner");
  const [widthIn, setWidthIn] = useState(7);
  const [lengthIn, setLengthIn] = useState(60);
  const [pattern, setPattern] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setPattern(null);
    try {
      const { data } = await api.post("/api/generate", {
        itemType, skill, widthIn, lengthIn
      });
      setPattern(data);
    } catch (e) {
      alert("Generation failed. Check console.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>AI Crochet Pattern Generator (MVP)</h1>
      <section style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
        <label>Item Type:
          <select value={itemType} onChange={e => setItemType(e.target.value)}>
            <option>scarf</option>
            <option>coaster</option>
            <option>beanie</option>
          </select>
        </label>
        <label>Skill:
          <select value={skill} onChange={e => setSkill(e.target.value)}>
            <option>beginner</option>
            <option>intermediate</option>
          </select>
        </label>
        <label>Width (in):
          <input type="number" value={widthIn} onChange={e => setWidthIn(+e.target.value)} />
        </label>
        <label>Length (in):
          <input type="number" value={lengthIn} onChange={e => setLengthIn(+e.target.value)} />
        </label>
        <button onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate Pattern"}
        </button>
      </section>

      {pattern && (
        <section style={{ marginTop: "1.5rem" }}>
          <h2>{pattern.title}</h2>
          <p><strong>Gauge:</strong> {pattern.gauge}</p>
          <h3>Materials</h3>
          <ul>{pattern.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
          <h3>Abbreviations</h3>
          <ul>{Object.entries(pattern.abbreviations).map(([k,v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}</ul>
          <h3>Instructions</h3>
          <ol>{pattern.instructions.map((r, i) => <li key={i}>{r}</li>)}</ol>
          {pattern.notes?.length ? (
            <>
              <h3>Notes</h3>
              <ul>{pattern.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
            </>
          ) : null}
        </section>
      )}
    </main>
  );
}
