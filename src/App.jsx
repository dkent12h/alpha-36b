import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import LeveragePage from './pages/LeveragePage';
import ActionGuidePage from './pages/ActionGuidePage';
import { MARKETS } from './constants';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ActionGuidePage />} />
          <Route path="/indices" element={<DashboardPage tickers={MARKETS.INDICES} title="Market Indices (Global Macro)" />} />
          <Route path="/leverage" element={<LeveragePage />} />
          <Route path="/blue-chip" element={<DashboardPage tickers={MARKETS.BLUE_CHIP} title="Blue Chip (Stable)" />} />
          <Route path="/growth" element={<DashboardPage tickers={MARKETS.GROWTH} title="Growth (Aggressive)" />} />
          <Route path="/korea" element={<DashboardPage tickers={MARKETS.KOREA} title="Domestic Market (Korea)" />} />
          <Route path="/sectors" element={<DashboardPage tickers={MARKETS.SECTORS} title="Domestic Sectors" />} />
          <Route path="/isa" element={<DashboardPage tickers={MARKETS.ISA} title="ISA" />} />
          <Route path="/pension" element={<DashboardPage tickers={MARKETS.PENSION} title="Pension (연금저축)" />} />



          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
