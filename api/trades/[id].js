import { trades, setCors } from '../_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const idx = trades.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Trade not found' });
    trades.splice(idx, 1);
    return res.json({ message: 'Trade deleted' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
