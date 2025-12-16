'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface DraggableCardProps {
  children: ReactNode;
  initialX?: number;
  initialY?: number;
  className?: string;
}

export default function DraggableCard({ 
  children, 
  initialX, 
  initialY,
  className = '' 
}: DraggableCardProps) {
  // Set initial position only once on mount - don't update when props change
  const [position, setPosition] = useState(() => ({
    x: initialX ?? 0,
    y: initialY ?? 0
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (cardRef.current && e.touches.length > 0) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep card within viewport bounds
      const maxX = window.innerWidth - (cardRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (cardRef.current?.offsetHeight || 0);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling while dragging
        const newX = e.touches[0].clientX - dragOffset.x;
        const newY = e.touches[0].clientY - dragOffset.y;
        
        // Keep card within viewport bounds
        const maxX = window.innerWidth - (cardRef.current?.offsetWidth || 0);
        const maxY = window.innerHeight - (cardRef.current?.offsetHeight || 0);
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={cardRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
}

