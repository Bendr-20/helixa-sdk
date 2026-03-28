# helixa-sdk

JavaScript/TypeScript SDK for the [Helixa](https://helixa.xyz) API — check cred scores, search agents, and report outcomes.

## Install

```bash
npm install Bendr-20/helixa-sdk
```

## Usage

```js
const { Helixa } = require('helixa-sdk');

const helixa = new Helixa(); // no key needed for reads

// Check cred score
const cred = await helixa.checkCred('0x1234...');
console.log(cred.score, cred.tier); // 67 'Prime'

// Get agent by ID
const agent = await helixa.getAgent(1);

// Search agents
const results = await helixa.searchAgents('Bendr');

// Get platform stats
const stats = await helixa.getStats();
```

### Authenticated (write operations)

```js
const helixa = new Helixa({ apiKey: 'hxk_...' });

await helixa.reportOutcome('0x1234...', {
  outcome: 'COMPLETED',
  sessionId: 'sess_123',
  timestamp: new Date().toISOString(),
});
```

### Error Handling

```js
const { Helixa, HelixaError } = require('helixa-sdk');

try {
  await helixa.checkCred('0xinvalid');
} catch (err) {
  if (err instanceof HelixaError) {
    console.error(err.status, err.code, err.message);
  }
}
```

## API

### `new Helixa(config?)`
- `apiKey` — API key for write operations
- `baseUrl` — Override base URL (default: `https://api.helixa.xyz/api/v2`)

### Methods
| Method | Auth | Description |
|--------|------|-------------|
| `checkCred(address)` | No | Get cred score for an address |
| `getAgent(id)` | No | Get agent by ID |
| `searchAgents(query, page?, pageSize?)` | No | Search agents |
| `getStats()` | No | Platform statistics |
| `reportOutcome(address, payload)` | Yes | Report an outcome |

## License

MIT
