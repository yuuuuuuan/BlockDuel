// components/WasmLoader.js
import { useEffect } from 'react';

const WasmLoader = () => {
  useEffect(() => {
    const loadWasm = async () => {
      // 1. 加载 wasm_exec.js 脚本
      const script = document.createElement('script');
      script.src = '/wasm/wasm_exec.js';  // 确保这是实际的 wasm_exec.js 路径
      script.onload = async () => {
        // 2. 创建 Go 运行时环境
        const go = new Go();
        
        try {
          // 3. 获取 wasm 文件路径
          const wasmFilePath = '/wasm/2048.wasm';  // 这里是实际的 wasm 文件路径
          const response = await fetch(wasmFilePath);
          const buffer = await response.arrayBuffer();

          // 4. 实例化 WebAssembly 模块
          const { instance } = await WebAssembly.instantiate(buffer, go.importObject);

          // 5. 运行 Go 程序
          go.run(instance);
        } catch (error) {
          console.error('加载 WebAssembly 失败:', error);
        }
      };
      
      document.body.appendChild(script);  // 将脚本添加到页面中
    };

    loadWasm();
  }, []);  // 依赖项为空数组，表示只在组件挂载时加载

  return <div>正在加载 WebAssembly...</div>;
};

export default WasmLoader;
