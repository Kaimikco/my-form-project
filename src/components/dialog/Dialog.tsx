'use client'

import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

// Dialog variants using Tailwind Variants with slots
const dialog = tv({
  base: "backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-transparent border-0 p-0 max-h-[80vh] overflow-auto m-0 max-w-[1920px]",
  variants: {
    size: {
      sm: "w-[30%]",
      md: "w-[50%]",
      lg: "w-[70%]",
      xl: "w-[90%]",
      full: "w-[90vw] max-w-4xl"
    },
    position: {
      center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      top: "top-[10%] left-1/2 -translate-x-1/2",
			bottom: "bottom-[10%] left-1/2 -translate-x-1/2 mt-auto"
    }
  },
  defaultVariants: {
    size: "md",
    position: "center"
  }
});

// Props interface with configuration options
interface DialogProps extends VariantProps<typeof dialog> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

// Ref interface to expose dialog methods
export interface DialogRef {
  showModal: () => void;
  close: () => void;
  isOpen: boolean;
}

// Main Dialog component
export const Dialog = forwardRef<DialogRef, DialogProps>(({
  children,
  open = false,
  onOpenChange,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  size,
  position,
  title,
  description,
  className,
  ...props
}, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Expose dialog methods via ref
  useImperativeHandle(ref, () => ({
    showModal: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
    isOpen: dialogRef.current?.open ?? false
  }));

  // Handle open state changes
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (open && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!open && dialogElement.open) {
      dialogElement.close();
    }
  }, [open]);

  // Handle close events and sync with React state
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    const handleClose = () => {
      onOpenChange?.(false);
    };

    const handleCancel = (e: Event) => {
      // This fires when escape is pressed
      if (!closeOnEscape) {
        e.preventDefault();
        return;
      }
      onOpenChange?.(false);
    };

    dialogElement.addEventListener('close', handleClose);
    dialogElement.addEventListener('cancel', handleCancel);

    return () => {
      dialogElement.removeEventListener('close', handleClose);
      dialogElement.removeEventListener('cancel', handleCancel);
    };
  }, [onOpenChange, closeOnEscape]);

  // Handle backdrop clicks
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdropClick) return;
    
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (e.target === dialogRef.current) {
        onOpenChange?.(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={dialog({size, position, className})}
      onClick={handleDialogClick}
      aria-labelledby={title ? "dialog-title" : undefined}
      aria-describedby={description ? "dialog-description" : undefined}
      {...props}
    >
        {children}
    </dialog>
  );
});

Dialog.displayName = "Dialog";

export const useDialog = (isInitiallyOpen: boolean = false) => {
    const [isOpen, setIsOpen] = useState<boolean>(isInitiallyOpen);

    return {
        isOpen,
        setIsOpen,
        close: () => setIsOpen(false),
        open: () => setIsOpen(true)
    }
}