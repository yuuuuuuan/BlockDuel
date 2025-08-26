// components/Loader_2048.jsx
import { useEffect } from 'react';

const Loader_2048 = ({ onScoreUpdate }) => {
  useEffect(() => {
    const loadWasm = async () => {

      const script = document.createElement('script');
      script.src = '/wasm/wasm_exec.js'; // Ensure this is the correct path for wasm_exec.js
      script.onload = async () => {
        const WASM_URL = '/wasm/test.wasm';
        var wasm;
        const go = new Go();
        if ('instantiateStreamng' in WebAssembly) {
        WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject).then(function (obj) {
          wasm = obj.instance;
          go.run(wasm);
          const score = instance.exports.GetScore(); // Ensure GetScore is available in the WebAssembly exports
          onScoreUpdate(score);  // Update the score in the parent component
        })
        } else {
        fetch(WASM_URL).then(resp =>
          resp.arrayBuffer()
        ).then(bytes =>
          WebAssembly.instantiate(bytes, go.importObject).then(function (obj) {
            wasm = obj.instance;
            go.run(wasm);
            const score = instance.exports.GetScore(); // Ensure GetScore is available in the WebAssembly exports
            onScoreUpdate(score);  // Update the score in the parent component
          })
        )
        }
      }
      
    };

    loadWasm();
  }, [onScoreUpdate]);  // Only load the wasm on component mount

  return <div>Loading WebAssembly...</div>;
};

export default Loader_2048;
