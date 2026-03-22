import { trades, computePositions, setCors } from './_store.js';

export default function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const positions = computePositions();
    const open  = positions.filter(p => p.qty > 0);
    const buys  = trades.filter(t => t.side === 'BUY');
    const sells = trades.filter(t => t.side === 'SELL');
    return res.json({
      openPositions:     open.length,
      closedPositions:   positions.filter(p => p.qty === 0 && p.realizedPnL !== 0).length,
      totalTrades:       trades.length,
      totalBuys:         buys.length,
      totalSells:        sells.length,
      totalMarketValue:  +open.reduce((s, p) => s + p.marketValue,    0).toFixed(2),
      totalRealizedPnL:  +positions.reduce((s, p) => s + p.realizedPnL,  0).toFixed(2),
      totalUnrealizedPnL:+open.reduce((s, p) => s + p.unrealizedPnL,  0).toFixed(2),
      buyVolume:         +buys.reduce((s, t) => s + t.qty * t.price,   0).toFixed(2),
      sellVolume:        +sells.reduce((s, t) => s + t.qty * t.price,  0).toFixed(2),
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
