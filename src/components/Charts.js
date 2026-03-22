import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Filler } from 'chart.js';
import { CHART_COLORS } from '../utils';

Chart.register(LineController, LineElement, PointElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Filler);

const GRID = 'rgba(255,255,255,0.06)';
const TICK = 'rgba(255,255,255,0.35)';

function useChart(ref, buildConfig, deps) {
  const inst = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }
    const cfg = buildConfig();
    if (cfg) inst.current = new Chart(ref.current, cfg);
    return () => { if (inst.current) inst.current.destroy(); };
    // eslint-disable-next-line
  }, deps);
}

export default function Charts({ positions, history, volume }) {
  const histRef = useRef(null);
  const volRef  = useRef(null);
  const cumRef  = useRef(null);
  const pnlRef  = useRef(null);

  const allPos   = positions.positions || [];
  const openPos  = allPos.filter(p => p.qty > 0);
  const top4     = [...openPos].sort((a, b) => b.marketValue - a.marketValue).slice(0, 4);

  // Price history
  useChart(histRef, () => {
    if (!top4.length || !Object.keys(history).length) return null;
    const labels = (history[top4[0]?.symbol] || []).map(h => h.t);
    return {
      type: 'line',
      data: {
        labels,
        datasets: top4.map((p, i) => ({
          label: p.symbol,
          data: (history[p.symbol] || []).map(h => h.p),
          borderColor: CHART_COLORS[i],
          backgroundColor: CHART_COLORS[i] + '18',
          borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ₹${c.raw?.toLocaleString('en-IN')}` } } },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, autoSkip: true, maxTicksLimit: 10 } },
          y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    };
  }, [top4.map(p => p.symbol).join(), JSON.stringify(history)]);

  // Buy vs Sell volume
  useChart(volRef, () => {
    if (!volume || !volume.length) return null;
    const last14 = volume.slice(-14);
    return {
      type: 'bar',
      data: {
        labels: last14.map(d => d.date),
        datasets: [
          { label: 'Buy', data: last14.map(d => Math.round(d.buy)), backgroundColor: 'rgba(0,245,160,0.65)', borderRadius: 4 },
          { label: 'Sell', data: last14.map(d => Math.round(d.sell)), backgroundColor: 'rgba(255,107,138,0.65)', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ₹${c.raw?.toLocaleString('en-IN')}` } } },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, autoSkip: false, maxRotation: 45 } },
          y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    };
  }, [JSON.stringify(volume)]);

  // Cumulative invested
  useChart(cumRef, () => {
    if (!volume || !volume.length) return null;
    let cum = 0;
    const cumData = volume.map(d => { cum += d.buy - d.sell; return { x: d.date, y: Math.round(cum) }; });
    return {
      type: 'line',
      data: {
        labels: cumData.map(d => d.x),
        datasets: [{
          label: 'Net Invested',
          data: cumData.map(d => d.y),
          borderColor: '#c084fc',
          backgroundColor: 'rgba(192,132,252,0.12)',
          borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#c084fc',
          tension: 0.3, fill: true
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `Net: ₹${c.raw?.toLocaleString('en-IN')}` } } },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, autoSkip: true, maxTicksLimit: 8 } },
          y: { grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    };
  }, [JSON.stringify(volume)]);

  // PnL stacked
  useChart(pnlRef, () => {
    const data = allPos.filter(p => Math.abs(p.totalPnL) > 0).sort((a, b) => b.totalPnL - a.totalPnL);
    if (!data.length) return null;
    return {
      type: 'bar',
      data: {
        labels: data.map(p => p.symbol),
        datasets: [
          { label: 'Unrealized', data: data.map(p => Math.round(p.unrealizedPnL)), backgroundColor: 'rgba(0,245,160,0.7)', borderRadius: 4, stack: 's' },
          { label: 'Realized',   data: data.map(p => Math.round(p.realizedPnL)),   backgroundColor: 'rgba(126,184,255,0.7)', borderRadius: 4, stack: 's' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ₹${c.raw?.toLocaleString('en-IN')}` } } },
        scales: {
          x: { stacked: true, grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, autoSkip: false, maxRotation: 45 } },
          y: { stacked: true, grid: { color: GRID }, ticks: { color: TICK, font: { size: 10 }, callback: v => (v >= 0 ? '+₹' : '-₹') + Math.abs(v).toLocaleString('en-IN') } }
        }
      }
    };
  }, [JSON.stringify(allPos)]);

  return (
    <div>
      <div className="page-title">Analytics & Charts</div>

      <div className="two-col" style={{ marginBottom: 18 }}>
        <div className="glass chart-box">
          <div className="chart-title">Price History — Top 4 Holdings (30d)</div>
          <div className="chart-wrap" style={{ height: 260 }}><canvas ref={histRef} /></div>
          <div className="chart-legend">
            {top4.map((p, i) => (
              <span key={p.symbol} className="legend-item">
                <span className="legend-dot" style={{ background: CHART_COLORS[i] }} />{p.symbol}
              </span>
            ))}
          </div>
        </div>
        <div className="glass chart-box">
          <div className="chart-title">Buy vs Sell Volume (Daily)</div>
          <div className="chart-wrap" style={{ height: 260 }}><canvas ref={volRef} /></div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: 'rgba(0,245,160,.65)' }} />Buy</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: 'rgba(255,107,138,.65)' }} />Sell</span>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="glass chart-box">
          <div className="chart-title">Cumulative Net Capital Deployed</div>
          <div className="chart-wrap" style={{ height: 240 }}><canvas ref={cumRef} /></div>
        </div>
        <div className="glass chart-box">
          <div className="chart-title">PnL by Symbol (Stacked)</div>
          <div className="chart-wrap" style={{ height: 240 }}><canvas ref={pnlRef} /></div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot" style={{ background: 'rgba(0,245,160,.7)' }} />Unrealized</span>
            <span className="legend-item"><span className="legend-dot" style={{ background: 'rgba(126,184,255,.7)' }} />Realized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
