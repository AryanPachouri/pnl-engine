import { trades, marketPrices, setCors, uuidv4 } from './_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { symbol, side, limit = '100', offset = '0' } = req.query;
    let result = [...trades].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (symbol) result = result.filter(t => t.symbol === symbol.toUpperCase());
    if (side)   result = result.filter(t => t.side   === side.toUpperCase());
    return res.json({ total: result.length, data: result.slice(+offset, +offset + +limit) });
  }

  if (req.method === 'POST') {
    const { symbol, side, qty, price } = req.body;
    if (!symbol || !side || !qty || !price)
      return res.status(400).json({ error: 'symbol, side, qty, price are required' });
    if (!['BUY', 'SELL'].includes(side.toUpperCase()))
      return res.status(400).json({ error: 'side must be BUY or SELL' });
    if (+qty <= 0 || +price <= 0)
      return res.status(400).json({ error: 'qty and price must be positive' });
    const trade = {
      id: uuidv4(), symbol: symbol.toUpperCase(), side: side.toUpperCase(),
      qty: +qty, price: +price, timestamp: new Date().toISOString(),
    };
    marketPrices[trade.symbol] = trade.price;
    trades.push(trade);
    return res.status(201).json(trade);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
