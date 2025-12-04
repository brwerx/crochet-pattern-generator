# 🧶 AI-Powered Crochet Pattern Generator

Automatically generate fully structured crochet patterns using AI.

Built by **Mikaella Brewer** for **CS 406 – Capstone Project (Oregon State University)**.

---

## ✨ Overview

The **AI-Powered Crochet Pattern Generator** lets users create custom crochet patterns by specifying:

- Project type (e.g., scarf, coaster, beanie)  
- Skill level (beginner / intermediate)  
- Target width and length (in inches)

The backend sends this information to the OpenAI API, which returns a **structured JSON pattern** including:

- Title  
- Gauge  
- Materials list  
- Abbreviations  
- Step-by-step instructions  
- Notes  

The frontend then displays that pattern in a clean, readable, and printable format.

---

## 🎯 Features

- 🧵 **Custom Pattern Generation**  
  - Item type: scarf, coaster, beanie (more can be added later)  
  - Skill level: beginner, intermediate  
  - Width and length controls  

- 📋 **Structured Output**  
  - US crochet terms  
  - Clear materials & abbreviations section  
  - Ordered, row-by-row instructions  
  - Optional notes for customization

- 💾 **Export & Print**  
  - Download pattern as `.json`  
  - Print / Save as PDF directly from the browser

- 🧱 **Simple, Extensible Architecture**  
  - Thin HTML/CSS/JS frontend  
  - Node.js + Express backend  
  - OpenAI Chat Completions (JSON mode)

---

## 🧱 Tech Stack

**Frontend**

- HTML  
- CSS (custom, responsive card layout)  
- Vanilla JavaScript (DOM manipulation, fetch API)

**Backend**

- Node.js  
- Express.js  
- `dotenv` for environment variables  
- `cors` for cross-origin requests  
- `openai` Node SDK (Chat Completions API)

**Other**

- Git & GitHub for version control  
- Local development with `nodemon`  

---

## 🏗️ Architecture

```text
[ Browser UI (HTML/CSS/JS) ]
          |
          |  POST /api/generate
          v
[ Express Backend (Node.js) ]
          |
          |  Chat completion request
          v
[ OpenAI API (gpt-4o-mini, JSON mode) ]
          |
          |  JSON pattern
          v
[ Express Backend ]
          |
          v
[ Browser renders pattern ]
