import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentationPreview = ({ 
  generatedDocs = {},
  selectedLanguage = 'javascript',
  isLoading = false 
}) => {
  const [activeDoc, setActiveDoc] = useState('readme');

  const mockDocumentation = {
    javascript: {
      readme: {
        title: 'README.md',
        content: `# Somnia SDK

A comprehensive JavaScript SDK for interacting with Somnia blockchain smart contracts.

## Features

- ✅ Sub-second finality support
- ✅ High throughput optimization (1M+ TPS)
- ✅ TypeScript definitions included
- ✅ Comprehensive error handling
- ✅ Built-in gas optimization
- ✅ Automatic retry mechanisms

## Installation

\`\`\`bash
npm install @somnia/contract-sdk
# or
yarn add @somnia/contract-sdk
\`\`\`

## Quick Start

\`\`\`javascript
import { SomniaSDK } from '@somnia/contract-sdk';

// Initialize the SDK
const sdk = new SomniaSDK({
  provider: 'https://somnia-testnet.rpc.url',
  contractAddress: '0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8A8'
});

// Connect to contract
await sdk.initialize();

// Get account balance
const balance = await sdk.getBalance('0x...');
console.log('Balance:', balance);

// Transfer tokens
const tx = await sdk.transfer('0x...', '1000000000000000000');
console.log('Transaction:', tx.hash);
\`\`\`

## API Reference

### SomniaSDK

#### Constructor Options

| Option | Type | Description |
|--------|------|-------------|
| \`provider\` | string | RPC endpoint URL |
| \`contractAddress\` | string | Smart contract address |
| \`privateKey\` | string | (Optional) Private key for signing |

#### Methods

##### \`initialize()\`
Initializes the SDK and establishes contract connection.

**Returns:** \`Promise<void>\`

##### \`getBalance(address)\`
Retrieves token balance for specified address.

**Parameters:**
- \`address\` (string): Wallet address to check

**Returns:** \`Promise<BigNumber>\`

##### \`transfer(to, amount)\`
Transfers tokens to specified address.

**Parameters:**
- \`to\` (string): Recipient address
- \`amount\` (string): Amount in wei

**Returns:** \`Promise<TransactionResponse>\`

## Error Handling

The SDK includes comprehensive error handling:

\`\`\`javascript
try {
  const result = await sdk.transfer(to, amount);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    console.log('Insufficient balance');
  } else if (error.code === 'NETWORK_ERROR') {
    console.log('Network connection failed');
  }
}
\`\`\`

## Configuration

### Network Settings

\`\`\`javascript
const config = {
  network: {
    chainId: 2648,
    name: 'Somnia Testnet',
    rpcUrl: 'https://somnia-testnet.rpc.url',
    blockExplorer: 'https://somnia-testnet.explorer.url'
  },
  gas: {
    limit: 21000,
    price: '20000000000' // 20 gwei
  }
};
\`\`\`

## Examples

### Basic Token Operations

\`\`\`javascript
// Check allowance
const allowance = await sdk.allowance(owner, spender);

// Approve spending
await sdk.approve(spender, amount);

// Transfer from
await sdk.transferFrom(from, to, amount);
\`\`\`

### Event Listening

\`\`\`javascript
// Listen for transfer events
sdk.on('Transfer', (from, to, value) => {
  console.log(\`Transfer: \${from} -> \${to}, Amount: \${value}\`);
});
\`\`\`

## License

MIT License - see LICENSE file for details.

## Support

- Documentation: https://docs.somnia.network
- GitHub Issues: https://github.com/somnia/sdk/issues
- Discord: https://discord.gg/somnia`
      },
      api: {
        title: 'API Documentation',
        content: `# API Documentation

## Core Classes

### SomniaSDK

Main SDK class for contract interactions.

#### Constructor

\`\`\`javascript
new SomniaSDK(options)
\`\`\`

**Parameters:**
- \`options\` (Object): Configuration options
  - \`provider\` (string): RPC endpoint
  - \`contractAddress\` (string): Contract address
  - \`privateKey\` (string, optional): Private key

#### Methods

##### initialize()

Initializes the SDK connection.

\`\`\`javascript
await sdk.initialize();
\`\`\`

**Returns:** Promise<void>

**Throws:**
- \`ConnectionError\`: When unable to connect to network
- \`ContractError\`: When contract is not found

##### getBalance(address)

Gets token balance for an address.

\`\`\`javascript
const balance = await sdk.getBalance('0x...');
\`\`\`

**Parameters:**
- \`address\` (string): Wallet address

**Returns:** Promise<BigNumber>

**Example:**
\`\`\`javascript
const balance = await sdk.getBalance('0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8A8');
console.log(balance.toString()); // "1000000000000000000"
\`\`\`

##### transfer(to, amount)

Transfers tokens to another address.

\`\`\`javascript
const tx = await sdk.transfer(to, amount);
\`\`\`

**Parameters:**
- \`to\` (string): Recipient address
- \`amount\` (string): Amount in wei

**Returns:** Promise<TransactionResponse>

**Example:**
\`\`\`javascript
const tx = await sdk.transfer(
  '0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8A8',
  '1000000000000000000'
);
console.log('Transaction hash:', tx.hash);
\`\`\`

### Events

The SDK emits various events for monitoring contract activity.

#### Transfer Event

Emitted when tokens are transferred.

\`\`\`javascript
sdk.on('Transfer', (from, to, value) => {
  console.log('Transfer event:', { from, to, value });
});
\`\`\`

#### Approval Event

Emitted when spending approval is granted.

\`\`\`javascript
sdk.on('Approval', (owner, spender, value) => {
  console.log('Approval event:', { owner, spender, value });
});
\`\`\`

### Error Types

#### ConnectionError

Thrown when network connection fails.

\`\`\`javascript
try {
  await sdk.initialize();
} catch (error) {
  if (error instanceof ConnectionError) {
    console.log('Failed to connect:', error.message);
  }
}
\`\`\`

#### ContractError

Thrown when contract interaction fails.

\`\`\`javascript
try {
  await sdk.transfer(to, amount);
} catch (error) {
  if (error instanceof ContractError) {
    console.log('Contract error:', error.message);
  }
}
\`\`\`

### Utilities

#### formatUnits(value, decimals)

Formats wei values to human-readable format.

\`\`\`javascript
import { formatUnits } from '@somnia/contract-sdk/utils';

const formatted = formatUnits('1000000000000000000', 18);
console.log(formatted); // "1.0"
\`\`\`

#### parseUnits(value, decimals)

Parses human-readable values to wei.

\`\`\`javascript
import { parseUnits } from '@somnia/contract-sdk/utils';

const wei = parseUnits('1.0', 18);
console.log(wei); // "1000000000000000000"
\`\`\``
      },
      examples: {
        title: 'Usage Examples',
        content: `# Usage Examples

## Basic Setup

\`\`\`javascript
import { SomniaSDK } from '@somnia/contract-sdk';

const sdk = new SomniaSDK({
  provider: 'https://somnia-testnet.rpc.url',
  contractAddress: '0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8A8',
  privateKey: process.env.PRIVATE_KEY // Optional
});

await sdk.initialize();
\`\`\`

## Token Operations

### Check Balance

\`\`\`javascript
async function checkBalance(address) {
  try {
    const balance = await sdk.getBalance(address);
    console.log(\`Balance: \${balance.toString()} wei\`);
    
    // Convert to human-readable format
    const formatted = sdk.utils.formatUnits(balance, 18);
    console.log(\`Balance: \${formatted} tokens\`);
  } catch (error) {
    console.error('Error checking balance:', error.message);
  }
}

await checkBalance('0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8A8');
\`\`\`

### Transfer Tokens

\`\`\`javascript
async function transferTokens(to, amount) {
  try {
    // Convert human-readable amount to wei
    const amountWei = sdk.utils.parseUnits(amount, 18);
    
    const tx = await sdk.transfer(to, amountWei);
    console.log('Transaction sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.transactionHash);
    
    return receipt;
  } catch (error) {
    console.error('Transfer failed:', error.message);
    throw error;
  }
}

await transferTokens('0x...', '10.5');
\`\`\`

### Approve Spending

\`\`\`javascript
async function approveSpending(spender, amount) {
  try {
    const amountWei = sdk.utils.parseUnits(amount, 18);
    const tx = await sdk.approve(spender, amountWei);
    
    console.log('Approval transaction:', tx.hash);
    await tx.wait();
    
    console.log('Spending approved');
  } catch (error) {
    console.error('Approval failed:', error.message);
  }
}

await approveSpending('0x...', '100');
\`\`\`

## Event Monitoring

### Listen to All Events

\`\`\`javascript
// Transfer events
sdk.on('Transfer', (from, to, value) => {
  console.log(\`Transfer: \${from} -> \${to}\`);
  console.log(\`Amount: \${sdk.utils.formatUnits(value, 18)}\`);
});

// Approval events
sdk.on('Approval', (owner, spender, value) => {
  console.log(\`Approval: \${owner} approved \${spender}\`);
  console.log(\`Amount: \${sdk.utils.formatUnits(value, 18)}\`);
});
\`\`\`

### Filter Events by Address

\`\`\`javascript
const userAddress = '0x742d35Cc6634C0532925a3b8D0C9C0E3C5d5c8A8';

sdk.on('Transfer', (from, to, value) => {
  if (from === userAddress || to === userAddress) {
    const direction = from === userAddress ? 'sent' : 'received';
    console.log(\`User \${direction} \${sdk.utils.formatUnits(value, 18)} tokens\`);
  }
});
\`\`\`

## Error Handling

### Comprehensive Error Handling

\`\`\`javascript
async function safeTransfer(to, amount) {
  try {
    const amountWei = sdk.utils.parseUnits(amount, 18);
    
    // Check balance first
    const balance = await sdk.getBalance(sdk.address);
    if (balance.lt(amountWei)) {
      throw new Error('Insufficient balance');
    }
    
    const tx = await sdk.transfer(to, amountWei);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    console.error('Transfer failed:', error);
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}
\`\`\`

### Retry Logic

\`\`\`javascript
async function transferWithRetry(to, amount, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await safeTransfer(to, amount);
      if (result.success) {
        return result;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(\`Retry \${i + 1}/\${maxRetries} failed, retrying...\`);
    }
  }
}
\`\`\`

## Advanced Usage

### Batch Operations

\`\`\`javascript
async function batchTransfer(recipients) {
  const promises = recipients.map(({ address, amount }) => {
    return sdk.transfer(address, sdk.utils.parseUnits(amount, 18));
  });
  
  try {
    const transactions = await Promise.all(promises);
    console.log(\`\${transactions.length} transfers initiated\`);
    
    // Wait for all confirmations
    const receipts = await Promise.all(
      transactions.map(tx => tx.wait())
    );
    
    console.log('All transfers confirmed');
    return receipts;
    
  } catch (error) {
    console.error('Batch transfer failed:', error);
    throw error;
  }
}

await batchTransfer([
  { address: '0x...', amount: '10' },
  { address: '0x...', amount: '20' },
  { address: '0x...', amount: '30' }
]);
\`\`\`

### Custom Gas Settings

\`\`\`javascript
async function transferWithCustomGas(to, amount) {
  const amountWei = sdk.utils.parseUnits(amount, 18);
  
  // Estimate gas
  const gasEstimate = await sdk.estimateGas.transfer(to, amountWei);
  
  // Add 20% buffer
  const gasLimit = gasEstimate.mul(120).div(100);
  
  const tx = await sdk.transfer(to, amountWei, {
    gasLimit: gasLimit,
    gasPrice: sdk.utils.parseUnits('20', 'gwei')
  });
  
  return tx;
}
\`\`\``
      }
    }
  };

  const docs = generatedDocs?.[selectedLanguage] || mockDocumentation?.[selectedLanguage] || mockDocumentation?.javascript;

  const documentTypes = [
    { id: 'readme', label: 'README', icon: 'FileText' },
    { id: 'api', label: 'API Docs', icon: 'BookOpen' },
    { id: 'examples', label: 'Examples', icon: 'Code2' }
  ];

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-surface rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-3/4"></div>
            <div className="h-4 bg-surface rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generated Documentation</h2>
            <p className="text-text-secondary mt-1">
              Auto-generated documentation and usage examples
            </p>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Download Docs
          </Button>
        </div>
      </div>
      {/* Document Type Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1 p-6 pb-0">
          {documentTypes?.map((docType) => (
            <button
              key={docType?.id}
              onClick={() => setActiveDoc(docType?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-smooth ${
                activeDoc === docType?.id
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={docType?.icon} size={16} />
              <span>{docType?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Document Content */}
      <div className="p-6">
        <div className="bg-muted/30 rounded-lg p-4 h-96 md:h-[600px] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground flex items-center space-x-2">
              <Icon name="FileText" size={20} />
              <span>{docs?.[activeDoc]?.title}</span>
            </h3>
            <Button variant="ghost" size="sm" iconName="Copy" iconSize={14}>
              Copy
            </Button>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm font-mono text-foreground leading-relaxed">
              {docs?.[activeDoc]?.content}
            </pre>
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="border-t border-border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            Documentation generated on {new Date()?.toLocaleDateString()}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" iconName="ExternalLink" iconPosition="left">
              View Online
            </Button>
            <Button variant="default" iconName="Download" iconPosition="left">
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPreview;