// API base — empty string = relative, works on Vercel and local (via CRA proxy)
const BASE = '';

const req = (url, opts = {}) =>
  fetch(`${BASE}${url}`, { headers: { 'Content-Type': 'application/json' }, ...opts }).then(r => r.json());

export const api = {
  getTrades:       (p = {}) => req(`/api/trades?${new URLSearchParams(p)}`),
  addTrade:        (t)      => req('/api/trades', { method: 'POST', body: JSON.stringify(t) }),
  deleteTrade:     (id)     => req(`/api/trades/${id}`, { method: 'DELETE' }),
  getPositions:    ()       => req('/api/positions'),
  getPrices:       ()       => req('/api/prices'),
  getPriceHistory: ()       => req('/api/prices/history'),
  updatePrice:     (sym, price) => req(`/api/prices/${sym}`, { method: 'PUT', body: JSON.stringify({ price }) }),
  getSummary:      ()       => req('/api/summary'),
  getVolume:       ()       => req('/api/analytics/volume'),
};
