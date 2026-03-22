import { computePositions, setCors } from './_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const positions = computePositions();
    const { symbol } = req.query;
    if (symbol) {
      const pos = positions.find(p => p.symbol === symbol.toUpperCase());
      return res.json(pos || { error: 'No position found' });
    }
    const open = positions.filter(p => p.qty > 0);
    return res.json({
      positions,
      summary: {
        totalPositions:     open.length,
        totalMarketValue:   +open.reduce((s, p) => s + p.marketValue,    0).toFixed(2),
        totalRealizedPnL:   +positions.reduce((s, p) => s + p.realizedPnL,  0).toFixed(2),
        totalUnrealizedPnL: +open.reduce((s, p) => s + p.unrealizedPnL,  0).toFixed(2),
        totalPnL:           +positions.reduce((s, p) => s + p.totalPnL,     0).toFixed(2),
      },
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
