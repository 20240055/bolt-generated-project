import React, { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (cropData: { x: number; y: number; width: number; height: number }) => void;
  initialCrop?: { x: number; y: number; width: number; height: number };
}

export function ImageCropper({ imageUrl, onCropComplete, initialCrop }: ImageCropperProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialCropData = initialCrop || { x: 0.5, y: 0.5, width: 0.5, height: 0.5 };

  useEffect(() => {
    if (containerRef.current && cropAreaRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const cropWidth = containerRect.width * initialCropData.width;
      const cropHeight = containerRect.height * initialCropData.height;
      const cropLeft = containerRect.width * initialCropData.x - cropWidth / 2;
      const cropTop = containerRect.height * initialCropData.y - cropHeight / 2;

      cropAreaRef.current.style.left = `${cropLeft}px`;
      cropAreaRef.current.style.top = `${cropTop}px`;
      cropAreaRef.current.style.width = `${cropWidth}px`;
      cropAreaRef.current.style.height = `${cropHeight}px`;
    }
  }, [initialCropData]);

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setIsDragging(true);
    if (cropAreaRef.current) {
      setOffset({
        x: e.clientX - cropAreaRef.current.offsetLeft,
        y: e.clientY - cropAreaRef.current.offsetTop,
      });
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !cropAreaRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let newLeft = e.clientX - offset.x;
    let newTop = e.clientY - offset.y;

    // Keep the cropping box within the container bounds
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - cropAreaRef.current.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, containerRect.height - cropAreaRef.current.offsetHeight));

    cropAreaRef.current.style.left = `${newLeft}px`;
    cropAreaRef.current.style.top = `${newTop}px`;
  }

  function handleMouseUp() {
    if (isDragging && cropAreaRef.current && containerRef.current) {
      const rect = cropAreaRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const cropData = {
        x: (rect.left - containerRect.left) / containerRect.width,
        y: (rect.top - containerRect.top) / containerRect.height,
        width: cropAreaRef.current.offsetWidth / containerRect.width,
        height: cropAreaRef.current.offsetHeight / containerRect.height,
      };
      onCropComplete(cropData);
    }
    setIsDragging(false);
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 bg-gray-100 cursor-move overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img src={imageUrl} alt="Zu beschneidendes Bild" className="w-full h-full object-contain" />
      <div
        ref={cropAreaRef}
        className="absolute border-2 border-white bg-black bg-opacity-30"
      />
    </div>
  );
}
