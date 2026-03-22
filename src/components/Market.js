import React, { useState } from 'react';
import { fmtVal } from '../utils';
import './Market.css';

export default function Market({ prices, history, onUpdatePrice }) {
  const [editing, setEditing] = useState({});
  const [vals, setVals]       = useState({});

  const startEdit = (sym) => {
    setEditing(e => ({ ...e, [sym]: true }));
    setVals(v => ({ ...v, [sym]: prices[sym] }));
  };

  const save = (sym) => {
    const v = parseFloat(vals[sym]);
    if (v && v > 0) onUpdatePrice(sym, v);
    setEditing(e => ({ ...e, [sym]: false }));
  };

  return (
    <div>
      <div className="page-title">Market Prices</div>
      <div className="pgrid">
        {Object.entries(prices).map(([sym, price]) => {
          const hist = history[sym];
          const prev = hist && hist.length > 1 ? hist[hist.length - 2].p : price;
          const chg  = ((price - prev) / prev * 100).toFixed(2);
          const pos  = parseFloat(chg) >= 0;

          return (
            <div key={sym} className="glass pcard">
              <div className="psym">{sym}</div>
              {editing[sym] ? (
                <div className="pedit-row">
                  <input
                    className="pinp"
                    type="number"
                    value={vals[sym]}
                    autoFocus
                    onChange={e => setVals(v => ({ ...v, [sym]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && save(sym)}
                  />
                  <button className="psave" onClick={() => save(sym)}>✓</button>
                </div>
              ) : (
                <div className="pval" onClick={() => startEdit(sym)}>
                  {fmtVal(price)}<span className="pedit-ico">✎</span>
                </div>
              )}
              <div className={`pchg ${pos ? 'positive' : 'negative'}`}>{pos ? '+' : ''}{chg}%</div>
              <div className="plbl">Click to update</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
