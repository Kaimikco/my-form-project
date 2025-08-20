"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

// Tailwind variants for the sidebar using tailwind-variants
const sidebarVariants = tv({
  base: "relative bg-white border-gray-200 select-none h-full",
  variants: {
    position: {
      left: "border-r",
      right: "border-l",
    },
    state: {
      expanded: "transition-all duration-200 ease-in-out",
      collapsed: "transition-all duration-200 ease-in-out",
      dragging: "transition-none",
    },
    variant: {
      default: "bg-white",
    }
  },
  defaultVariants: {
    position: "left",
    state: "expanded",
    variant: "default",
  },
});

// Variants for the drag handle
const dragHandleVariants = tv({
  base: "absolute top-0 w-2 h-full bg-transparent hover:bg-blue-500/20 cursor-col-resize group transition-colors duration-150 z-10 flex items-center justify-center",
  variants: {
    position: {
      left: "right-0",
      right: "left-0",
    },
    dragging: {
      true: "bg-blue-500/30",
      false: "",
    }
  },
  defaultVariants: {
    position: "left",
    dragging: false,
  },
});

// Variants for the expand/collapse button
const toggleButtonVariants = tv({
  base: "absolute top-1/2 -translate-y-1/2 w-6 h-12 rounded-md shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center cursor-pointer z-20 border",
  variants: {
    position: {
      left: "right-0 translate-x-1/2",
      right: "left-0 -translate-x-1/2",
    },
    variant: {
      default: "bg-white border-gray-200 hover:bg-gray-50",
    }
  },
  defaultVariants: {
    position: "left",
    variant: "default",
  },
});

interface ResizeProps extends VariantProps<typeof sidebarVariants> {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  className?: string;
}

export const Resize: React.FC<ResizeProps> = ({
  children,
  minWidth = 200,
  maxWidth = 600,
  defaultWidth = 300,
  onWidthChange,
  position = "left",
  variant = "default",
  className = "",
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultWidth <= minWidth);
  const [isAnimating, setIsAnimating] = useState(false);
  const startWidthRef = useRef(width);
  const startXRef = useRef(0);

  // Clamp width to min/max bounds
  const clampWidth = useCallback((newWidth: number) => {
    return Math.max(minWidth, Math.min(maxWidth, newWidth));
  }, [minWidth, maxWidth]);

  // Update width and trigger callback
  const updateWidth = useCallback((newWidth: number, animate = false) => {
    const clampedWidth = clampWidth(newWidth);
    
    if (animate) {
      setIsAnimating(true);
      // Clear animation state after transition completes
      setTimeout(() => setIsAnimating(false), 200);
    }
    
    setWidth(clampedWidth);
    // Always update collapsed state based on actual width
    setIsCollapsed(clampedWidth <= minWidth);
    onWidthChange?.(clampedWidth);
  }, [clampWidth, minWidth, onWidthChange]);

  // Helper to get clientX from mouse or touch event
  const getClientX = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): number => {
    if ('touches' in e) {
      // TypeScript now knows this is a TouchEvent
      return e.touches[0]?.clientX || 0;
    }
    // TypeScript now knows this is a MouseEvent
    return e.clientX;
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startWidthRef.current = width;
    startXRef.current = getClientX(e);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [width, getClientX]);

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = getClientX(e);
    const deltaX = position === 'left' 
      ? clientX - startXRef.current 
      : startXRef.current - clientX;
    
    const newWidth = startWidthRef.current + deltaX;
    updateWidth(newWidth);
  }, [isDragging, position, updateWidth, getClientX]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  // Mouse and touch event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e);
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault(); // Prevent scrolling
        handleDragMove(e);
      };
      const handleMouseUp = () => handleDragEnd();
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle expand/collapse toggle
  const handleToggle = useCallback(() => {
    // Prevent multiple clicks during animation
    if (isAnimating) return;
    
    // Simple logic: if at minWidth, expand to maxWidth, otherwise collapse to minWidth
    const currentlyCollapsed = width <= minWidth;
    const newWidth = currentlyCollapsed ? maxWidth : minWidth;
    
    updateWidth(newWidth, true);
  }, [width, minWidth, defaultWidth, updateWidth, isAnimating]);

  // Keyboard support for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const direction = e.key === 'ArrowLeft' ? -10 : 10;
      const adjustedDirection = position === 'left' ? direction : -direction;
      updateWidth(width + adjustedDirection);
    }
  }, [width, position, updateWidth]);

  const currentState = isDragging ? 'dragging' : (isAnimating ? 'expanded' : (isCollapsed ? 'collapsed' : 'expanded'));

  return (
    <div
      className={sidebarVariants({ position, state: currentState, variant, className })}
      style={{ 
        width: `${width}px`, 
        minWidth: `${width}px`, 
        maxWidth: `${width}px`
      }}
    >
      {/* Content */}
      <div className="h-full overflow-hidden">
        {children}
      </div>

      {/* Drag Handle */}
      <div
        className={dragHandleVariants({ position, dragging: isDragging })}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="separator"
        aria-label="Resize sidebar"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Drag handle visual indicator */}
        <div className="opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
      </div>

      {/* Expand/Collapse Toggle Button */}
      <button
        className={toggleButtonVariants({ position, variant })}
        onClick={handleToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {position === 'left' ? (
          isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />
        ) : (
          isCollapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};