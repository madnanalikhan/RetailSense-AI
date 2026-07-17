# RetailSense AI

A modern React application for demand forecasting and inventory intelligence management.

## 🚀 Features

- **Dashboard** - Overview of key performance indicators and real-time alerts
- **Demand Forecasting** - AI-powered demand predictions with accuracy metrics
- **Inventory Status** - Real-time inventory tracking and stock coverage analysis
- **AI Simulator** - Interactive demand simulation with multiple factor adjustments
- **AI Recommendations** - Intelligent purchase order recommendations and reorder point analysis
- **Real-time Alerts** - Critical stock alerts and actionable insights

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AlertItem.tsx
│   ├── Clock.tsx
│   ├── KPICard.tsx
│   ├── Login.tsx
│   ├── Navigation.tsx
│   ├── ProgressBar.tsx
│   ├── StatusPill.tsx
│   └── Toast.tsx
├── context/            # Global state management
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── data/              # Mock data
│   └── mockData.ts
├── pages/             # Page components
│   ├── Dashboard.tsx
│   ├── Forecast.tsx
│   ├── Inventory.tsx
│   ├── Recommend.tsx
│   └── Simulate.tsx
├── utils/             # Utility functions
│   └── helpers.ts
├── App.tsx            # Main App component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Vite** - Build tool

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🔐 Authentication

The app uses a simple demo login system:
- Any valid email address
- Password with minimum 4 characters
- Three role options: Inventory Manager, Supply Chain Director, Store Manager

## 📊 Pages Overview

### Dashboard
Real-time overview with:
- KPI metrics (Low Stock, Overstocked, Optimal, Fill Rate)
- Sales trend vs target charts
- 8-week demand forecast
- Stock vs demand comparison
- Active alerts

### Forecast
Demand forecasting with:
- SKU-specific forecasts
- Model accuracy metrics (MAPE)
- Per-SKU demand predictions
- Trend and risk analysis

### Inventory
Inventory management with:
- Real-time stock status
- Search and filter capabilities
- Stock coverage analysis
- Coverage heatmap visualization

### Simulate
AI demand simulator with:
- Product selection and base units
- Promotion and seasonal adjustments
- External factor controls (weather, trends, holidays)
- CSV data import
- Simulation results and recommendations

### AI Recommendations
Intelligent recommendations with:
- Urgent reorders
- Overstock actions
- Purchase order action plan
- Stock vs reorder point analysis

## 🎨 UI Components

- **KPICard** - Key performance indicator cards
- **AlertItem** - Alert notifications
- **StatusPill** - Status badges
- **ProgressBar** - Progress visualization
- **Clock** - Real-time clock display
- **Toast** - Notification toasts

## 📝 Mock Data

The application includes mock data for 8 SKUs with:
- Stock levels
- Weekly demand
- Product categories
- Status (Low Stock, Overstocked, Optimal)
- Historical sales data
- Forecast data

## 🔄 Context & State Management

- **AuthContext** - User authentication and role management
- **ToastContext** - Toast notification system

## 📈 Data Visualization

Charts powered by Chart.js:
- Bar charts (Sales, Inventory)
- Line charts (Forecasts)
- Combo charts (Stock vs Reorder Point)
- Heatmaps (Coverage analysis)

## 🚦 Development Workflow

1. Component-based architecture
2. Centralized state management with Context API
3. TypeScript for type safety
4. Responsive design
5. Accessibility considerations

## 📄 License

This project is part of the IWU AI Integration Capstone program.
