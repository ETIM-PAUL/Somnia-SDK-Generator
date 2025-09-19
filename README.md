# Somnia SDK Generator 🚀

An intelligent SDK generator for Somnia blockchain that leverages AI to analyze smart contracts, generate optimized TypeScript/JavaScript SDKs with comprehensive documentation and type safety and publish your smart contract SDK.

## 🌟 Features

- **AI-Powered Contract Analysis**: Uses Hugging Face AI models to analyze smart contract code and optimize SDK generation
- **Automatic Type Generation**: Creates fully typed TypeScript interfaces from Solidity contracts
- **Optimized Function Calls**: Intelligent gas estimation and transaction optimization
- **Comprehensive Documentation**: Auto-generated documentation with examples and usage guides
- **Somnia Testnet Network Support**: Works with Somnia testnet network
- **React Hooks Integration**: Pre-built React hooks for seamless frontend integration
- **Error Handling**: Robust error handling with user-friendly error messages
- **Testing Suite**: Automated test generation for all contract functions

## 🤖 AI Integration

This project leverages **Hugging Face AI** for intelligent contract analysis and optimization:

- **Contract Code Analysis**: AI models analyze Solidity code to understand contract structure and functionality
- **Gas Optimization**: AI suggests optimal gas limits and transaction parameters
- **Documentation Generation**: Natural language processing generates comprehensive documentation
- **Code Quality Enhancement**: AI reviews generated SDK code for best practices and optimization opportunities
- **Type Safety Improvement**: Intelligent type inference for complex contract interactions for Typescript SDK


## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Valid Somnia RPC endpoint
- Hugging Face API key (for AI features)

## ⚙️ Configuration

Create a `.env` file in your project root:

```
VITE_HUGGINGFACE_API="your_key"
```

## 📁 Generated SDK Structure

```
generated-sdk/
├── contracts/
│   ├── contractName.sol/           # Contract type definitions
│   └── index.js            # Main export
├── docs/                   # Auto-generated documentation
├── package.json
└── README.md
```

## 🧪 AI-Powered Features

### Contract Analysis

The AI analyzes your contract and provides:

- **Function Classification**: Identifies read/write functions, payable functions, events
- **Gas Optimization**: Suggests optimal gas limits for each function
- **Security Analysis**: Identifies potential security issues and suggests improvements
- **Integration Patterns**: Recommends best practices for frontend integration

### Documentation Generation

AI generates comprehensive documentation including:

- **Function Descriptions**: Natural language descriptions of what each function does
- **Parameter Explanations**: Detailed parameter descriptions and types
- **Usage Examples**: Real-world usage examples for each function
- **Integration Guides**: Step-by-step integration guides

### Code Optimization

The AI optimizer provides:

- **Type Safety**: Enhanced TypeScript types for better developer experience
- **Error Handling**: Intelligent error handling with descriptive messages
- **Performance**: Optimized function calls and batch operations
- **Best Practices**: Following Ethereum and Somnia best practices

## 🔧 Advanced Configuration

### Custom AI Models

```javascript
// somnia-sdk.config.js
module.exports = {
  ai: {
    models: {
      codeAnalysis: 'Qwen/Qwen3-32B',
    }
  }
};
```


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/your-repo/somnia-sdk-generator.git
cd somnia-sdk-generator
npm install
npm run dev
```

## 📝 API Reference

### SomniaSDK Class

```typescript
class SomniaSDK {
  constructor(config: SomniaConfig);
  
  // Contract interaction methods
  async call(method: string, params: any[]): Promise<any>;
  async send(method: string, params: any[], options?: TxOptions): Promise<TransactionResponse>;
  
  // Utility methods
  async getGasEstimate(method: string, params: any[]): Promise<BigNumber>;
  async getBalance(address: string): Promise<BigNumber>;
}
```

### React Hooks

```typescript
// Read contract data
function useContract<T>(method: string, params: any[]): {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Write to contract
function useContractWrite(method: string): {
  write: (params: any[], options?: TxOptions) => Promise<TransactionResponse>;
  loading: boolean;
  error: Error | null;
}
```

## 🐛 Troubleshooting

### Common Issues

**Q: AI features not working**
A: Ensure your Hugging Face API key is set correctly in the configuration or environment variables.

**Q: Generated SDK compilation errors**
A: Check that your contract ABI is valid and all dependencies are installed.

**Q: Network connection issues**
A: Verify your RPC URL is correct and accessible.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the AI models used in contract analysis and optimization
- [Somnia](https://somnia.network/) team for the amazing blockchain infrastructure
- [Ethers.js](https://ethers.org/) for the excellent Ethereum interaction library

## 📞 Support

- 📧 Email: etimpaul22@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/ETIM-PAUL/Somnia-SDK-Generator/issues)
- 📖 Docs: [Full Documentation](https://docs.somnia-sdk.dev)

---

**Made with ❤️ for the Somnia ecosystem**

*Powered by AI • Built for developers • Optimized for production*