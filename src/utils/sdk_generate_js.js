import { SOMNIA_TESTNET_CONFIG } from "utils";

export function generateSDKClass(
  abi,
  contractAddress,
  className = "GeneratedSDK",
  packageName = "generated-sdk",
  rpcUrl = SOMNIA_TESTNET_CONFIG?.rpcUrl
) {
  const readFns = abi
    .filter(
      (item) =>
        item.type === "function" &&
        (item.stateMutability === "view" || item.stateMutability === "pure")
    )
    .map((fn) => fn.name);

  const writeFns = abi
    .filter(
      (item) =>
        item.type === "function" &&
        (item.stateMutability === "nonpayable" ||
          item.stateMutability === "payable")
    )
    .map((fn) => fn.name);

  const indexJs = `import { 
  createPublicClient, 
  createWalletClient, 
  getContract,
  http,
  custom
} from "viem";

const ABI = ${JSON.stringify(abi, null, 2)};

/**
 * Auto-generated SDK class for your contract.
 */
export class ${className} {
  constructor(config) {
    this.config = config;

    this.publicClient = createPublicClient({
      chain: config.chain,
      transport: config.rpcUrl ? http(config.rpcUrl) : http()
    });

    this.contract = getContract({
      address: "${contractAddress}",
      abi: ABI,
      client: this.publicClient
    });

    this.writeContract = null;
    this.walletClient = null;
  }

  /**
   * Connect a wallet provider for write calls.
   */
  async connectWallet(provider) {
    this.walletClient = createWalletClient({
      chain: this.config.chain,
      transport: custom(provider)
    });

    this.writeContract = getContract({
      address: "${contractAddress}",
      abi: ABI,
      client: this.walletClient
    });
  }

  read = {
${readFns
  .map((fn) => `    ${fn}: async (...args) => this.contract.read.${fn}(args)`)
  .join(",\n")}
  };

  write = {
${writeFns
  .map(
    (fn) => `    ${fn}: async (...args) => {
      if (!this.writeContract) throw new Error("Wallet not connected");
      return this.writeContract.write.${fn}(args);
    }`
  )
  .join(",\n")}
  };
}
`;

  const readme = `# ${className} SDK

Auto-generated SDK for interacting with your smart contract at **${contractAddress}**.

## 📦 Installation

\`\`\bash
npm install ${packageName}
# or
yarn add ${packageName}
\`\`\

## 🚀 Quick Start

\`\`\js
import { ${className} } from "${packageName}";
import { somniaTestnet } from "viem/chains";

const sdk = new ${className}({
  chain: somniaTestnet,
  rpcUrl: "${rpcUrl}"
});

// Connect wallet (if you need write operations)
await sdk.connectWallet(window.ethereum);

// Example: Read function
const value = await sdk.read.${readFns[0] || "someFunction"}();

// Example: Write function
${writeFns.length ? `await sdk.write.${writeFns[0]}(/* params */);` : "// No write functions available"}
\`\`\

## 🔍 Available Read Functions
${readFns.length ? readFns.map((fn) => `- \`${fn}()\``).join("\n") : "_No read functions detected._"}

## ✏️ Available Write Functions
${writeFns.length ? writeFns.map((fn) => `- \`${fn}()\``).join("\n") : "_No write functions detected._"}
`;


  return { indexJs, readme };
}
