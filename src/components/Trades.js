import React from 'react';
import { fmtVal, fmtTs } from '../utils';

export default function Trades({ trades, onDelete, summary }) {
  const data = trades.data || [];
  const buys  = data.filter(t => t.side === 'BUY');
  const sells = data.filter(t => t.side === 'SELL');
  const buyVol  = buys.reduce((s, t) => s + t.qty * t.price, 0);
  const sellVol = sells.reduce((s, t) => s + t.qty * t.price, 0);

  return (
    <div>
      <div className="page-title">Trade History</div>

      <div className="three-col" style={{ marginBottom: 18 }}>
        {[
          { label: 'Total Trades', val: data.length, sub: `${buys.length} buys · ${sells.length} sells`, c: '' },
          { label: 'Buy Volume',   val: fmtVal(buyVol),  sub: `${buys.length} transactions`,  c: 'c-green' },
          { label: 'Sell Volume',  val: fmtVal(sellVol), sub: `${sells.length} transactions`, c: 'c-red' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '15px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 7 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 22 }} className={s.c}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="glass tbl-outer">
        {data.length === 0
          ? <div className="empty-state"><div className="empty-icon">⇄</div>No trades recorded yet.</div>
          : (
            <div className="tbl-scroll">
              <table className="pnl-table">
                <thead>
                  <tr><th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th><th>Value</th><th>Time</th><th></th></tr>
                </thead>
                <tbody>
                  {data.map(t => (
                    <tr key={t.id}>
                      <td className="sym-cell">{t.symbol}</td>
                      <td><span className={`chip chip-${t.side.toLowerCase()}`}>{t.side}</span></td>
                      <td>{t.qty}</td>
                      <td>{fmtVal(t.price)}</td>
                      <td>{fmtVal(t.qty * t.price)}</td>
                      <td style={{ color: 'var(--t3)', fontSize: 10.5 }}>{fmtTs(t.timestamp)}</td>
                      <td><button className="del-btn" onClick={() => onDelete(t.id)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
