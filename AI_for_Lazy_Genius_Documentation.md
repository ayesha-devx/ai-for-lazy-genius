# AI FOR LAZY GENIUS - PROJECT DOCUMENTATION

## PROJECT OVERVIEW
**"AI for Lazy Genius"** is a premium, modern, full-stack web application designed for creating, consuming, and distilling AI knowledge. It features a unique "SaaS-grade" visual identity characterized by purple-themed glassmorphism, highly rounded interfaces, and smooth micro-animations. The platform's core hook is its AI integration, allowing readers to instantly summarize complex technical articles into simple bullet points, and authors to auto-generate content and imagery.

---

## CORE TECH STACK

### FRONTEND:
- **Framework:** React.js (built with Vite)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Markdown Rendering:** React-Markdown with remark-gfm
- **Routing:** React Router DOM

### BACKEND:
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Authentication:** JWT (JSON Web Tokens) via HttpOnly Cookies
- **File Uploads:** Multer

### EXTERNAL APIS & SERVICES:
- **Google Gemini AI:** Powers the "Explain Like I'm Lazy" summaries and the "AI Writer" tool.
- **Cloudinary:** Used for hosting uploaded user images and blog covers.
- **LoremFlickr / Picsum:** Powers the API-free "Smart Cover Picker" for instant image fetching.

---

## PAGES, FEATURES & CAPABILITIES

### 1. THE HOME PAGE ( / )
- **Features:** Premium hero section with glowing text gradients and floating UI elements.
- **Functionality:** Displays featured/latest posts, dynamic category filters, and an infinite-scroll aesthetic.
- **Design:** High use of backdrop-blur headers and animated purple mesh backgrounds.

### 2. THE FEED / EXPLORE LIBRARY ( /feed & /blogs )
- **Features:** The primary discovery engine for the platform.
- **Functionality:** Includes a sophisticated glassmorphic search bar and clickable category pill filters.
- **UI:** Blog cards feature aspect-ratio locked thumbnails, dynamic read-time calculations, and engagement counters (likes/comments). Hovering over cards scales them up with a soft shadow drop.

### 3. THE READING EXPERIENCE ( /blog/:id )
- **Features:** A highly polished, distraction-free reading environment.
- **Functionality:**
  - **Dynamic Table of Contents:** Automatically generates links based on markdown headings.
  - **Social Engagement:** Users can like the post and leave comments via a real-time sliding comment drawer.
  - **Code Formatting:** Advanced markdown rendering that highlights code blocks beautifully.
- **"Explain Like I'm Lazy":** A floating, sticky AI button that triggers Gemini AI. It reads the current blog content and generates a simplified summary. Users can then 1-click save this summary to their personal Brain Bank.

### 4. THE BRAIN BANK / NOTES ( /notes )
- **Features:** A personal repository for AI-distilled knowledge.
- **Functionality:** Displays all the "Explain Like I'm Lazy" summaries the user has saved.
- **UI:** Uses an asymmetrical masonry-style layout. Notes are rendered in markdown with highlighted purple quote borders. Users can copy the note text or delete it. Includes an animated header.

### 5. THE AUTHOR STUDIO / WRITE ( /write )
- **Features:** The content creation hub.
- **Functionality:**
  - **Markdown Editor:** Write content using markdown syntax with an instant "Preview" toggle.
  - **🥇 Smart Cover Picker:** Instead of relying on expensive APIs, it extracts keywords from the user's title and instantly fetches a high-quality, relevant cover photograph from LoremFlickr/Unsplash.
  - **✨ AI Writer:** A drop-down panel where authors can input a Topic, Tone (e.g., "Lazy Genius"), and Level. It calls Gemini AI to write a complete, structured blog post in seconds.
  - **Floating Action Bar:** A sticky, frosted glass bottom bar allowing users to Save as Draft or Publish Post.

### 6. THE DASHBOARD ( /dashboard )
- **Features:** The user's control center.
- **Functionality:**
  - **Analytics Grid:** Automatically calculates and displays live stats: Total Published Posts, Drafts, Total Likes received, and Total Comments received.
  - **Content Management:** View all drafted and published posts in separate tabs. Includes buttons to jump back into the Editor to modify or delete old posts.

---

## UI / UX DESIGN SYSTEM
- **Primary Theme:** "Premium Purple Glassmorphism"
- **Color Palette:** 
  - **Backgrounds:** Dark Slate (`#111827`) for Dark Mode, Crisp White/Off-white for Light Mode.
  - **Text:** Slate-900 (Headings), Slate-500 (Body text).
  - **Accents:** Vibrant gradients from Purple-600 to Fuchsia-500.
- **Shapes:** Extremely soft UI with border radii of `32px` to `40px` on all major containers and images.
- **Interactions:** Snappy `hover:-translate-y-1` lifts on buttons, active scale-down states (`active:scale-95`), and animated gradient text clips.
