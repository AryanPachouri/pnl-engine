# PnL Engine — Vercel Deployment

A full-stack stock portfolio tracker with FIFO PnL calculation, 4 analytics charts, and a liquid-glass dark UI. Built for **zero-config Vercel deployment**.

---

## 🚀 Deploy to Vercel (1 click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/pnl-engine)

**Or via CLI:**

```bash
npm i -g vercel
vercel
```

Vercel auto-detects the config from `vercel.json` — no manual settings needed.

---

## 🏗️ Project Structure

```
pnl-engine/
├── api/                        # Vercel Serverless Functions (backend)
│   ├── _store.js               # Shared in-memory state + PnL engine
│   ├── trades.js               # GET /api/trades  POST /api/trades
│   ├── trades/[id].js          # DELETE /api/trades/:id
│   ├── positions.js            # GET /api/positions
│   ├── prices.js               # GET /api/prices
│   ├── prices/[symbol].js      # PUT /api/prices/:symbol  GET /api/prices/history
│   ├── summary.js              # GET /api/summary
│   └── analytics/
│       └── volume.js           # GET /api/analytics/volume
├── src/                        # React 18 frontend
│   ├── App.js
│   ├── api.js                  # Relative-path API calls (works local + Vercel)
│   ├── utils.js
│   └── components/             # 12 React components
├── public/
│   └── index.html
├── package.json                # Single package.json (frontend deps + proxy)
├── vercel.json                 # Build config + rewrites + CORS headers
└── .gitignore
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vercel dev server (runs both React + API functions)
npx vercel dev
# → http://localhost:3000
```

> `vercel dev` is the recommended local dev command — it emulates the serverless environment exactly. The CRA proxy fallback (`npm start`) also works for frontend-only iteration.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/trades` | List trades (`?symbol`, `?side`, `?limit`, `?offset`) |
| `POST` | `/api/trades` | Add trade `{ symbol, side, qty, price }` |
| `DELETE` | `/api/trades/:id` | Delete a trade |
| `GET` | `/api/positions` | All positions + PnL |
| `GET` | `/api/prices` | All market prices |
| `PUT` | `/api/prices/:symbol` | Update a price `{ price }` |
| `GET` | `/api/prices/history` | 30-day price history |
| `GET` | `/api/summary` | Portfolio summary |
| `GET` | `/api/analytics/volume` | Daily buy/sell volumes |

---

## ⚠️ Important Notes

### State Persistence
The backend uses **in-memory state** seeded at cold-start. On Vercel:
- Each serverless function shares state via the `_store.js` module **within the same instance**
- State resets on new deployments or when instances are recycled
- For persistent state, replace `_store.js` with [Upstash Redis](https://upstash.com/) or [PlanetScale](https://planetscale.com/)

### Upgrading to Persistent Storage (Upstash Redis)
```bash
npm install @upstash/redis
```
Then replace the `trades` array in `_store.js` with Redis list operations.

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Chart.js 4, react-chartjs-2 |
| Backend | Vercel Serverless Functions (Node.js) |
| Fonts | Sora + DM Mono (Google Fonts) |
| Deployment | Vercel |
