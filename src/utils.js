export const fmtPnL = (v) => {
  if (v === undefined || v === null) return '—';
  const abs = Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  return v >= 0 ? `+₹${abs}` : `-₹${abs}`;
};

export const fmtVal = (v) =>
  `₹${(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export const fmtPct = (v) =>
  v >= 0 ? `+${v.toFixed(2)}%` : `${v.toFixed(2)}%`;

export const pnlClass = (v) => (v >= 0 ? 'positive' : 'negative');

export const fmtTs = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

export const CHART_COLORS = [
  '#7eb8ff','#00f5a0','#ff6b8a','#ffd97d','#c084fc','#fb923c',
  '#34d399','#f472b6','#60a5fa','#a78bfa','#4ade80','#f87171',
  '#38bdf8','#e879f9','#facc15','#2dd4bf','#818cf8','#fb7185'
];
