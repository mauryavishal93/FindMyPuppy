import React from 'react';

/**
 * Standardized Modal Design System
 * 
 * All modals should follow these standards:
 * - Z-index: z-[100] with inline style zIndex: 9999 for backdrop
 * - Backdrop: bg-black/60 backdrop-blur-sm
 * - Positioning: fixed inset-0
 * - Close button: Red, top-right, w-11 h-11 on mobile, w-9 h-9 on desktop
 * - Header: Fixed, flex-shrink-0, with padding for close button
 * - Content: Scrollable, flex-1 overflow-y-auto
 * - Border radius: rounded-[2rem]
 * - Max width: max-w-md (default), can be overridden
 * - Max height: max-h-[90vh]
 * - Border: border-4 border-white
 */

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  showCloseButton?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full'
};

export const ModalBase: React.FC<ModalBaseProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'md',
  showCloseButton = true,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`bg-white rounded-[2rem] w-full ${maxWidthClasses[maxWidth]} shadow-2xl relative border-4 border-white overflow-hidden flex flex-col max-h-[90vh] ${className}`}
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-2 sm:right-2 w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-xl active:scale-95 z-50"
            aria-label="Close"
            style={{ 
              zIndex: 10001,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 0 3px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.3)' 
            }}
          >
            <i className="fas fa-times text-xl sm:text-lg font-black"></i>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex-shrink-0 relative p-4 pb-3 border-b border-slate-200 pr-16 sm:pr-14 ${className}`}>
      {children}
    </div>
  );
};

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 min-h-0 ${className}`}>
      {children}
    </div>
  );
};

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex-shrink-0 p-4 border-t border-slate-200 ${className}`}>
      {children}
    </div>
  );
};
