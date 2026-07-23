"use client";

import { useRef, useState, useEffect } from "react";

export default function SignatureMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [svgOutput, setSvgOutput] = useState("");

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    
    setIsDrawing(true);
    setCurrentPath(`M${x.toFixed(1)} ${y.toFixed(1)}`);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    setCurrentPath((prev) => prev + ` L${x.toFixed(1)} ${y.toFixed(1)}`);
    
    // Draw on canvas for visual feedback
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "white";
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPath) {
      setPaths((prev) => [...prev, currentPath]);
    }
    setCurrentPath("");
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath(); // reset canvas path
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setPaths([]);
    setCurrentPath("");
    setSvgOutput("");
  };

  const generateSvg = () => {
    const allPaths = [...paths];
    if (currentPath) allPaths.push(currentPath);
    
    if (allPaths.length === 0) return;
    
    // Combine all paths into one single continuous string (even if user lifted pen, it creates multiple sub-paths which is fine)
    const combinedPath = allPaths.join(" ");

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full">
  <motion.path 
    d="${combinedPath}"
    initial={{ pathLength: 0, fill: "transparent", stroke: "white", strokeWidth: 2 }}
    animate={{ pathLength: 1, fill: "transparent" }}
    transition={{ pathLength: { duration: 1.2, ease: "linear" } }}
  />
</svg>`;
    
    setSvgOutput(svgString);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Draw Your Signature</h1>
      <p className="mb-8 text-neutral-400">Draw your signature below using your mouse or trackpad. Write it as one continuous stroke if possible, or multiple strokes.</p>
      
      <div className="border-2 border-neutral-700 rounded-lg overflow-hidden bg-black cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="touch-none"
        />
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={clearCanvas} className="px-6 py-2 bg-neutral-800 rounded-md hover:bg-neutral-700">Clear</button>
        <button onClick={generateSvg} className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200">Generate SVG Code</button>
      </div>

      {svgOutput && (
        <div className="mt-12 w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-2">Success! Here is your SVG code:</h2>
          <p className="mb-4 text-neutral-400">Copy this entirely, and paste it into <code>src/components/dom/LoadingScreen.tsx</code> replacing the current text or SVG.</p>
          <textarea 
            readOnly 
            value={svgOutput}
            className="w-full h-64 bg-black border border-neutral-700 rounded-md p-4 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
