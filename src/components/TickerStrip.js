import React from 'react';
import { fmtVal } from '../utils';
import './TickerStrip.css';

export default function TickerStrip({ prices, history }) {
  const items = Object.entries(prices).map(([sym, price]) => {
    const hist = history[sym];
    const prev = hist && hist.length > 1 ? hist[hist.length - 2].p : price;
    const chg = ((price - prev) / prev * 100).toFixed(2);
    const pos = parseFloat(chg) >= 0;
    return { sym, price, chg, pos };
  });

  if (!items.length) return null;

  const strip = [...items, ...items]; // duplicate for seamless loop

  return (
    <div className="ticker-bar">
      <div className="ticker-inner">
        {strip.map((it, i) => (
          <span key={i} className="tick-item">
            <span className="tick-sym">{it.sym}</span>
            <span className="tick-price">{fmtVal(it.price)}</span>
            <span className={`tick-chg ${it.pos ? 'pos' : 'neg'}`}>{it.pos ? '+' : ''}{it.chg}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}
