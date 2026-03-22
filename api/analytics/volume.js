import { trades, setCors } from '../_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const byDay = {};
    trades.forEach(t => {
      const d = t.timestamp.split('T')[0];
      if (!byDay[d]) byDay[d] = { BUY: 0, SELL: 0 };
      byDay[d][t.side] += t.qty * t.price;
    });
    const sorted = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b));
    return res.json(sorted.map(([date, v]) => ({
      date,
      buy:  +v.BUY.toFixed(2),
      sell: +v.SELL.toFixed(2),
    })));
  }

  res.status(405).json({ error: 'Method not allowed' });
}
