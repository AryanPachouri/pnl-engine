import React from 'react';
import { fmtVal, fmtPnL, fmtPct, pnlClass, CHART_COLORS } from '../utils';
import MiniChart from './MiniChart';
import PnlBarChart from './PnlBarChart';
import AllocDonut from './AllocDonut';

export default function Dashboard({ summary, positions, trades, history }) {
  if (!summary) return null;
  const totalPnL = (summary.totalRealizedPnL || 0) + (summary.totalUnrealizedPnL || 0);

  const cards = [
    { label: 'Portfolio Value', value: fmtVal(summary.totalMarketValue), sub: `${summary.openPositions} open positions`, c: 'c-blue', bc: 'bdr-blue', gc: 'glow-blue', ico: '◈' },
    { label: 'Total PnL',       value: fmtPnL(totalPnL),                  sub: 'Realized + Unrealized',  c: totalPnL >= 0 ? 'c-green' : 'c-red', bc: totalPnL >= 0 ? 'bdr-green' : 'bdr-red', gc: totalPnL >= 0 ? 'glow-green' : 'glow-red', ico: totalPnL >= 0 ? '▲' : '▼' },
    { label: 'Realized PnL',    value: fmtPnL(summary.totalRealizedPnL),  sub: 'Closed positions',       c: summary.totalRealizedPnL >= 0 ? 'c-green' : 'c-red', bc: summary.totalRealizedPnL >= 0 ? 'bdr-green' : 'bdr-red', gc: summary.totalRealizedPnL >= 0 ? 'glow-green' : 'glow-red', ico: '◉' },
    { label: 'Unrealized PnL',  value: fmtPnL(summary.totalUnrealizedPnL),sub: 'Open positions MTM',     c: summary.totalUnrealizedPnL >= 0 ? 'c-green' : 'c-red', bc: summary.totalUnrealizedPnL >= 0 ? 'bdr-green' : 'bdr-red', gc: summary.totalUnrealizedPnL >= 0 ? 'glow-green' : 'glow-red', ico: '◎' },
    { label: 'Total Trades',    value: summary.totalTrades || 0,           sub: `${summary.totalBuys} buys · ${summary.totalSells} sells`, c: '', bc: '', gc: 'glow-w', ico: '⇄' },
  ];

  const open = (positions.positions || []).filter(p => p.qty > 0);
  const recentTrades = (trades.data || []).slice(0, 8);

  return (
    <div>
      {/* Summary Cards */}
      <div className="cards-grid">
        {cards.map((c, i) => (
          <div key={i} className={`summary-card glass ${c.bc} fade-in`} style={{ animationDelay: `${i * 55}ms` }}>
            <div className="card-top">
              <span className="card-label">{c.label}</span>
              <span className={`card-icon ${c.c}`}>{c.ico}</span>
            </div>
            <div className={`card-value ${c.c}`}>{c.value}</div>
            <div className="card-sub">{c.sub}</div>
            <div className={`card-glow ${c.gc}`} />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="two-col" style={{ marginBottom: 18 }}>
        <div className="glass chart-box">
          <div className="chart-title">Portfolio Allocation</div>
          <AllocDonut positions={open} colors={CHART_COLORS} />
        </div>
        <div className="glass chart-box">
          <div className="chart-title">PnL by Symbol</div>
          <PnlBarChart positions={positions.positions || []} />
        </div>
      </div>

      {/* Price History */}
      <div className="glass chart-box" style={{ marginBottom: 18 }}>
        <div className="chart-title">Price History — Top 4 Holdings (30 days)</div>
        <MiniChart positions={open} history={history} colors={CHART_COLORS} />
      </div>

      {/* Tables */}
      <div className="two-col">
        <div>
          <div className="section-title">Open Positions</div>
          <div className="glass tbl-outer">
            {open.length === 0 ? <EmptyState ico="📊" msg="No open positions yet" /> : (
              <div className="tbl-scroll">
                <table className="pnl-table">
                  <thead><tr><th>Symbol</th><th>Qty</th><th>Avg Cost</th><th>LTP</th><th>Unrealized</th></tr></thead>
                  <tbody>
                    {open.map((p, i) => {
                      const pct = p.avgCost > 0 ? ((p.currentPrice - p.avgCost) / p.avgCost) * 100 : 0;
                      return (
                        <tr key={i}>
                          <td className="sym-cell">{p.symbol}</td>
                          <td>{p.qty}</td>
                          <td>{fmtVal(p.avgCost)}</td>
                          <td>{fmtVal(p.currentPrice)} <span style={{ fontSize: 9.5 }} className={pnlClass(pct)}>{fmtPct(pct)}</span></td>
                          <td className={pnlClass(p.unrealizedPnL)}>{fmtPnL(p.unrealizedPnL)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="section-title">Recent Trades</div>
          <div className="glass tbl-outer">
            {recentTrades.length === 0 ? <EmptyState ico="⇄" msg="No trades yet" /> : (
              <div className="tbl-scroll">
                <table className="pnl-table">
                  <thead><tr><th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th></tr></thead>
                  <tbody>
                    {recentTrades.map(t => (
                      <tr key={t.id}>
                        <td className="sym-cell">{t.symbol}</td>
                        <td><span className={`chip chip-${t.side.toLowerCase()}`}>{t.side}</span></td>
                        <td>{t.qty}</td>
                        <td>{fmtVal(t.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ ico, msg }) {
  return <div className="empty-state"><div className="empty-icon">{ico}</div>{msg}</div>;
}
