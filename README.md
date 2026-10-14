<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=4CAF50&height=200&section=header&text=FreshPlate&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Cook%20Smart.%20Waste%20Less.&descAlignY=55&descSize=20" width="100%" />

![Status](https://img.shields.io/badge/Status-Live%20%26%20Functional-4CAF50?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-2ECC71?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-FFB74D?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-4CAF50?style=for-the-badge)

### 🥬 **Track Your Fridge. Cook Smart. Waste Less.**

An AI-powered smart kitchen assistant that helps you track fridge inventory, reduce food waste, and discover recipes using ingredients you already have.

[**🚀 Live Demo**](#-quick-start) • [**✨ Features**](#-features) • [**📸 Screenshots**](#-screenshots) • [**🛠️ Tech Stack**](#️-tech-stack)

</div>

---

## 🌟 About the Project

**FreshPlate** is a fully functional, AI-inspired smart kitchen assistant that helps households reduce food waste by:

- 📸 **Scanning your fridge** with one photo to build a live inventory
- ⏰ **Alerting you** before food expires
- 🍳 **Suggesting recipes** ranked by what's about to go bad
- 💰 **Tracking savings** — both money and CO₂ emissions

Built as a **single-page React application** with **localStorage persistence**, FreshPlate requires **no backend, no database, and no signup**. It works offline, remembers everything, and is ready to test immediately.

---

## 🎯 The Problem

| 🌍 **Global Food Waste** | 💸 **Household Impact** | 😔 **User Frustration** |
|:---:|:---:|:---:|
| **1.05 billion tonnes** wasted annually | **$2,913** wasted per household yearly | "I forgot I had this and it went bad." |
| **60%** comes from households | **1/3** of all food produced is wasted | "My fridge is full but there's nothing to eat." |
| **8–10%** of global GHG emissions | **79 kg** wasted per person, every year | "I buy groceries with good intentions..." |

**The Root Cause:** Food waste at home isn't intentional — it's forgetfulness. You forget what's in your fridge, don't know when things expire, and don't know what to cook. Existing apps fail due to **manual entry fatigue** and **notification fatigue**.

---

## 💡 The Solution


- **One photo** builds your entire inventory (no manual typing)
- **Smart alerts** warn you 2–3 days before food expires
- **AI recipes** ranked by urgency — cook what's about to go bad
- **Auto-deduction** removes ingredients when you cook
- **Impact dashboard** shows money + CO₂ saved

---

## ✨ Features

### 🏠 Home Dashboard
Personalized greeting, "Expiring Soon" carousel with color-coded badges, "What Can I Cook Tonight?" recipe matches, and live impact card.

### 📸 AI Fridge Scanning
Animated camera scanning interface that auto-detects multiple items. Edit results, then add all to inventory in one tap.

### 📦 Smart Inventory
Category tabs (Fridge, Freezer, Pantry, Spices), status filters (🔴 Use Today, 🟡 Use Soon, 🟢 Fresh), live search, color-coded expiry badges, and full CRUD.

### 🍳 AI Recipe Recommendations
25+ built-in recipes ranked by expiring ingredients. Pinterest-style grid, filter chips, "🎲 Surprise Me" button, and live search.

### 👨‍🍳 Hands-Free Cooking Mode
Full-screen dark mode, step-by-step guidance, built-in timers, voice toggle, and auto-deduction of ingredients on completion.

### 📊 Impact Dashboard
Track money saved, food saved, CO₂ avoided, and water saved. Waste-free streak tracker, weekly bar chart, and shareable summary.

### 🛒 Smart Shopping List
Auto-generated based on inventory gaps. Categorized list, check-off items, duplicate warnings, and "Order Online" CTA.

### 👨‍👩‍👧 Family Sharing
Member avatars, shared inventory summary, activity feed with timestamps, and notification preference toggles.

### 👤 Profile & Settings
Personal stats, dietary preferences, notification controls, account settings, and "Reset Demo Data" button.

### 🎉 Bonus Features
Toast notifications, confetti celebrations, smooth transitions, empty states, WCAG AA contrast, and 44pt touch targets.

---

## 📸 Screenshots

<div align="center">

| Home Dashboard | AI Scanning | Smart Inventory |
|:---:|:---:|:---:|
| <img src="screenshots/home.png" width="250" /> | <img src="screenshots/scan.png" width="250" /> | <img src="screenshots/inventory.png" width="250" /> |

| Recipe Recommendations | Cooking Mode | Impact Dashboard |
|:---:|:---:|:---:|
| <img src="screenshots/recipes.png" width="250" /> | <img src="screenshots/cooking.png" width="250" /> | <img src="screenshots/impact.png" width="250" /> |

| Shopping List | Family Sharing | Profile |
|:---:|:---:|:---:|
| <img src="screenshots/shopping.png" width="250" /> | <img src="screenshots/family.png" width="250" /> | <img src="screenshots/profile.png" width="250" /> |

</div>

---

## 🛠️ Tech Stack

| **Category** | **Technology** | **Purpose** |
|:---:|:---:|:---:|
| Framework | React 18+ | UI Components & State |
| Styling | Tailwind CSS | Utility-first CSS |
| Language | JavaScript (ES6+) | Application Logic |
| Persistence | localStorage | Data Storage |
| Icons | Lucide React / SVG | UI Icons |
| Voice | Web Speech API | Hands-Free Cooking |

**Why This Stack?**
- ⚡ Zero backend — works entirely client-side
- 💾 localStorage — data persists across sessions
- 📱 Mobile-first — 390px baseline, scales to desktop
- 🌐 Offline-capable — no internet required after load

---

## ⚡ Quick Start

🎨 Design System
Color Palette
Color	Hex	Usage
🟢 Primary Green	#4CAF50	Brand, CTAs, freshness
🟡 Warm Cream	#FFF8E7	Backgrounds, warmth
🔴 Urgent Coral	#FF6B6B	Expiry alerts
🟠 Warning Amber	#FFB74D	Use-soon warnings
🟢 Success Mint	#A8E6CF	Fresh items, success
⚫ Text Dark	#2C3E50	Headings
⚪ Text Gray	#7F8C8D	Body text
⚪ Background	#FAFAFA	App background

Design Principles
Zero-Friction Capture — Photo scanning > manual entry

Proactive, Not Pushy — Gentle reminders, not spam

Urgency-Ranked Suggestions — Expiring items first

Shared Household Awareness — Sync across family

Tangible Impact — Money + CO₂ visualization

daysRemaining = expiryDate - today

🔴 Red badge    → ≤ 0 days (expired/use today)
🟡 Amber badge  → 1–3 days (use soon)
🟢 Green badge  → 4+ days (fresh)

**daysRemaining = expiryDate - today

🔴 Red badge    → ≤ 0 days (expired/use today)
🟡 Amber badge  → 1–3 days (use soon)
🟢 Green badge  → 4+ days (fresh)**


**💰 Money Saved:      $87
🥬 Food Saved:       4.2 kg
🌱 CO₂ Avoided:      12 kg
💧 Water Saved:      480 L
🔥 Current Streak:   14 days

🌳 Equivalent to:    Planting 1 tree
🚗 Or:               Not driving 48 km


🧪 Testing the App
Open the app → Onboarding screen appears

Tap "Get Started" → Home Dashboard (pre-seeded with demo data)

Tap 📦 Inventory → See items with color-coded expiry badges

Tap the camera icon → Try AI scanning simulation

Tap 🍳 Recipes → See recipes ranked by expiring ingredients

Tap any recipe → View details, tap "Start Cooking"

Complete cooking mode → Inventory auto-deducts, impact updates

Refresh the page → All data persists ✅

🗺️ Roadmap
✅ v1.0.0 — Current Release
☑ 10 fully functional screens
☑ AI fridge scanning (simulated)
☑ 25+ built-in recipes
☑ Smart expiry tracking
☑ Hands-free cooking mode
☑ Impact dashboard
☑ localStorage persistence
☑ Fully responsive design
🚧 v1.1.0 — Coming Soon
□ Real ML-based food recognition (TensorFlow.js)
□ Barcode scanning with product database
□ Progressive Web App (PWA) with offline install
□ Push notifications for expiry alerts
□ Dark mode
□ Multi-language support
🔮 v2.0.0 — Future Vision
□ Real backend (Supabase / Firebase)
□ Multi-device family sync
□ Auto-generated weekly meal plans
□ Sustainability reports (PDF export)
□ Grocery delivery integration (Instacart, Amazon Fresh)

👨‍🎨 Designer & Developer
<div align="center">
Anees Kumar Ghosh
UI/UX Designer

https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white

Designed and developed FreshPlate end-to-end — from UX research and wireframes to a fully functional React application.

💬 "Design isn't just about making things beautiful — it's about making things useful."

</div>

🙏 Acknowledgments
🌍 UNEP Food Waste Index Report 2024 — for the data that inspired this project

🎨 Tailwind CSS — for making beautiful UI fast

⚛️ React Team — for an incredible framework

🥬 Everyone fighting food waste — you're the real heroes

☕ Coffee — the fuel behind every late-night coding session

⭐ If you found this project helpful, please give it a star!
<img src="https://capsule-render.vercel.app/api?type=waving&color=4CAF50&height=120&section=footer&text=Thank%20You!&fontSize=40&fontColor=ffffff&animation=fadeIn" width="100%" />
