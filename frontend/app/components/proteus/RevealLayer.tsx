'use client';

import React, { useEffect, useRef, useState } from 'react';

export const SPOTLIGHT_R = 260;

export interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
  className?: string;
  children?: React.ReactNode;
}

export default function RevealLayer({
  image,
  cursorX,
  cursorY,
  className = '',
  children
}: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string>('');

  // Manage canvas sizing with viewport resize listener
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Update canvas mask whenever smoothed cursor coordinates change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width || window.innerWidth;
    const height = canvas.height || window.innerHeight;

    // Clear previous mask frame
    ctx.clearRect(0, 0, width, height);

    // Only render spotlight when cursor is inside or near viewport
    if (cursorX > -SPOTLIGHT_R && cursorY > -SPOTLIGHT_R && cursorX < width + SPOTLIGHT_R && cursorY < height + SPOTLIGHT_R) {
      const gradient = ctx.createRadialGradient(
        cursorX,
        cursorY,
        0,
        cursorX,
        cursorY,
        SPOTLIGHT_R
      );

      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
      gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();
    }

    setMaskDataUrl(canvas.toDataURL());
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Hidden offscreen canvas for soft radial alpha mask generation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Layer 2: Protein Detail Reveal Layer */}
      <div
        className={`absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none ${className}`}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          maskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none',
          WebkitMaskImage: maskDataUrl ? `url(${maskDataUrl})` : 'none',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transition: 'opacity 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </>
  );
}
