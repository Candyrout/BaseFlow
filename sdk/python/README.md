# BaseFlow SDK (Python)

Python SDK for BaseFlow (Coming Soon)

## Installation

```bash
pip install baseflow-sdk
```

## Usage

```python
from baseflow import get_quote, simulate, swap

# Get a quote
quote = get_quote(
    token_in="0x...",
    token_out="0x...",
    amount="1000000000000000000"
)

# Simulate a route
simulation = simulate(quote.route, quote.amount_in)

# Prepare swap
swap_data = swap(
    route=quote.route,
    amount_in=quote.amount_in,
    min_amount_out=quote.amount_out,
    recipient="0x..."
)
```

