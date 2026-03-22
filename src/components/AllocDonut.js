import React, { useEffect, useRef } from 'react';
import { Chart, ArcElement, DoughnutController, Tooltip, Legend } from 'chart.js';
import { fmtVal } from '../utils';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

export default function AllocDonut({ positions, colors }) {
  const ref = useRef(null);
  const inst = useRef(null);

  useEffect(() => {
    if (!positions || positions.length === 0) return;
    if (inst.current) { inst.current.destroy(); inst.current = null; }
    const totalVal = positions.reduce((s, p) => s + p.marketValue, 0);
    inst.current = new Chart(ref.current, {
      type: 'doughnut',
      data: {
        labels: positions.map(p => p.symbol),
        datasets: [{
          data: positions.map(p => Math.round(p.marketValue)),
          backgroundColor: positions.map((_, i) => colors[i % colors.length]),
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: 'rgba(255,255,255,.3)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => `${c.label}: ${fmtVal(c.raw)}` } }
        }
      }
    });
    return () => { if (inst.current) inst.current.destroy(); };
  }, [positions, colors]);

  if (!positions || positions.length === 0) return null;

  const totalVal = positions.reduce((s, p) => s + p.marketValue, 0);

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
        <canvas ref={ref} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, overflow: 'auto', maxHeight: 200 }}>
        {positions.map((p, i) => {
          const pct = totalVal > 0 ? ((p.marketValue / totalVal) * 100).toFixed(1) : 0;
          return (
            <div key={p.symbol} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length], flexShrink: 0 }} />
              <span style={{ color: 'var(--t2)', flex: 1, fontFamily: 'var(--mono)' }}>{p.symbol}</span>
              <span style={{ color: 'var(--t1)', fontFamily: 'var(--mono)' }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
