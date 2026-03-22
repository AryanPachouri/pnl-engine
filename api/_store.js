import { v4 as uuidv4 } from 'uuid';

// ─── Market Prices ─────────────────────────────────────────
export const marketPrices = {
  AAPL: 188.5, GOOGL: 178.2, MSFT: 420.3, TSLA: 195.9,
  AMZN: 201.4, NVDA: 910.6, META: 530.3, NFLX: 660.8,
  RELIANCE: 2920, TCS: 3980, INFY: 1530, HDFCBANK: 1710,
  WIPRO: 495, BAJFINANCE: 7150, ADANI: 2340, ICICIBANK: 1080,
  SBIN: 820, MARUTI: 11200,
};

// ─── Price History (30-day simulated) ──────────────────────
export const priceHistory = {};
(function buildHistory() {
  const now = Date.now();
  const day = 86400000;
  Object.entries(marketPrices).forEach(([sym, curPrice]) => {
    priceHistory[sym] = [];
    let p = curPrice * (0.88 + Math.random() * 0.08);
    for (let d = 29; d >= 0; d--) {
      p = p * (1 + (Math.random() - 0.48) * 0.025);
      priceHistory[sym].push({
        t: new Date(now - d * day).toISOString().split('T')[0],
        p: +p.toFixed(2),
      });
    }
    priceHistory[sym].push({ t: new Date().toISOString().split('T')[0], p: curPrice });
  });
})();

// ─── Seed Trades ───────────────────────────────────────────
export const trades = [];
(function seed() {
  const now = Date.now();
  const day = 86400000;
  const seeds = [
    { s: 'RELIANCE',   side: 'BUY',  qty: 25, price: 2710,  d: 45 },
    { s: 'TCS',        side: 'BUY',  qty: 12, price: 3750,  d: 40 },
    { s: 'INFY',       side: 'BUY',  qty: 30, price: 1420,  d: 38 },
    { s: 'HDFCBANK',   side: 'BUY',  qty: 20, price: 1600,  d: 35 },
    { s: 'WIPRO',      side: 'BUY',  qty: 50, price: 460,   d: 30 },
    { s: 'BAJFINANCE', side: 'BUY',  qty: 6,  price: 6800,  d: 28 },
    { s: 'ADANI',      side: 'BUY',  qty: 15, price: 2180,  d: 25 },
    { s: 'ICICIBANK',  side: 'BUY',  qty: 40, price: 1020,  d: 22 },
    { s: 'SBIN',       side: 'BUY',  qty: 80, price: 780,   d: 20 },
    { s: 'MARUTI',     side: 'BUY',  qty: 4,  price: 10800, d: 18 },
    { s: 'AAPL',       side: 'BUY',  qty: 20, price: 172,   d: 60 },
    { s: 'NVDA',       side: 'BUY',  qty: 5,  price: 780,   d: 55 },
    { s: 'MSFT',       side: 'BUY',  qty: 10, price: 390,   d: 50 },
    { s: 'GOOGL',      side: 'BUY',  qty: 15, price: 155,   d: 48 },
    { s: 'TSLA',       side: 'BUY',  qty: 12, price: 180,   d: 42 },
    { s: 'META',       side: 'BUY',  qty: 8,  price: 480,   d: 38 },
    { s: 'AMZN',       side: 'BUY',  qty: 18, price: 185,   d: 35 },
    { s: 'NFLX',       side: 'BUY',  qty: 6,  price: 610,   d: 30 },
    { s: 'AAPL',       side: 'SELL', qty: 8,  price: 192,   d: 20 },
    { s: 'TCS',        side: 'SELL', qty: 4,  price: 4050,  d: 18 },
    { s: 'TSLA',       side: 'SELL', qty: 5,  price: 168,   d: 15 },
    { s: 'WIPRO',      side: 'SELL', qty: 20, price: 488,   d: 12 },
    { s: 'GOOGL',      side: 'SELL', qty: 5,  price: 182,   d: 10 },
    { s: 'META',       side: 'BUY',  qty: 4,  price: 510,   d: 8  },
    { s: 'NVDA',       side: 'BUY',  qty: 3,  price: 870,   d: 7  },
    { s: 'RELIANCE',   side: 'SELL', qty: 5,  price: 2870,  d: 5  },
    { s: 'NFLX',       side: 'BUY',  qty: 2,  price: 645,   d: 3  },
    { s: 'INFY',       side: 'SELL', qty: 10, price: 1505,  d: 2  },
  ];
  seeds.forEach(sd => {
    trades.push({
      id: uuidv4(),
      symbol: sd.s,
      side:   sd.side,
      qty:    sd.qty,
      price:  sd.price,
      timestamp: new Date(now - sd.d * day - Math.random() * 3600000).toISOString(),
    });
  });
})();

// ─── PnL Engine ────────────────────────────────────────────
export function computePositions() {
  const pos = {};
  for (const t of trades) {
    const { symbol, side, qty, price } = t;
    if (!pos[symbol]) pos[symbol] = { qty: 0, avgCost: 0, realizedPnL: 0, totalCost: 0 };
    const p = pos[symbol];
    if (side === 'BUY') {
      p.totalCost += qty * price;
      p.qty += qty;
      p.avgCost = p.qty > 0 ? p.totalCost / p.qty : 0;
    } else {
      const sq = Math.min(qty, p.qty);
      if (sq > 0) {
        p.realizedPnL += sq * (price - p.avgCost);
        p.totalCost   -= sq * p.avgCost;
        p.qty         -= sq;
        p.avgCost = p.qty > 0 ? p.totalCost / p.qty : 0;
      }
    }
  }
  return Object.entries(pos).map(([symbol, p]) => {
    const mp    = marketPrices[symbol] || p.avgCost;
    const unreal = p.qty > 0 ? p.qty * (mp - p.avgCost) : 0;
    return {
      symbol,
      qty:           p.qty,
      avgCost:       +p.avgCost.toFixed(2),
      currentPrice:  mp,
      marketValue:   +(p.qty * mp).toFixed(2),
      realizedPnL:   +p.realizedPnL.toFixed(2),
      unrealizedPnL: +unreal.toFixed(2),
      totalPnL:      +(p.realizedPnL + unreal).toFixed(2),
    };
  });
}

// ─── CORS helper ───────────────────────────────────────────
export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export { uuidv4 };
