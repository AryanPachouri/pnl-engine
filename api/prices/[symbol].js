import { marketPrices, priceHistory, setCors } from '../_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol } = req.query;

  // GET /api/prices/history
  if (req.method === 'GET' && symbol === 'history') {
    return res.json(priceHistory);
  }

  // PUT /api/prices/:symbol
  if (req.method === 'PUT') {
    const { price } = req.body;
    if (!price || +price <= 0) return res.status(400).json({ error: 'Valid price required' });
    const sym = symbol.toUpperCase();
    marketPrices[sym] = +price;
    return res.json({ symbol: sym, price: +price });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
