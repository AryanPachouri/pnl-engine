import { marketPrices, setCors } from './_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') return res.json(marketPrices);

  res.status(405).json({ error: 'Method not allowed' });
}
