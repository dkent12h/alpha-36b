# Alpha 3.6B - Real-time Investment Command Center

This is a React.js + Tailwind CSS web application designed as a real-time investment dashboard for PC and Mobile.

## Features
- **Real-time Data Engine**: Simulates live market data updates (MA20, RSI14 calculated dynamically).
- **Responsive Design**: Sidebar for Desktop, Bottom Navigation for Mobile.
- **6 Core Tabs**: Indices, Leverage, Semicon Core, Sectors, Portfolio (KR), Portfolio (US).
- **Technical Indicators**: MA20 Breach Warnings, RSI14 Overbought/Oversold Signals.
- **Portfolio Management**:
  - LocalStorage persistence for US Portfolio.
  - Value tracking in KRW (with simulated Exchange Rate).
  - Liquidity Usage Status Bar (Target: 360M KRW).

## Project Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Deployment (Vercel)

1.  Push this repository to GitHub.
2.  Import the project into Vercel.
3.  Vercel will automatically detect Vite and set the build command (`npm run build`) and output directory (`dist`).
4.  Deploy!

## Configuration

- **Tickers**: Modify `src/constants.js` to change tracked assets.
- **Data Source**: Currently uses a simulated `MockEngine` in `src/hooks/useMarketData.js`. To use real data, integrate a backend proxy for Yahoo Finance or Finnhub API.

## Deployment

- **Live Site**: [https://alpha-36b-dashboard.netlify.app/](https://alpha-36b-dashboard.netlify.app/)

