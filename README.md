# 🛍️ ShopMind AI — Smart Shopping Assistant

> An AI-powered conversational shopping assistant that helps users discover products, filter by price, and get instant recommendations — just by chatting.

---

## 🚀 Overview

ShopMind AI transforms a traditional product catalog into an **interactive AI shopping experience**.

Instead of browsing endlessly, users can simply type:

* *"show me clothing items"*
* *"products under 1000"*
* *"jeans"*
* *"I want to buy something"*

…and get instant, relevant results.

---

## ✨ Key Features

* 🤖 **Chat-based Product Discovery**
  Interact with your store like a conversation

* 🔍 **Smart Keyword Search**
  Find products instantly (e.g. *jeans, kurti*)

* 💰 **Dynamic Price Filtering**
  Example: *"under 1000"*

* 🛒 **Buy Intent Detection**
  Recognizes when users are ready to purchase

* 🎯 **AI Highlighted Recommendations**
  Displays relevant products in real-time

* ⚡ **Fast & Minimal UI**
  Clean, responsive, and user-friendly

---

## 🧠 How It Works

1. User sends a message in chat
2. Backend fetches products from Supabase
3. Applies intelligent logic:

   * Keyword matching
   * Price filtering
   * Intent detection
4. Returns:

   * Natural language response
   * Highlighted product cards

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🎨 Custom CSS

### Backend

* 🟢 Node.js (Express)

### Database

* 🟣 Supabase

---

## 📂 Project Structure

```bash
shopmind-v2/
│
├── frontend/
│   ├── src/
│   │   ├── pages/Preview.jsx
│   │   ├── lib/api.js
│   │   └── styles/
│
├── backend/
│   ├── routes/chat.js
│   ├── lib/supabase.js
│   └── server.js
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/shopmind-ai.git
cd shopmind-ai
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 🧪 Example Queries

Try these in chat:

```text
show me clothing items
products under 1000
jeans
I want to buy something
```

---

## 🎥 Demo

👉 Add your demo video link here (Google Drive / YouTube)

---

## 🚀 Future Enhancements

* 🤖 LLM-powered recommendations (OpenAI / Groq)
* 🖼️ Product images & UI cards
* 🛍️ Checkout & cart integration
* 🌐 Deployment (Vercel + Railway)
* 📊 Advanced analytics dashboard

---

## 👩‍💻 Author

**Gulshanpreet Kaur**
AI/ML Engineer

---

## ⭐ Show Your Support

If you found this project useful:

⭐ Star the repo
🍴 Fork it
📢 Share it

---

## 💡 Why This Project Matters

This is not just a chatbot —
it's a **step toward AI-native e-commerce experiences**.

---
