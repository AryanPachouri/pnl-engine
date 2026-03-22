import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const GRID = 'rgba(255,255,255,0.06)';
const TICK = 'rgba(255,255,255,0.35)';

export default function PnlBarChart({ positions }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const data = positions.filter(p => Math.abs(p.totalPnL) > 0)
      .sort((a, b) => b.totalPnL - a.totalPnL);
    if (!data.length) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }

    inst.current = new Chart(ref.current, {
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
    });
    return () => { if (inst.current) inst.current.destroy(); };
  }, [positions]);

  return (
    <>
      <div className="chart-wrap" style={{ height: 220 }}><canvas ref={ref} /></div>
      <div className="chart-legend">
        <span className="legend-item"><span className="legend-dot" style={{ background: 'rgba(0,245,160,.7)' }} />Unrealized</span>
        <span className="legend-item"><span className="legend-dot" style={{ background: 'rgba(126,184,255,.7)' }} />Realized</span>
      </div>
    </>
  );
}
