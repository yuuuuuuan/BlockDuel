'use client';

import { useEffect, useRef, useState } from 'react';

// Define the Go object interface
interface Go {
  new(): {
    run: (instance: WebAssembly.Instance) => Promise<void>;
    importObject: WebAssembly.Imports;
  };
}

declare global {
  interface Window {
    Go: Go;
    initGame: (ctx: CanvasRenderingContext2D) => void;
    updateGame: () => void;
    handleKeyDown: (key: string) => void;
    handleKeyUp: (key: string) => void;
    getGameState: () => Record<string, unknown>;
  }
}

export default function WasmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Constants for game canvas
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;

  // Load WASM module
  useEffect(() => {
    async function loadWasm() {
      try {
        if (!canvasRef.current) return;

        // Check if Go WASM support is available
        if (typeof window.Go === 'undefined') {
          console.error("Go WASM support not available");
          setLoadError("WebAssembly support for Go is not available.");
          return;
        }

        const go = new window.Go();
        
        // Attempt to load the WASM module
        try {
          const result = await WebAssembly.instantiateStreaming(
            fetch('/wasm/2048.wasm'),
            go.importObject
          );
          go.run(result.instance);
          
          // Initialize the game
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            window.initGame(ctx);
            setIsWasmLoaded(true);
          }
        } catch (error) {
          console.error("Failed to load WASM module:", error);
          setLoadError("Failed to load WebAssembly game. Make sure the WASM file is correctly compiled and available.");
        }
      } catch (error) {
        console.error("Error setting up WASM:", error);
        setLoadError("Error setting up WebAssembly environment.");
      }
    }

    loadWasm();

    // Set up event listeners for keyboard input only for WASM mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWasmLoaded && window.handleKeyDown) {
        window.handleKeyDown(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isWasmLoaded && window.handleKeyUp) {
        window.handleKeyUp(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isWasmLoaded]);

  // Game loop for WASM implementation
  useEffect(() => {
    if (!isWasmLoaded) return;

    let animationFrameId: number;
    
    const gameLoop = () => {
      if (window.updateGame) {
        window.updateGame();
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWasmLoaded]);

  return (
    <div>
      {isWasmLoaded ? (
        <div>
          <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            className="bg-black border border-gray-300"
          />
          <p className="text-sm text-gray-500 mt-2">WASM Version - Using Go Game Implementation</p>
          <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="font-medium text-blue-800">Controls:</h3>
            <ul className="list-disc pl-5 text-blue-700">
              <li>Left/Right arrow keys to move</li>
              <li>Avoid the red squares</li>
              <li>Press Enter to restart after game over</li>
            </ul>
          </div>
        </div>
      ) : loadError ? (
        <div className="flex flex-col justify-center items-center border border-gray-300 rounded-md p-8" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          <div className="text-center">
            <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">WebAssembly Game Failed to Load</h3>
            <p className="text-gray-600 mb-4">{loadError}</p>
            <p className="text-sm text-gray-500">
              Please ensure you have compiled the Go code to WebAssembly and placed the files in the correct location.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center border border-gray-300 rounded-md" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading WebAssembly Game...</p>
          </div>
        </div>
      )}
    </div>
  );
}