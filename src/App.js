import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import Header from './components/Header';
import TickerStrip from './components/TickerStrip';
import Notification from './components/Notification';
import TradeModal from './components/TradeModal';
import Dashboard from './components/Dashboard';
import Positions from './components/Positions';
import Trades from './components/Trades';
import Charts from './components/Charts';
import Market from './components/Market';
import './App.css';

const TABS = ['Dashboard', 'Positions', 'Trades', 'Charts', 'Market'];

export default function App() {
  const [tab, setTab]           = useState('Dashboard');
  const [summary, setSummary]   = useState(null);
  const [positions, setPositions] = useState({ positions: [], summary: {} });
  const [trades, setTrades]     = useState({ total: 0, data: [] });
  const [prices, setPrices]     = useState({});
  const [history, setHistory]   = useState({});
  const [volume, setVolume]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notif, setNotif]       = useState(null);

  const notify = (msg, type = 'success') => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3200);
  };

  const refresh = useCallback(async () => {
    try {
      const [s, p, t, pr, h, v] = await Promise.all([
        api.getSummary(),
        api.getPositions(),
        api.getTrades({ limit: 200 }),
        api.getPrices(),
        api.getPriceHistory(),
        api.getVolume(),
      ]);
      setSummary(s);
      setPositions(p);
      setTrades(t);
      setPrices(pr);
      setHistory(h);
      setVolume(v);
    } catch (e) {
      notify('Cannot connect to backend — is it running on :4000?', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 15000);
    return () => clearInterval(iv);
  }, [refresh]);

  const handleAddTrade = async (trade) => {
    const result = await api.addTrade(trade);
    if (result.error) { notify(result.error, 'error'); return; }
    notify(`${result.side} ${result.qty} ${result.symbol} @ ₹${result.price}`);
    setShowForm(false);
    refresh();
  };

  const handleDeleteTrade = async (id) => {
    await api.deleteTrade(id);
    notify('Trade removed');
    refresh();
  };

  const handleUpdatePrice = async (symbol, price) => {
    await api.updatePrice(symbol, price);
    notify(`${symbol} updated to ₹${price}`);
    refresh();
  };

  const props = { summary, positions, trades, prices, history, volume, onDelete: handleDeleteTrade, onUpdatePrice: handleUpdatePrice };

  return (
    <div className="app">
      <Header tab={tab} tabs={TABS} onTab={setTab} onNew={() => setShowForm(true)} />
      <TickerStrip prices={prices} history={history} />
      {notif && <Notification msg={notif.msg} type={notif.type} />}
      {showForm && (
        <TradeModal prices={prices} onSubmit={handleAddTrade} onClose={() => setShowForm(false)} />
      )}
      <main className="main">
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Connecting to engine…</p>
          </div>
        ) : (
          <div className="fade-in">
            {tab === 'Dashboard'  && <Dashboard {...props} />}
            {tab === 'Positions'  && <Positions {...props} />}
            {tab === 'Trades'     && <Trades    {...props} />}
            {tab === 'Charts'     && <Charts    {...props} />}
            {tab === 'Market'     && <Market    {...props} />}
          </div>
        )}
      </main>
    </div>
  );
}
