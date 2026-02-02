# 🚀 FinPulse: AI-Powered Financial Health Platform

> **Your 24/7 AI CFO. Instant financial analysis, health scoring, and strategic forecasting for SMEs.**

**FinPulse** is a modern financial dashboard that transforms raw financial data (CSV/Excel) into actionable insights. It combines real-time data visualization with generative AI (Google Gemini) to diagnose financial health, prescribe strategic recommendations, and simulate future growth scenarios.

---

## 🌟 Key Features

### 1. 📊 Instant Financial Diagnostics
- **Drag-and-Drop Upload:** Compatible with any standard P&L or Balance Sheet CSV.
- **Visual Dashboard:** Beautiful dark-mode UI with "Midnight Blue" aesthetics.
- **Interactive Charts:** Gradient Area Charts for revenue trends and detailed breakdown of expenses vs. profit.

### 2. 🧠 AI CFO Assessment
- **Health Score:** An automated 0-100 score based on liquidity, profitability, and growth margins.
- **Generative Insights:** Uses **Google Gemini AI** to write a plain-English summary of the company's status (e.g., "Critical: High Burn Rate detected").
- **Strategic Recommendations:** Collapsible, actionable steps to improve health (e.g., "Renegotiate vendor contracts to cut OpEx by 15%").

### 3. 🔮 Interactive Scenario Simulator
- **"What-If" Analysis:** Real-time simulation of changes (e.g., "What if I raise prices by 10% but Marketing costs go up 5%?").
- **Projected Impact:** Instantly visualizes the difference between *Actual* vs. *Projected* Net Profit.
- **AI Critique:** The "Ask AI CFO" button reviews your simulation and identifies risks in your strategy.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (Custom "Midnight" Theme)
- **UI Components:** Shadcn/UI (Cards, Buttons, sliders), Lucide React (Icons)
- **Charts:** Recharts (Responsive, Animated)

### Backend (Server)
- **API:** FastAPI (Python)
- **AI Engine:** Google Gemini Pro (`google-generativeai`)
- **Data Processing:** Pandas (High-performance CSV parsing)
- **Database:** Supabase (PostgreSQL) - *Optional for History features*

---

## 🚀 Getting Started

Follow these instructions to run FinPulse locally.

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Clone the Repository
```bash
git clone https://github.com/vinushcv/finpulse.git
cd finpulse
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Configuration:**
Create a `.env` file in the `backend/` directory:
```ini
GEMINI_API_KEY=your_google_gemini_key_here
DATABASE_URL=your_supabase_url_here
```

Start the Server:
```bash
uvicorn main:app --reload
```
*Server will run on `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*App will launch on `http://localhost:5173`*

---

## 🧪 How to Use (Demo Flow)

1.  **Launch the App.** You will see the empty state dashboard.
2.  **Upload Data:** distinct `test_financials.csv` files are provided in the root directory:
    - `test_financials_profitable.csv` (Healthy company)
    - `test_financials_struggling.csv` (Low score, needs help)
3.  **View Analysis:** Watch the charts animate and the "Financial Health Score" appear.
4.  **Check Recommendations:** Click the yellow "View Strategic Recommendations" dropdown.
5.  **Simulate Future:** Switch to the **Simulator Tab**. Use the sliders to adjust "Revenue Growth" or "OpEx". Click **"Ask AI CFO to Critique Plan"** to get feedback on your strategy.

---

## 📂 Project Structure
```
finpulse/
├── backend/
│   ├── main.py              # FastAPI Entry point
│   ├── services.py          # AI Logic & Financial Math
│   └── requirements.txt     # Python Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Dashboard, Simulator, UploadZone
│   │   └── index.css        # Tailwind Global Styles
│   └── tailwind.config.js   # Theme Configuration
├── start_app.bat            # Windows Quick-Start Script
└── README.md                # Documentation
```

---

## 🔮 Future Roadmap
- [ ] **History Tab:** View past analysis reports.
- [ ] **Multi-User Support:** Auth0/Clerk integration for teams.

---
