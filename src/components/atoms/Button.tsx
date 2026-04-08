import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-md transition-all h-11 font-semibold flex items-center justify-center';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:opacity-50',
      secondary: 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    };

    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
