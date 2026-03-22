import React from 'react';
import './Header.css';

export default function Header({ tab, tabs, onTab, onNew }) {
  const [time, setTime] = React.useState('');
  React.useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <header className="app-header">
      <div className="logo">
        <span className="logo-mark">◈</span>
        <span className="logo-name">PnL<span>Engine</span></span>
        <span className="live-badge">● LIVE</span>
      </div>
      <nav className="nav">
        {tabs.map(t => (
          <button key={t} className={`nav-tab ${tab === t ? 'active' : ''}`} onClick={() => onTab(t)}>{t}</button>
        ))}
      </nav>
      <div className="hdr-right">
        <span className="clock">{time}</span>
        <button className="new-trade-btn" onClick={onNew}><span className="plus-icon">+</span> New Trade</button>
      </div>
    </header>
  );
}
