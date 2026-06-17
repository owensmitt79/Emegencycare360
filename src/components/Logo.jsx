'use client';
import React, { useEffect, useRef } from 'react';

const Logo = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const img = new Image();
    img.src = '/api/logo';
    // Removed crossOrigin as it can block same-origin requests without explicit headers
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

        // Remove white and light-gray background to eliminate halos
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Use the minimum of RGB to detect grays/whites
          const minColor = Math.min(r, g, b);
          
          if (minColor > 190) {
            // Map minColor from 190 to 255 into alpha from 255 to 0
            const alpha = Math.max(0, 255 - ((minColor - 190) * (255 / 65)));
            data[i + 3] = Math.min(data[i + 3], alpha);
          }
          
          // Track bounding box for visible pixels (alpha > 10)
          if (data[i + 3] > 10) {
            const pixelIndex = i / 4;
            const x = pixelIndex % canvas.width;
            const y = Math.floor(pixelIndex / canvas.width);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
        ctx.putImageData(imageData, 0, 0);

        // Crop canvas to the exact bounding box of the logo
        if (maxX >= minX && maxY >= minY) {
          // Add a tiny bit of padding (e.g., 2 pixels) to prevent harsh clipping
          const padding = 2;
          minX = Math.max(0, minX - padding);
          minY = Math.max(0, minY - padding);
          maxX = Math.min(canvas.width - 1, maxX + padding);
          maxY = Math.min(canvas.height - 1, maxY + padding);

          const cropWidth = maxX - minX + 1;
          const cropHeight = maxY - minY + 1;
          
          const croppedImageData = ctx.getImageData(minX, minY, cropWidth, cropHeight);
          
          // Resize main canvas (this clears it automatically)
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          
          // Put the cropped image data back
          ctx.putImageData(croppedImageData, 0, 0);
        }
      } catch (e) {
        console.error("Canvas image processing error:", e);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ objectFit: 'contain' }} />;
};

export default Logo;
