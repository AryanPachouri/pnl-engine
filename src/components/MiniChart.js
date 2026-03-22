import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

const GRID = 'rgba(255,255,255,0.06)';
const TICK = 'rgba(255,255,255,0.35)';

export default function MiniChart({ positions, history, colors }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    const top4 = [...positions].sort((a, b) => b.marketValue - a.marketValue).slice(0, 4);
    if (!top4.length || !Object.keys(history).length) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }

    const labels = (history[top4[0]?.symbol] || []).map(h => h.t);

    inst.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels,
        datasets: top4.map((p, i) => ({
          label: p.symbol,
          data: (history[p.symbol] || []).map(h => h.p),
          borderColor: colors[i],
          backgroundColor: colors[i] + '18',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: false
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
    });
    return () => { if (inst.current) inst.current.destroy(); };
  }, [positions, history, colors]);

  const top4 = [...positions].sort((a, b) => b.marketValue - a.marketValue).slice(0, 4);

  return (
    <>
      <div className="chart-wrap" style={{ height: 240 }}><canvas ref={ref} /></div>
      <div className="chart-legend">
        {top4.map((p, i) => (
          <span key={p.symbol} className="legend-item">
            <span className="legend-dot" style={{ background: colors[i] }} />{p.symbol}
          </span>
        ))}
      </div>
    </>
  );
}
