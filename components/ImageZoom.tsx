import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomProps {
  images: string[];
  activeIndex: number;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.5;

const ImageZoom: React.FC<ImageZoomProps> = ({ images, activeIndex, alt, isOpen, onClose, onIndexChange }) => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => {
    setScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE));
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - ZOOM_STEP, MIN_SCALE);
    setScale(newScale);
    if (newScale === 1) setTranslate({ x: 0, y: 0 });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setScale(s => {
      const next = Math.max(MIN_SCALE, Math.min(s + delta, MAX_SCALE));
      if (next === 1) setTranslate({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    translateStart.current = { ...translate };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [scale, translate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const goTo = useCallback((dir: -1 | 1) => {
    resetZoom();
    const next = (activeIndex + dir + images.length) % images.length;
    onIndexChange(next);
  }, [activeIndex, images.length, onIndexChange, resetZoom]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(-1);
      if (e.key === 'ArrowRight') goTo(1);
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, goTo]);

  useEffect(() => {
    if (!isOpen) resetZoom();
  }, [isOpen, resetZoom]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget && scale <= 1) onClose(); }}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleZoomOut}
              disabled={scale <= MIN_SCALE}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white/60 text-xs brand-font min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= MAX_SCALE}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors ml-2"
              aria-label="Close zoom"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => goTo(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            <img
              src={images[activeIndex]}
              alt={alt}
              className="max-w-[90vw] max-h-[85vh] object-contain select-none"
              style={{
                transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
              draggable={false}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={(e) => {
                if (scale <= 1) {
                  e.stopPropagation();
                  setScale(2);
                }
              }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { resetZoom(); onIndexChange(i); }}
                  className={`w-12 h-12 overflow-hidden border-2 transition-all ${
                    i === activeIndex ? 'border-sky-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageZoom;
