# BaseFlow Backend

Backend API and routing engine for BaseFlow.

## Setup

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
PORT=3001
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org
NETWORK=sepolia
```

## Development

```bash
npm run dev
```

## API Endpoints

- `GET /quote?tokenIn=...&tokenOut=...&amount=...` - Get quote
- `GET /routes?tokenIn=...&tokenOut=...` - Get available routes
- `POST /simulate` - Simulate route execution
- `POST /swap` - Prepare swap transaction
- `GET /liquidity-map?token=...` - Get liquidity map
- `GET /health` - Health check

