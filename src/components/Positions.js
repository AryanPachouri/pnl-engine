import React from 'react';
import { fmtVal, fmtPnL, fmtPct, pnlClass } from '../utils';

export default function Positions({ positions }) {
  const ps = positions.positions || [];

  return (
    <div>
      <div className="page-title">Positions & PnL</div>
      <div className="glass tbl-outer">
        {ps.length === 0
          ? <div className="empty-state"><div className="empty-icon">📊</div>No positions yet. Add a trade to get started.</div>
          : (
            <div className="tbl-scroll">
              <table className="pnl-table">
                <thead>
                  <tr>
                    <th>Symbol</th><th>Qty</th><th>Avg Cost</th><th>LTP</th>
                    <th>Mkt Value</th><th>Unrealized</th><th>Realized</th><th>Total PnL</th><th>Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {ps.map((p, i) => {
                    const pct = p.avgCost > 0 ? ((p.currentPrice - p.avgCost) / p.avgCost) * 100 : 0;
                    const barW = Math.min(Math.abs(p.totalPnL) / Math.max(p.marketValue || 1, 1) * 500, 100);
                    return (
                      <tr key={i}>
                        <td className="sym-cell">{p.symbol}</td>
                        <td style={{ color: p.qty === 0 ? 'var(--t3)' : 'var(--t1)' }}>{p.qty}</td>
                        <td>{fmtVal(p.avgCost)}</td>
                        <td>
                          {fmtVal(p.currentPrice)}
                          <span style={{ fontSize: 9.5, marginLeft: 5 }} className={pnlClass(pct)}>{fmtPct(pct)}</span>
                        </td>
                        <td>{fmtVal(p.marketValue)}</td>
                        <td className={pnlClass(p.unrealizedPnL)}>{fmtPnL(p.unrealizedPnL)}</td>
                        <td className={pnlClass(p.realizedPnL)}>{fmtPnL(p.realizedPnL)}</td>
                        <td className={pnlClass(p.totalPnL)} style={{ fontWeight: 700 }}>{fmtPnL(p.totalPnL)}</td>
                        <td style={{ minWidth: 80 }}>
                          <div className="pnl-bar">
                            <div className="bar-track">
                              <div className="bar-fill" style={{ width: `${barW}%`, background: p.totalPnL >= 0 ? 'var(--green)' : 'var(--red)' }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
