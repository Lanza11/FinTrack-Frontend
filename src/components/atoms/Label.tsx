import type { ComponentProps } from 'react';

interface LabelProps extends ComponentProps<'label'> {}

export const Label = ({ children, className = '', ...props }: LabelProps) => {
  return (
    <label className={`block text-sm font-medium text-gray-600 mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
};
