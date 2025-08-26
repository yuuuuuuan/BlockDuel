// components/WasmLoader.jsx
import { useEffect } from 'react';

const WasmLoader = ({ onScoreUpdate }) => {
  useEffect(() => {
    const loadWasm = async () => {
      // 1. Load wasm_exec.js script
      const script = document.createElement('script');
      script.src = '/wasm/wasm_exec.js'; // Ensure this is the correct path for wasm_exec.js
      script.async = true;
      script.onload = async () => {
        // 2. Create Go runtime environment
        const go = new Go();
        let wasm;

        const wasmFilePath = '/wasm/test.wasm'; // Actual wasm file path

        // 3. Fetch and load the wasm file
        try {
          const response = await fetch(wasmFilePath);
          const buffer = await response.arrayBuffer();

          // 4. Instantiate the WebAssembly module
          if ('instantiateStreaming' in WebAssembly) {
            // Using instantiateStreaming for better performance (streaming the wasm file)
            wasm = await WebAssembly.instantiateStreaming(fetch(wasmFilePath), go.importObject);
          } else {
            // Fallback to instantiate after fetching the entire wasm file
            const { instance } = await WebAssembly.instantiate(buffer, go.importObject);
            wasm = { instance };
          }

          // 5. Run the Go program
          go.run(wasm.instance);

          // 6. Define function to update the score
          const getScore = () => {
            const score = wasm.instance.exports.GetScore(); // Ensure GetScore is available in WebAssembly exports
            if (score instanceof BigInt) {
              onScoreUpdate(Number(score)); // Convert BigInt to Number before updating
            } else {
              onScoreUpdate(score); // Update with the score value
            }
          };

          // 7. Set interval to periodically update the score
          const intervalId = setInterval(getScore, 100);

          // 8. Cleanup interval when the component unmounts
          return () => clearInterval(intervalId);
        } catch (error) {
          console.error('Failed to load WebAssembly:', error);
        }
      };

      document.body.appendChild(script); // Append script to the body
    };

    loadWasm();
  }, [onScoreUpdate]);  // Only load the wasm on component mount

  return <div>Loading WebAssembly...</div>;
};

export default WasmLoader;
