// components/WasmLoader.jsx
import { useEffect } from 'react';

const WasmLoader = ({ onScoreUpdate }) => {
  useEffect(() => {
    const loadWasm = async () => {
      // 1. Load wasm_exec.js script
      const script = document.createElement('script');
      script.src = '/wasm/wasm_exec.js'; // Ensure this is the correct path for wasm_exec.js
      script.onload = async () => {
        // 2. Create Go runtime environment
        const go = new Go();
        
        try {
          // 3. Get wasm file path
          const wasmFilePath = '/wasm/main.wasm'; // Actual wasm file path
          const response = await fetch(wasmFilePath);
          const buffer = await response.arrayBuffer();

          // 4. Instantiate the WebAssembly module
          const { instance } = await WebAssembly.instantiate(buffer, go.importObject);

          // 5. Run the Go program
          go.run(instance);

          // 6. Get WebAssembly game's score (assuming wasm has a getScore function)
          const getScore = () => {
            const score = instance.exports.getScore(); // Assuming WebAssembly has a getScore function
            onScoreUpdate(score);  // Update the score in the parent component
          };

          // 7. Set interval to periodically update the score
          const intervalId = setInterval(getScore, 100);  // Get score every 100ms

          // Cleanup timer on component unmount
          return () => clearInterval(intervalId);

        } catch (error) {
          console.error('Failed to load WebAssembly:', error);
        }
      };
      
      document.body.appendChild(script);  // Append script to the body
    };

    loadWasm();
  }, [onScoreUpdate]);  // Only load the wasm on component mount

  return <div>Loading WebAssembly...</div>;
};

export default WasmLoader;
