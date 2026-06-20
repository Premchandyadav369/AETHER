'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ProteinViewerProps {
  pdbId?: string;
  pdbData?: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  style?: 'cartoon' | 'stick' | 'sphere' | 'surface';
  colorBy?: 'chain' | 'b' | 'ss';
  className?: string;
}

export default function ProteinViewer({
  pdbId = '1M17', // Default EGFR
  pdbData,
  width = '100%',
  height = '100%',
  backgroundColor = 'rgba(0,0,0,0)',
  style = 'cartoon',
  colorBy = 'ss',
  className = ''
}: ProteinViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load 3Dmol.js
    const load3DMol = async () => {
      if (!(window as any).$3Dmol) {
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.5/3Dmol-min.js';
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    };

    load3DMol().then(() => {
      if (!containerRef.current || !(window as any).$3Dmol) return;
      
      const $3Dmol = (window as any).$3Dmol;
      const config = { backgroundColor: backgroundColor };
      
      if (!viewerRef.current) {
        viewerRef.current = $3Dmol.createViewer(containerRef.current, config);
      }
      
      const viewer = viewerRef.current;
      viewer.clear();

      const applyStyles = () => {
        let colorScheme;
        if (colorBy === 'ss') {
          colorScheme = { spectrum: 'sstype' };
        } else if (colorBy === 'chain') {
          colorScheme = { spectrum: 'chain' };
        } else if (colorBy === 'b') {
          colorScheme = { spectrum: 'b', min: 0, max: 100 }; // pLDDT roughly
        } else {
          colorScheme = { color: 'spectrum' };
        }

        if (style === 'cartoon') {
          viewer.setStyle({}, { cartoon: { colorscheme: colorScheme } });
          // Highlight heteroatoms (ligands) as sticks
          viewer.setStyle({ hetflag: true }, { stick: { colorscheme: 'greenCarbon' } });
        } else if (style === 'stick') {
          viewer.setStyle({}, { stick: { colorscheme: colorScheme } });
        } else if (style === 'sphere') {
          viewer.setStyle({}, { sphere: { colorscheme: colorScheme } });
        }

        viewer.zoomTo();
        viewer.render();
        setLoading(false);
      };

      if (pdbData) {
        viewer.addModel(pdbData, 'pdb');
        applyStyles();
      } else if (pdbId) {
        $3Dmol.download(`pdb:${pdbId}`, viewer, { doAssembly: true, noSecondaryStructure: false }, function() {
          applyStyles();
        });
      }
    });

    return () => {
      if (viewerRef.current) {
        // Clean up memory if needed
        viewerRef.current.clear();
      }
    };
  }, [pdbId, pdbData, style, colorBy, backgroundColor]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-aether-bg/50 backdrop-blur-sm z-10 rounded-xl">
          <div className="w-8 h-8 border-2 border-aether-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-[10px] text-aether-primary font-bold uppercase tracking-widest animate-pulse">Loading Structural Data</span>
        </div>
      )}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', position: 'relative' }} 
        className="rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}
