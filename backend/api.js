import express from 'express';
import cors from 'cors';
import { getQuote } from './quotation-engine.js';
import { getRoutes, optimizeRoute } from './route-optimizer.js';
import { simulateRoute } from './path-simulator.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * GET /quote
 * Get a quote for swapping tokens
 * Query params: tokenIn, tokenOut, amount
 */
app.get('/quote', async (req, res) => {
  try {
    const { tokenIn, tokenOut, amount } = req.query;

    if (!tokenIn || !tokenOut || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters: tokenIn, tokenOut, amount'
      });
    }

    const quote = await getQuote(tokenIn, tokenOut, amount);
    res.json(quote);
  } catch (error) {
    // Provide user-friendly error messages
    const errorMessage = error.message || 'Failed to get quote';
    console.error('Quote API error:', errorMessage);
    
    // Check if it's a "no quotes" error (404) vs server error (500)
    const statusCode = errorMessage.includes('No liquidity pools') ? 404 : 500;
    res.status(statusCode).json({ 
      error: errorMessage,
      tokenIn,
      tokenOut,
      amount
    });
  }
});

/**
 * GET /routes
 * Get all available routes for a token pair
 * Query params: tokenIn, tokenOut
 */
app.get('/routes', async (req, res) => {
  try {
    const { tokenIn, tokenOut } = req.query;

    if (!tokenIn || !tokenOut) {
      return res.status(400).json({
        error: 'Missing required parameters: tokenIn, tokenOut'
      });
    }

    const routes = await getRoutes(tokenIn, tokenOut);
    res.json({ routes });
  } catch (error) {
    console.error('Routes error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /simulate
 * Simulate a route execution
 * Body: { route, amountIn }
 */
app.post('/simulate', async (req, res) => {
  try {
    const { route, amountIn } = req.body;

    if (!route || !amountIn) {
      return res.status(400).json({
        error: 'Missing required parameters: route, amountIn'
      });
    }

    const simulation = await simulateRoute(route, amountIn);
    res.json(simulation);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /swap
 * Prepare swap transaction data
 * Body: { tokenIn, tokenOut, amountIn, minAmountOut, recipient }
 */
app.post('/swap', async (req, res) => {
  try {
    const { tokenIn, tokenOut, amountIn, minAmountOut, recipient } = req.body;

    if (!tokenIn || !tokenOut || !amountIn || !minAmountOut || !recipient) {
      return res.status(400).json({
        error: 'Missing required parameters'
      });
    }

    // Get optimal route
    const routes = await getRoutes(tokenIn, tokenOut);
    const optimalRoute = await optimizeRoute(routes, amountIn);

    // Prepare swap data
    const swapData = {
      route: optimalRoute,
      amountIn,
      minAmountOut,
      recipient
    };

    res.json(swapData);
  } catch (error) {
    console.error('Swap error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /liquidity-map
 * Get liquidity map for a token
 * Query params: token
 */
app.get('/liquidity-map', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        error: 'Missing required parameter: token'
      });
    }

    // TODO: Implement liquidity map generation
    res.json({
      token,
      liquidity: [],
      message: 'Liquidity map not yet implemented'
    });
  } catch (error) {
    console.error('Liquidity map error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`BaseFlow API server running on port ${PORT}`);
});

