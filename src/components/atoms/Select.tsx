import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  error?: string;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, fullWidth = true, className = '', children, ...props }, ref) => {
    const errorStyles = error 
      ? 'border-red-500 ring-4 ring-red-500/20' 
      : 'border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        <select 
          ref={ref}
          className={`h-11 px-4 py-2 border rounded-md text-sm outline-none transition-all bg-white ${
            fullWidth ? 'w-full' : ''
          } ${errorStyles}`}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';