import React, { useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (cropData: { x: number; y: number; width: number; height: number }) => void;
}

export function ImageCropper({ imageUrl, onCropComplete }: ImageCropperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [cropBox, setCropBox] = useState<DOMRect | null>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseDown(e: React.MouseEvent) {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPoint({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !startPoint || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);
    const left = Math.min(currentX, startPoint.x);
    const top = Math.min(currentY, startPoint.y);

    if (cropAreaRef.current) {
      cropAreaRef.current.style.left = `${left}px`;
      cropAreaRef.current.style.top = `${top}px`;
      cropAreaRef.current.style.width = `${width}px`;
      cropAreaRef.current.style.height = `${height}px`;
    }
  }

  function handleMouseUp() {
    if (isDragging && cropAreaRef.current) {
      const rect = cropAreaRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        const cropData = {
          x: (rect.left - containerRect.left) / containerRect.width,
          y: (rect.top - containerRect.top) / containerRect.height,
          width: rect.width / containerRect.width,
          height: rect.height / containerRect.height
        };
        onCropComplete(cropData);
      }
    }
    setIsDragging(false);
    setStartPoint(null);
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-96 bg-gray-100 cursor-crosshair overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        src={imageUrl}
        alt="Zu beschneidendes Bild"
        className="w-full h-full object-contain"
      />
      {isDragging && startPoint && (
        <div
          ref={cropAreaRef}
          className="absolute border-2 border-white bg-black bg-opacity-30"
        />
      )}
    </div>
  );
}
