// solcWorker.js
self.addEventListener("message", async (event) => {
  const { selectedVersion, input } = event.data;

  try {
    // Fetch the soljson binary
    const soljsonResponse = await fetch(
      `https://binaries.soliditylang.org/bin/${selectedVersion}`
    );

    if (!soljsonResponse.ok) {
      throw new Error(`Failed to fetch soljson binary: ${soljsonResponse.statusText}`);
    }

    const soljsonCode = await soljsonResponse.text();

    // Evaluate the soljson binary to get a Module object
    const Module = {};
    // eslint-disable-next-line no-new-func
    new Function("Module", soljsonCode + ";return Module;")(Module);

    // Import wrapper dynamically from unpkg
    const wrapper = (await import("https://unpkg.com/solc/wrapper?module")).default;
    const solc = wrapper(Module);

    // Compile the Solidity code
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Send the result back to the main thread
    self.postMessage({ output });
  } catch (err) {
    self.postMessage({ error: err.message });
  }
});
