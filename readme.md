## Library for create unit test with WAVESPLATFORM node

### install

`npm install @waves/node-state -D`

### Usage

#### cli:
`node-state -n -e -o ./state.json` or `node-state -n -e -o -m typescript ./state.ts`

```bash
Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --out, -o       Out of result                              [string] [required]
  --config, -c    Path to config file                                   [string]
  --mode, -m      Compile mode [choices: "json", "typescript"] [default: "json"]
  --node, -n      Need up node (port 6869)                             [boolean]
  --explorer, -e  Need up explorer (port 3000)                         [boolean]
```

### Usage example

#### Step 1. Up the node and create the state
`node-state -n -m typescript -o ./tests/state.ts`;
#### Step 2. Write some tests with some test framework
```typescript
import { NODE_URL, STATE, CHAIN_ID, MASTER_ACCOUNT } from './test/state.ts';
import { transfer, broadcast, waitForTx } from '@waves/waves-transactions';


it('Create transfer transaction', async () => {
    const tx = transfer({ 
        recipient: `alias:${CHAIN_ID}:${MASTER_ACCOUNT.ALIAS}`,
        amount: 1000
    }, STATE.ACCOUNTS.SIMPLE.seed);
    await broadcast(tx);
    await waitForTx(tx.id, { apiBase: NODE_URL }); // Transaction broadcast success!
});
```

#### Example of output file (test/state.ts) in typescript:
```typescript
export const MASTER_ACCOUNT = {
    "SEED": "waves private node seed with waves tokens",
    "ADDRESS": "3M4qwDomRabJKLZxuXhwfqLApQkU592nWxF",
    "PUBLIC_KEY": "AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV",
    "ALIAS": "master"
};
export const NODE_URL = "http://localhost:6869";
export const CHAIN_ID = "R";
export const NETWORK_BYTE = 82;

export const STATE = {
    "ACCOUNTS": {
        "FOR_SCRIPT": {
            "seed": "yellow pulp memory brick mimic myself hungry amount canal crop service stuff bachelor pilot mention",
            "address": "3MPXEgRCmT5cdsFKkq9x5mbiT3oCQ4ZjYw5",
            "publicKey": "AZkHyW5o11h2RerR2e7tF4mRUZED5aAW33sHAAAkseKY",
            "scripted": true
        }
    },
    "ASSETS": {
        "BTC": {
            "type": 3,
            "version": 2,
            "senderPublicKey": "AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV",
            "name": "WBTC",
            "description": "WBTC description",
            "quantity": 100000000000000,
            "decimals": 8,
            "reissuable": false,
            "fee": 100000000,
            "timestamp": 1573820086719,
            "chainId": 82,
            "proofs": [
                "5YJF6zKSqMN315phAGDhT2fiKyHkZF3j46YAkwXM4f2THdjw4KFSmvbA5omi12ybWpBuqryJLbC9MdCDNSpRDyYg"
            ],
            "id": "DEtwtnL41USBmnoU4UN1rqhHGBKvLLqpH483TV6GK4Sy"
        },
    }
};
```

#### Example of output file (test/state.json) in json:
```json
{
  "ACCOUNTS": {
    "FOR_SCRIPT": {
      "seed": "usual scatter episode relax spy subway tuna around define expect kit wall cupboard list one",
      "address": "3M2a7rdLCfStGjMJVQjmiTYCZUdgs7eYkkR",
      "publicKey": "BsmaQyjqTmMX4mNoYo9RzV9H8GWtMJb6WPcgB2MNRzBU",
      "scripted": true
    }
  },
  "ASSETS": {
    "BTC": {
      "type": 3,
      "version": 2,
      "senderPublicKey": "AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV",
      "name": "WBTC",
      "description": "WBTC description",
      "quantity": 100000000000000,
      "decimals": 8,
      "reissuable": false,
      "fee": 100000000,
      "timestamp": 1573820268769,
      "chainId": 82,
      "proofs": [
        "nMtaXPFnAAasKhryqbwVco2SHro87X5vsDAwQmBjpprPaG3DVRSfQrNUKjAf3ejQatxQqSEkFCfPdEa74ALomM9"
      ],
      "id": "EeojFwKrozm9mpHvmYt6N5qnwhGTo8ztXpxogcHHYw8s"
    },
    "MASTER_ACCOUNT": {
      "SEED": "waves private node seed with waves tokens",
      "ADDRESS": "3M4qwDomRabJKLZxuXhwfqLApQkU592nWxF",
      "PUBLIC_KEY": "AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV",
      "ALIAS": "master"
    },
    "NODE_URL": "http://localhost:6869",
    "CHAIN_ID": "R",
    "NETWORK_BYTE": 82
  }
}
```

### Custom config properties

```json5
{
    // Assets for deploy to node state
    "ASSETS": {
        "BTC": {                               
            // Required. Name of asset
            "name": "Asset name",
            // Optional. Description of asset        
            "description": "Asset description",
            // Optional. Decimals of asset. Default 8
            "decimals": 4,
            // Optional. Quantity of asset coins. Default 100000000000000
            "quantity": 100,
            // Optional. Reissuable of asset. Default true
            "reissuable": true
        }
    },
    "ACCOUNTS": {
        // Account name for usage from tests
        "FOR_SCRIPT": {
            // Optional. Script for deploy to account. Choices [boolean or "dApp" or base64 string]
            "script": "dApp",
            // Optional. Create alias for account
            "alias": true,
            // Optional. Balance for account
            "balance": {
                // Hash with key in Key of ASSETS and value is coins of asset
                "BTC": 10000000
            },
            // Optional. Data state for account. Not supported, in development.
            "data": {
                // Key of data state
                "someKey": {
                    // Type of field. Can be "integer" of "binary" of "boolean" or "string"
                    "type": "integer",
                    // Value for data state
                    "value": 1000
                }   
            }
        }
    }
}
```
