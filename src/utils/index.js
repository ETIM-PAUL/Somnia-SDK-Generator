

export const SOMNIA_TESTNET_CONFIG = {
    chainId: 50311,
    name: 'Somnia Testnet',
    rpcUrl: 'https://testnet-rpc.somnia.network',
    nativeCurrency: {
      name: 'STT',
      symbol: 'STT',
      decimals: 18
    },
    blockExplorer: 'https://testnet-explorer.somnia.network'
};

export async function isContractVerified(address) {
    const url = `https://shannon-explorer.somnia.network/api?module=contract&action=getsourcecode&address=${address}`;
    const res = await fetch(url);
    const data = await res.json();

  
    if (data.status === "1" && data.result.length > 0) {
      const info = data.result[0];
      console.log(data)
      return {
        verified: info.SourceCode && info.SourceCode !== "",
        contractAddress: info.Address,
        contractName: info.ContractName,
        abi: info.ABI,
        compilerVersion: info.CompilerVersion,
      };
    }
  
    return { verified: false };
}

/**
 * Compile Solidity source and return deployed (runtime) bytecode
 */
async function compileSolidity(source, contractName, selectedVersion="v0.8.20+commit.a1b79de6") {
    const soljsonResponse = await fetch(`https://binaries.soliditylang.org/bin/soljson-${selectedVersion}.js`);
      console.log(soljsonResponse)
      const soljsonCode = await soljsonResponse.text();
  
      // 3. Evaluate it to get a Module object
      const Module = {};
      // eslint-disable-next-line no-new-func
      new Function("Module", soljsonCode + ";return Module;")(Module);
  
      // 4. Import wrapper dynamically from unpkg
      const wrapper = (await import("https://unpkg.com/solc/wrapper?module")).default;
      const solc = wrapper(Module);
    
    const input = {
        language: "Solidity",
        sources: {
          "HelloWorld.sol": {
            content: source,
          },
        },
        settings: {
          outputSelection: {
            "*": {
              "*": ["abi", "evm.bytecode"],
            },
          },
        },
      };
  
      // Compile
      const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
      // Get bytecode
      const compiled = output.contracts[contractName + ".sol"][contractName];
      const bytecode = compiled.evm.bytecode.object;
  
      return bytecode;
  }

/**
 * Fetch deployed bytecode from Somnia Shannon explorer
 */
export async function getDeployedBytecode(address) {
  const url = `https://shannon-explorer.somnia.network/api?module=proxy&action=eth_getCode&address=${address}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "1") throw new Error("Failed to fetch deployed bytecode");
  return data.result?.toLowerCase();
}

/**
 * Main comparison function
 */
export async function doesContractCodeMatch(address, sourceCode, version) {
  // 1️⃣ Compile user-provided code
  const isVerified = await isContractVerified(address);
  const localBytecode = await compileSolidity(sourceCode, isVerified?.contractName, version);
console.log("local", localBytecode)
  // 2️⃣ Get deployed bytecode
  const deployedBytecode = await getDeployedBytecode(address);

  // 3️⃣ Compare
  return deployedBytecode === localBytecode.toLowerCase();
}

export function extractOutermostObject(text) {
  // Find the first '{' and last '}' in the string
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    console.error("No JSON object found in text");
    return null;
  }

  const jsonString = text.slice(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse JSON:", err.message);
    return null;
  }
}