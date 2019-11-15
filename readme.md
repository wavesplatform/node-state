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
                // Optional. Hash with key in Key of ASSETS and value is coins of asset
                "BTC": 10000000
            },
            // Optional. Data state for account. Not supported.
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
