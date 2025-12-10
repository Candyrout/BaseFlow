# BaseFlow API Documentation

## Base URL

- **Development:** `http://localhost:3001`
- **Production:** `https://api.baseflow.xyz` (Coming Soon)

## Endpoints

### GET /quote

Get a quote for swapping tokens.

**Query Parameters:**
- `tokenIn` (string, required) - Input token address
- `tokenOut` (string, required) - Output token address
- `amount` (string, required) - Input amount in wei

**Example Request:**
```bash
GET /quote?tokenIn=0x...&tokenOut=0x...&amount=1000000000000000000
```

**Example Response:**
```json
{
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amountIn": "1000000000000000000",
  "amountOut": "2000000000000000000",
  "route": {
    "path": ["0x...", "0x..."],
    "dex": "uniswap-v3"
  },
  "dex": "uniswap-v3",
  "priceImpact": "0.5",
  "gasEstimate": "100000",
  "allQuotes": [...]
}
```

### GET /routes

Get all available routes for a token pair.

**Query Parameters:**
- `tokenIn` (string, required) - Input token address
- `tokenOut` (string, required) - Output token address

**Example Request:**
```bash
GET /routes?tokenIn=0x...&tokenOut=0x...
```

**Example Response:**
```json
{
  "routes": [
    {
      "path": ["0x...", "0x..."],
      "dex": "uniswap-v3",
      "type": "direct"
    },
    {
      "path": ["0x...", "0x..."],
      "dex": "aerodrome",
      "type": "direct"
    }
  ]
}
```

### POST /simulate

Simulate a route execution.

**Request Body:**
```json
{
  "route": {
    "path": ["0x...", "0x..."],
    "dex": "uniswap-v3"
  },
  "amountIn": "1000000000000000000"
}
```

**Example Response:**
```json
{
  "route": {...},
  "amountIn": "1000000000000000000",
  "estimatedAmountOut": "2000000000000000000",
  "priceImpact": "0.5",
  "gasEstimate": "100000",
  "warnings": [],
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

### POST /swap

Prepare swap transaction data.

**Request Body:**
```json
{
  "tokenIn": "0x...",
  "tokenOut": "0x...",
  "amountIn": "1000000000000000000",
  "minAmountOut": "1900000000000000000",
  "recipient": "0x..."
}
```

**Example Response:**
```json
{
  "route": {...},
  "amountIn": "1000000000000000000",
  "minAmountOut": "1900000000000000000",
  "recipient": "0x...",
  "transactionData": "0x..."
}
```

### GET /liquidity-map

Get liquidity map for a token.

**Query Parameters:**
- `token` (string, required) - Token address

**Example Request:**
```bash
GET /liquidity-map?token=0x...
```

### GET /health

Health check endpoint.

**Example Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T12:00:00.000Z"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

HTTP Status Codes:
- `400` - Bad Request (missing or invalid parameters)
- `500` - Internal Server Error

