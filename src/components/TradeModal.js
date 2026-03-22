import React, { useState } from 'react';
import { fmtVal } from '../utils';

const SYMBOLS = [
  'AAPL','GOOGL','MSFT','TSLA','AMZN','NVDA','META','NFLX',
  'RELIANCE','TCS','INFY','HDFCBANK','WIPRO','BAJFINANCE',
  'ADANI','ICICIBANK','SBIN','MARUTI'
];

export default function TradeModal({ prices, onSubmit, onClose }) {
  const [form, setForm] = useState({ symbol: 'AAPL', side: 'BUY', qty: '', price: prices['AAPL'] || '' });
  const [error, setError] = useState('');

  const set = (k, v) => {
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === 'symbol' && prices[v]) next.price = prices[v];
      return next;
    });
    setError('');
  };

  const handleSubmit = () => {
    if (!form.qty || !form.price) { setError('All fields are required'); return; }
    if (+form.qty <= 0 || +form.price <= 0) { setError('Qty and price must be positive'); return; }
    onSubmit({ ...form, qty: +form.qty, price: +form.price });
  };

  const total = form.qty && form.price
    ? (+form.qty * +form.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })
    : '—';
  const mp = prices[form.symbol];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal glass">
        <div className="modal-header">
          <h2>New Trade</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Symbol</label>
              <select className="form-input" value={form.symbol} onChange={e => set('symbol', e.target.value)}>
                {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Side</label>
              <div className="side-toggle">
                <button className={`side-btn buy ${form.side === 'BUY' ? 'active' : ''}`} onClick={() => set('side', 'BUY')}>BUY</button>
                <button className={`side-btn sell ${form.side === 'SELL' ? 'active' : ''}`} onClick={() => set('side', 'SELL')}>SELL</button>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" min="1" placeholder="0"
                value={form.qty} onChange={e => set('qty', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">
                Price
                {mp && <span className="ltp-hint" onClick={() => set('price', mp)}>LTP {fmtVal(mp)}</span>}
              </label>
              <input className="form-input" type="number" min="0.01" step="0.01" placeholder="0.00"
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
          </div>
          <div className="trade-summary gs">
            <span>Total Value</span>
            <span style={{ fontFamily: 'var(--mono)', color: form.side === 'BUY' ? 'var(--green)' : 'var(--red)' }}>
              {form.side === 'BUY' ? '−' : '+'}₹{total}
            </span>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className={`btn-submit ${form.side === 'BUY' ? 'buy' : 'sell'}`} onClick={handleSubmit}>
              {form.side === 'BUY' ? '▲' : '▼'} Place {form.side}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
