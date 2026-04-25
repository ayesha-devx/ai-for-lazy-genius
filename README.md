<div align="center">
  <img src="frontend/public/favicon.ico" alt="Logo" width="80" height="80">
  <h1 align="center">AI for Lazy Genius</h1>
  <p align="center">
    <b>The Premium MERN Platform for Technical Thought Leaders</b>
    <br />
    A state-of-the-art, AI-augmented blogging ecosystem designed for high-level technical knowledge sharing and automated content creation.
    <br />
    <br />
    <a href="#key-features">Key Features</a>
    ·
    <a href="#built-with">Tech Stack</a>
    ·
    <a href="#getting-started">Setup</a>
  </p>
</div>

---

## 💎 About The Project

**AI for Lazy Genius** is a full-stack technical blogging platform that bridges the gap between deep engineering and effortless consumption. Built with a **Premium Purple Glassmorphic** design language, it provides an ultra-modern, high-performance experience for developers, AI engineers, and cloud architects.

The platform is designed to automate the friction of blogging: from AI-powered draft generation and voice-enabled reading to a curated technical cover art system.

### 🎭 The Expert Personas
The platform is pre-seeded with specialized engineering personas to foster a high-level community:
- **Ayesha Topiwala**: Senior AI/ML Engineer (Focus: Transformers, Vector DBs, LLMs)
- **Tanisha**: Senior Frontend Architect (Focus: Micro-Frontends, WebAssembly, Performance)
- **Arjun**: Senior Cloud Architect (Focus: Kubernetes, Golang, DevOps)

---

## ✨ Key Features

### 🧠 The Brain Bank (AI Summarization)
Instantly distill complex technical articles into simple, actionable insights using **Google Gemini AI**. Save these "Lazy Summaries" to your personal Brain Bank for long-term knowledge retention.

### 🎙️ Voice Intelligence
Listen to any technical article on the go. Integrated with a native voice reader, the platform allows you to consume deep-dives while multi-tasking without losing the technical context.

### ✍️ AI Writer Studio
Draft professional, structured technical blogs in seconds. Input your Topic, Tone, and Level, and our Gemini-powered engine will handle the heavy lifting, generating high-quality Markdown content.

### 🥇 Smart Cover Picker
Say goodbye to generic stock photos. The platform includes a **Premium Curated Library** of 21 high-end technical visuals (AI, Servers, Robots, Code). Use the "Choose For Me" engine to instantly match your title with a stunning masterpiece.

### 🔮 SaaS-Grade Visual Identity
Built for those who appreciate design excellence:
- **Glassmorphic Headers**: Ultra-soft `backdrop-blur` interfaces.
- **Dynamic Micro-animations**: Powered by Framer Motion for a fluid, alive feel.
- **Unified Identity**: One-user-one-icon deterministic avatar system based on name hashing.

---

## 🛠️ Built With

### Frontend
* **React 18** (Vite-powered for instant HMR)
* **Tailwind CSS** (Custom Slate-to-Purple theme)
* **Framer Motion** (Fluid UI transitions)
* **Lucide Icons** (Clean, consistent iconography)

### Backend
* **Node.js & Express** (Scalable REST API)
* **MongoDB Atlas** (Cloud-native data persistence)
* **Google Generative AI SDK** (Deep Gemini integration)
* **JWT & Bcrypt** (Secure, stateless authentication)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Cluster
- [Google Gemini API Key](https://aistudio.google.com/)
- [Cloudinary Account](https://cloudinary.com/) (for gallery uploads)

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/ai-lazy-genius.git
   cd ai-lazy-genius
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI, JWT_SECRET, GEMINI_API_KEY, CLOUDINARY_URL
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📂 Architecture

```text
ai-lazy-genius/
├── frontend/
│   ├── src/
│   │   ├── components/  # Atomic UI elements (Glassmorphic cards, AI Studios)
│   │   ├── pages/       # Home, Feed, Write, Notes, Dashboard, Profile
│   │   ├── assets/      # Premium local covers (21 technical images)
│   │   └── hooks/       # useBlogHooks, useAuthStore (Zustand)
├── backend/
│   ├── controllers/    # Blog, User, Notification, and AI logic
│   ├── models/         # Mongoose Schemas (User, Blog, Comment)
│   └── routes/         # REST Endpoint definitions
```

---

<p align="center">
  <i>Built with ❤️ by <b>Ayesha Topiwala</b></i>
</p>
