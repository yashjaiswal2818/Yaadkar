'use client';

import { ReactNode, forwardRef } from 'react';
import Icon, { IconName } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseClass = `btn btn-${variant} btn-${size}`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseClass} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Icon name="loader" className="animate-spin" size={size === 'sm' ? 16 : 20} />
      ) : icon && iconPosition === 'left' ? (
        <Icon name={icon} size={size === 'sm' ? 16 : 20} />
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <Icon name={icon} size={size === 'sm' ? 16 : 20} />
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;



