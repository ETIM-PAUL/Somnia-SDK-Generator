import { InferenceClient } from "@huggingface/inference";
import { extractOutermostObject } from "utils";

export async function HuggingFaceContractAnalyzer (code) {

  let analysis = "";
  let selectedModel = 'Qwen/Qwen3-32B';
  let contractCode = code;


  const hf = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_API); // or omit if using a public model

  // Hugging Face API call with different endpoints
  const callHuggingFaceAPI = async (model, prompt, task = 'text-generation') => {
    const response = await hf.chatCompletion({
      model: selectedModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.1,
    });

    
    if (!response.choices) {
      throw new Error(`API Error (${response})`);
    }

    const formattedResponse = extractOutermostObject(response.choices[0].message.content);
    console.log(formattedResponse)
    return formattedResponse;
  };

  // Manual analysis functions as backup
  const performManualAnalysis = () => {
    const analysis = {
      contract: extractContractInfo(code),
      functions: extractFunctions(code),
      events: extractEvents(code),
      variables: extractStateVariables(code),
      modifiers: extractModifiers(code)
    };

    let output = '';
    
    output += `📋 CONTRACT: ${analysis.contract.name}\n`;
    output += `   Type: ${analysis.contract.type}\n`;
    output += `   Inheritance: ${analysis.contract.inheritance.join(', ') || 'None'}\n\n`;
    
    output += `🔧 FUNCTIONS (${analysis.functions.length}):\n`;
    analysis.functions.forEach(func => {
      output += `   • ${func.name} (${func.visibility}${func.modifiers.length ? ', ' + func.modifiers.join(', ') : ''})\n`;
      output += `     Gas: ${func.gasComplexity}, Security: ${func.securityLevel}\n`;
    });
    
    output += `\n📢 EVENTS (${analysis.events.length}):\n`;
    analysis.events.forEach(event => {
      output += `   • ${event.name}(${event.parameters})\n`;
    });
    
    output += `\n💾 STATE VARIABLES (${analysis.variables.length}):\n`;
    analysis.variables.forEach(variable => {
      output += `   • ${variable.type} ${variable.name} (${variable.visibility})\n`;
    });
    
    if (analysis.modifiers.length > 0) {
      output += `\n🛡️ MODIFIERS (${analysis.modifiers.length}):\n`;
      analysis.modifiers.forEach(modifier => {
        output += `   • ${modifier.name}\n`;
      });
    }
    
    return output;
  };

  // Helper functions for manual analysis
  const extractContractInfo = () => {
    const contractMatch = code.match(/contract\s+(\w+)(?:\s+is\s+(.+?))?\s*{/);
    const inheritance = contractMatch && contractMatch[2] 
      ? contractMatch[2].split(',').map(s => s.trim()) 
      : [];
    
    let type = 'Custom Contract';
    if (inheritance.some(i => i.includes('ERC721'))) type = 'ERC-721 NFT';
    if (inheritance.some(i => i.includes('ERC20'))) type = 'ERC-20 Token';
    if (inheritance.some(i => i.includes('ERC1155'))) type = 'ERC-1155 Multi-Token';
    
    return {
      name: contractMatch ? contractMatch[1] : 'Unknown',
      inheritance,
      type
    };
  };

  const extractFunctions = () => {
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*([\w\s,]*?)(?:\s+returns\s*\([^)]*\))?\s*{/g;
    const functions = [];
    let match;
    
    while ((match = functionRegex.exec(code)) !== null) {
      const name = match[1];
      const modifierString = match[2];
      
      const visibility = modifierString.includes('public') ? 'public' : 
                        modifierString.includes('private') ? 'private' :
                        modifierString.includes('external') ? 'external' : 'internal';
      
      const modifiers = [];
      if (modifierString.includes('payable')) modifiers.push('payable');
      if (modifierString.includes('view')) modifiers.push('view');
      if (modifierString.includes('pure')) modifiers.push('pure');
      if (modifierString.includes('onlyOwner')) modifiers.push('onlyOwner');
      
      // Extract function body for analysis
      const functionBody = extractFunctionBody(code, match.index);
      const gasComplexity = estimateGasComplexity(functionBody);
      const securityLevel = assessFunctionSecurity(functionBody, modifiers);
      
      functions.push({
        name,
        visibility,
        modifiers,
        gasComplexity,
        securityLevel
      });
    }
    
    return functions;
  };

  const extractEvents = () => {
    const eventRegex = /event\s+(\w+)\s*\(([^)]*)\);/g;
    const events = [];
    let match;
    
    while ((match = eventRegex.exec(code)) !== null) {
      events.push({
        name: match[1],
        parameters: match[2].trim()
      });
    }
    
    return events;
  };

  const extractStateVariables = () => {
    const varRegex = /(mapping\s*\([^)]+\)\s*(?:public|private|internal)?\s*(\w+)|(?:uint256|uint|int|address|string|bool|bytes(?:\d+)?)\s+(public|private|internal)?\s*(\w+))/g;
    const variables = [];
    let match;
    
    while ((match = varRegex.exec(code)) !== null) {
      if (match[1].startsWith('mapping')) {
        variables.push({
          type: match[1].split(' ')[0],
          name: match[2],
          visibility: 'internal'
        });
      } else {
        variables.push({
          type: match[1],
          name: match[4],
          visibility: match[3] || 'internal'
        });
      }
    }
    
    return variables;
  };

  const extractModifiers = () => {
    const modifierRegex = /modifier\s+(\w+)\s*\([^)]*\)\s*{/g;
    const modifiers = [];
    let match;
    
    while ((match = modifierRegex.exec(code)) !== null) {
      modifiers.push({
        name: match[1]
      });
    }
    
    return modifiers;
  };

  const extractFunctionBody = (startIndex) => {
    let braceCount = 0;
    let i = code.indexOf('{', startIndex);
    const start = i;
    
    for (i; i < code.length; i++) {
      if (code[i] === '{') braceCount++;
      if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0) break;
      }
    }
    
    return code.substring(start + 1, i);
  };

  const estimateGasComplexity = (functionBody) => {
    let complexity = 1;
    complexity += (functionBody.match(/\w+\s*=/g) || []).length * 2;
    complexity += (functionBody.match(/\.call|\.transfer|\.send/g) || []).length * 3;
    complexity += (functionBody.match(/for\s*\(|while\s*\(/g) || []).length * 5;
    
    return complexity > 15 ? 'High' : complexity > 8 ? 'Medium' : 'Low';
  };

  const assessFunctionSecurity = (functionBody, modifiers) => {
    let score = 5;
    
    if (modifiers.includes('onlyOwner')) score += 2;
    if (functionBody.includes('require(')) score += 2;
    if (functionBody.includes('.call{value:') && !functionBody.includes('ReentrancyGuard')) score -= 3;
    if (modifiers.includes('payable') && !modifiers.includes('onlyOwner')) score -= 1;
    
    return score >= 7 ? 'High' : score >= 4 ? 'Medium' : 'Low';
  };

  // Analyze contract structure using code models
    try {
      const prompt = `
      You are a smart contract auditor AI.
      
      Analyze this Solidity smart contract deployed on Somnia testnet:
      
      ${contractCode}
      
      Return your analysis answer strictly (I repeat, strictly) in the following JSON format:
      
      {
        "security_score": number (0-100),
        "contract_complexity": "low" | "medium" | "high",
        "function_details": [
          {
            "name": string,
            "signature": string,
            "gasEstimate": number,
            "visibility": "public" | "private" | "internal" | "external"
          }
        ],
        "security_recommendations": [
          {
            "title": string,
            "description": string,
            "impact": "low" | "medium" | "high"
            "impact_percentage": number (0-100)
          }
        ],
        "optimization_recommendations": [
          {
            "title": string,
            "description": string,
            "impact": "low" | "medium" | "high"
            "impact_percentage": number (0-100)
          }
        ]
      }
      
      Rules:
      - Don't add your thinking text (<think></think>).
      - Only return JSON. Do not include extra text, markdown, or explanations.
      - If some fields cannot be determined, use null or an empty array.
      - Use realistic gas estimates for Somnia testnet (assume average L2 gas costs)
      - Ensure the JSON is valid and properly formatted.
      `;
      

      // Process each chunk separately
      const result = await callHuggingFaceAPI(selectedModel, prompt, 'text-generation')


      if (result) {
        analysis = result;
      } else {
        analysis = performManualAnalysis(contractCode);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      analysis = (`Error: ${error.message}\n\nFalling back to manual analysis...\n\n${performManualAnalysis(contractCode)}`);
    }

  return {
    analysis
  }
};


export async function HuggingFaceSDKGeneration(code, abi) {

  let selectedModel = 'Qwen/Qwen3-32B';
  let contractCode = code;


  const hf = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_API); // or omit if using a public model

  // Hugging Face API call with different endpoints
  const callHuggingFaceAPI = async (model, prompt, task = 'text-generation') => {
    const response = await hf.chatCompletion({
      model: selectedModel,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.1,
    });

    
    if (!response.choices) {
      throw new Error(`API Error (${response})`);
    }

    const formattedResponse = extractOutermostObject(response.choices[0].message.content);
    console.log(formattedResponse)
    return formattedResponse;
  }

  // Analyze contract structure using code models
  try {
    const prompt = `

    You are an expert blockchain developer.
    Given the following Solidity smart contract ABI, generate a Javascript SDK class
    that wraps the contract using viem. The class must:

    - Create a public client for read operations.
    - Create a wallet client for write operations (connect() method).
    - Include methods for every public and external function in the contract.
    - Include event listeners and a helper to fetch past events.
    - Throw meaningful errors when wallet is not connected.

    Now generate the SDK for this Smart contract ABI:

    Smart contract ABI:
    ${JSON.stringify(abi)}

    
    Rules:
    - Don't add your thinking text (<think></think>).
    - Output only the Javascript code, nothing else..
    - Only return code. Do not include extra text, markdown, or explanations.
    - If some fields cannot be determined, use null or an empty array.
    - Ensure the code is valid and properly formatted.
    `;
    

    // Process each chunk separately
    const result = await callHuggingFaceAPI(selectedModel, prompt, 'text-generation')


    return result;
    
  } catch (error) {
    console.error('Analysis error:', error);
    analysis = (`Error: ${error.message}\n\nFalling back to manual analysis...\n\n${performManualAnalysis(contractCode)}`);
  }

return {
  analysis
}

}