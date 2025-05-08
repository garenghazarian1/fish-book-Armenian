// "use client";

// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import styles from "./coloring.module.css";

// type HistoryItem = ImageData;
// type Point = { x: number; y: number };

// export default function ColoringPage() {
//   const [color, setColor] = useState("#ff0000");
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const [historyPointer, setHistoryPointer] = useState(-1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const maskCanvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const isDrawing = useRef(false);
//   const lastPoint = useRef<Point | null>(null);

//   const colorPresets = useMemo(
//     () => [
//       "#FF0000",
//       "#00FF00",
//       "#0000FF",
//       "#FFFF00",
//       "#FF00FF",
//       "#00FFFF",
//       "#000000",
//       "#FFFFFF",
//     ],
//     []
//   );

//   const BRUSH_SIZE = 40;

//   const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.onload = () => resolve(img);
//       img.onerror = reject;
//       img.src = src;
//     });
//   }, []);

//   const saveState = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     setHistory((prev) => [...prev.slice(0, historyPointer + 1), newState]);
//     setHistoryPointer((prev) => prev + 1);
//   }, [historyPointer]);

//   const loadImages = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const mainImage = await loadImage("/coloring/coloringHappy.png");
//       //   const maskImage = await loadImage("/coloring/coloringHappy.png");

//       if (!canvasRef.current || !maskCanvasRef.current) return;

//       const canvas = canvasRef.current;
//       const maskCanvas = maskCanvasRef.current;
//       const ctx = canvas.getContext("2d");
//       const maskCtx = maskCanvas.getContext("2d");

//       if (!ctx || !maskCtx) throw new Error("Canvas context not available");

//       // Set canvas dimensions
//       canvas.width = mainImage.width;
//       canvas.height = mainImage.height;
//       maskCanvas.width = mainImage.width;
//       maskCanvas.height = mainImage.height;

//       // Draw images
//       ctx.drawImage(mainImage, 0, 0);
//       maskCtx.drawImage(maskImage, 0, 0);

//       // Save initial state
//       const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       setHistory([initialData]);
//       setHistoryPointer(0);
//     } catch (err) {
//       setError("Failed to load images. Please try again later.");
//       console.error("Image loading error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [loadImage]);

//   const getCanvasCoordinates = (clientX: number, clientY: number): Point => {
//     const canvas = canvasRef.current;
//     if (!canvas) return { x: 0, y: 0 };

//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: clientX - rect.left,
//       y: clientY - rect.top,
//     };
//   };

//   const floodFill = useCallback(
//     (x: number, y: number, newColor: string) => {
//       const canvas = canvasRef.current;
//       const maskCanvas = maskCanvasRef.current;
//       if (!canvas || !maskCanvas) return;

//       const ctx = canvas.getContext("2d");
//       const maskCtx = maskCanvas.getContext("2d");
//       if (!ctx || !maskCtx) return;

//       // Convert new color to RGB
//       const hex = newColor.replace("#", "");
//       const r = parseInt(hex.substring(0, 2), 16);
//       const g = parseInt(hex.substring(2, 4), 16);
//       const b = parseInt(hex.substring(4, 6), 16);

//       // Get mask color at clicked position
//       const maskPixel = maskCtx.getImageData(x, y, 1, 1).data;
//       const targetColor = `rgb(${maskPixel[0]},${maskPixel[1]},${maskPixel[2]})`;

//       // Flood fill algorithm
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const pixels = imageData.data;
//       const queue: Point[] = [{ x, y }];
//       const visited = new Uint8Array(canvas.width * canvas.height);

//       while (queue.length > 0) {
//         const point = queue.pop()!;
//         const idx = (point.y * canvas.width + point.x) * 4;

//         if (point.x < 0 || point.x >= canvas.width) continue;
//         if (point.y < 0 || point.y >= canvas.height) continue;
//         if (visited[point.y * canvas.width + point.x]) continue;

//         const currentMask = maskCtx.getImageData(point.x, point.y, 1, 1).data;
//         const currentColor = `rgb(${currentMask[0]},${currentMask[1]},${currentMask[2]})`;

//         if (currentColor === targetColor) {
//           pixels[idx] = r;
//           pixels[idx + 1] = g;
//           pixels[idx + 2] = b;
//           pixels[idx + 3] = 255;
//           visited[point.y * canvas.width + point.x] = 1;

//           queue.push(
//             { x: point.x + 1, y: point.y },
//             { x: point.x - 1, y: point.y },
//             { x: point.x, y: point.y + 1 },
//             { x: point.x, y: point.y - 1 }
//           );
//         }
//       }

//       ctx.putImageData(imageData, 0, 0);
//       saveState();
//     },
//     [saveState]
//   );

//   const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
//     isDrawing.current = true;
//     const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
//     const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
//     const { x, y } = getCanvasCoordinates(clientX, clientY);
//     floodFill(Math.round(x), Math.round(y), color);
//   };

//   const handleReset = useCallback(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext("2d");
//     if (!ctx || history.length === 0) return;

//     ctx.putImageData(history[0], 0, 0);
//     setHistory([history[0]]);
//     setHistoryPointer(0);
//   }, [history]);

//   useEffect(() => {
//     loadImages();
//   }, [loadImages]);

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <p className={styles.errorText}>{error}</p>
//         <button onClick={loadImages} className={styles.button}>
//           🔄 Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.page}>
//       <h1 className={styles.heading}>🎨 Color the Image</h1>

//       <div className={styles.controls}>
//         <div className={styles.colorPickerContainer}>
//           <label className={styles.colorPickerLabel}>
//             Choose color:
//             <input
//               type="color"
//               value={color}
//               onChange={(e) => setColor(e.target.value)}
//               className={styles.colorPicker}
//             />
//           </label>
//           <div className={styles.colorPresets}>
//             {colorPresets.map((preset) => (
//               <button
//                 key={preset}
//                 className={styles.colorPreset}
//                 style={{ backgroundColor: preset }}
//                 onClick={() => setColor(preset)}
//               />
//             ))}
//           </div>
//         </div>

//         <button onClick={handleReset} className={styles.button}>
//           🔄 Reset
//         </button>
//       </div>

//       <div ref={containerRef} className={styles.canvasContainer}>
//         {isLoading ? (
//           <div className={styles.loadingContainer}>
//             <div className={styles.loadingSpinner} />
//           </div>
//         ) : (
//           <>
//             <canvas
//               ref={canvasRef}
//               className={styles.mainCanvas}
//               onMouseDown={handleStart}
//               onTouchStart={handleStart}
//             />
//             <canvas ref={maskCanvasRef} className={styles.maskCanvas} />
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
