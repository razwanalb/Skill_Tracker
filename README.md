<div align="center">

# ✨ Skill Tracker

### A Professional Routine & Skill Management OS for Developers

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Skill Tracker** is a beautifully crafted, full-stack web application designed for developers and lifelong learners who want to meticulously track daily skills, optimize routines, and visualize growth over time — all synced in real-time across devices.

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📸 Screenshots

<div align="center">

| Login | Dashboard |
|:---:|:---:|
| ![Login Page](https://via.placeholder.com/500x300/3f51b5/FFFFFF?text=Login+Page) | ![Dashboard](https://via.placeholder.com/500x300/1a237e/FFFFFF?text=Dashboard) |

| Routine Matrix | Analytics |
|:---:|:---:|
| ![Routine](https://via.placeholder.com/500x300/283593/FFFFFF?text=Routine+Matrix) | ![Analytics](https://via.placeholder.com/500x300/0d47a1/FFFFFF?text=Analytics+Report) |

> 💡 *Replace these placeholders with actual screenshots of your deployed app for maximum impact.*

</div>

---

## 🚀 Features

### 🔐 Authentication & Security
- **Multi-provider Sign-in** — Google, GitHub, and Email/Password
- **Secure Registration** with password reset via email
- **Protected Routes** — all app data is behind authentication
- **Firebase Security Rules** — server-side data protection

### 📊 Dashboard
- **Real-time Stats** — Today's progress, weekly streak, total hours studied
- **Weekly Activity Chart** — Interactive area chart showing 7-day trends (Recharts)
- **Rotating Inspirational Quotes** — Auto-cycling motivational quotes with smooth animations

### 📋 Daily Checkmark Matrix
- **Multi-Skill Tracking** — Define custom skill columns (e.g., App Dev, Academic, CP, Math)
- **Time Block System** — Configurable daily time slots with hour allocations
- **3-State Status** — Toggle between ✅ Completed, ⏳ Pending, and ❌ Missed
- **Date Navigation** — Browse and review any past or future day
- **GitHub-Style Heatmap** — Full-year contribution heatmap visualization

### 📈 Analytics & Reporting
- **Skill Proficiency Bars** — Visual progress bars per skill with color-coded performance
- **Completion Rate Charts** — Horizontal bar charts comparing all skills
- **PDF Report Export** — Professional, branded PDF reports with:
  - Custom logo header
  - Quick insight summary cards
  - Visual progress bars
  - Detailed data tables
  - Branded footer with developer credit
- **Social Sharing** — Share achievements via Web Share API

### ⚙️ Settings
- **Routine Structure** — Add, rename, or remove skill columns dynamically
- **Default Schedule** — Configure time slots applied to new days
- **Timezone Support** — Full IANA timezone selector, auto-detected on signup
- **Inspirational Quotes** — Add/remove custom quotes displayed on the dashboard

### 👤 Profile Management
- **Editable Profile** — Full name, username, gender, phone, location, website, social links
- **AI Avatar System** — Choose from locally stored AI-generated avatars
  - 14 standard avatars (7 male, 7 female)
  - 10 exclusive premium avatars (owner account only)
- **Verified Badge** — Facebook-style verification badge for the owner account
- **Data Persistence** — All profile data synced to Firebase Firestore in real-time

### 🎨 Design & UX
- **Dark / Light Mode** — Fully themed with persistent preference
- **Responsive Design** — Desktop sidebar + mobile bottom navigation
- **Smooth Animations** — Framer Motion (motion/react) powered transitions
- **Premium Aesthetics** — Gradient banners, glassmorphism, micro-interactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | React 19 + TypeScript 5.8 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | Zustand 5 (persisted) |
| **Routing** | React Router DOM 7 |
| **Backend** | Firebase (Auth + Firestore) |
| **Charts** | Recharts 3 |
| **Animations** | Motion (Framer Motion) 12 |
| **PDF Generation** | jsPDF + jsPDF-AutoTable |
| **Icons** | Lucide React |
| **Date Utilities** | date-fns + date-fns-tz |

---

## 📂 Project Structure

```
skill-tracker/
├── public/
│   └── avatars/              # Locally stored AI avatar SVGs (24 files)
├── src/
│   ├── components/
│   │   ├── ActivityHeatmap.tsx    # GitHub-style yearly heatmap
│   │   ├── ErrorBoundary.tsx      # Global error boundary
│   │   ├── FirebaseProvider.tsx   # Auth context & Firestore sync
│   │   ├── Layout.tsx             # Sidebar + bottom nav shell
│   │   └── Logo.tsx               # Brand logo component
│   ├── images/
│   │   └── my_logo.png           # App logo
│   ├── lib/
│   │   ├── dateUtils.ts          # Timezone-aware date formatting
│   │   ├── firebase.ts           # Firebase config & error handling
│   │   └── utils.ts              # General utility functions
│   ├── pages/
│   │   ├── About.tsx             # About page (public)
│   │   ├── Analytics.tsx         # Skill analytics & PDF export
│   │   ├── Dashboard.tsx         # Main dashboard with stats
│   │   ├── Download.tsx          # Download page (placeholder)
│   │   ├── Login.tsx             # Multi-provider authentication
│   │   ├── Privacy.tsx           # Privacy policy (public)
│   │   ├── Profile.tsx           # Profile settings & avatar
│   │   ├── Register.tsx          # Account registration
│   │   ├── Routine.tsx           # Daily checkmark matrix
│   │   ├── Settings.tsx          # Routine & quote configuration
│   │   └── Terms.tsx             # Terms of service (public)
│   ├── store/
│   │   └── useStore.ts           # Zustand global store + Firebase sync
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── App.tsx                   # Route definitions & auth guards
│   ├── index.css                 # Global styles & theme variables
│   └── main.tsx                  # React entry point
├── firebase-applet-config.json   # Firebase project configuration
├── firestore.rules               # Firestore security rules
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite build configuration
```

---

## ⚡ Getting Started

### 🏁 Quick Start

```bash
git clone https://github.com/razwanalb/Skill_Tracker.git
cd Skill_Tracker
npm install        # ⬅️ REQUIRED — installs all dependencies first
npm run dev        # Starts the app at http://localhost:3000
```

> ⚠️ **You MUST run `npm install` before `npm run dev`.** The `node_modules/` folder is not included in the repository and must be downloaded locally.

---

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- A **Firebase** project with Authentication and Firestore enabled

### 1. Clone the Repository

```bash
git clone https://github.com/razwanalb/Skill_Tracker.git
cd Skill_Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create your own `firebase-applet-config.json` in the project root with your Firebase credentials:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "messagingSenderId": "YOUR_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "firestoreDatabaseId": "(default)"
}
```

### 4. Enable Authentication Providers

In the [Firebase Console](https://console.firebase.google.com):
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**, **Google**, and **GitHub** providers
3. Add your development domain (e.g., `localhost`) to **Authorized domains**

### 5. Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

Or manually copy the contents of `firestore.rules` to your Firebase Console under **Firestore** → **Rules**.

### 6. Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`.

### 7. Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables

| Variable | Description |
|:---|:---|
| `GEMINI_API_KEY` | API key for Google Gemini AI (optional, for AI features) |
| `APP_URL` | Deployed application URL (used for OAuth callbacks) |

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

---

## 📝 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run clean` | Remove the `dist/` directory |
| `npm run lint` | Run TypeScript type checking |

---

## 🗄️ Database Schema

### Firestore Collections

```
users/{userId}
├── uid: string
├── name: string
├── email: string
├── profilePicture: string
├── username: string
├── phone: string
├── gender: string
├── location: string
├── website: string
├── socialLink: string
├── theme: "light" | "dark"
├── timezone: string
├── baseTimezone: string
├── columns: RoutineColumn[]
├── templateTasks: RoutineTask[]
├── quotes: Quote[]
└── dailyRecords/{date}      ← subcollection
    ├── date: string (YYYY-MM-DD)
    └── tasks: RoutineTask[]
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please make sure to:
- Follow the existing code style
- Add appropriate TypeScript types
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**SR Ahammad** (Razwan Ahammad)

- 📧 Email: [razwan.self@gmail.com](mailto:razwan.self@gmail.com)
- 🐙 GitHub: [@sr-ahammad](https://github.com/sr-ahammad)

---

<div align="center">

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ and countless cups of ☕

</div>
