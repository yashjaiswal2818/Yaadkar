'use client';

import Icon from './Icon';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ 
  src, 
  alt = '', 
  name = '',
  size = 'md',
  className = '' 
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeClasses[size]} rounded-full object-cover bg-neutral-100 ${className}`}
      />
    );
  }

  if (name) {
    return (
      <div className={`
        ${sizeClasses[size]} 
        rounded-full bg-primary-100 text-primary-700 
        flex items-center justify-center font-semibold
        ${className}
      `}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={`
      ${sizeClasses[size]} 
      rounded-full bg-neutral-100 
      flex items-center justify-center text-neutral-400
      ${className}
    `}>
      <Icon name="user" size={size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : 24} />
    </div>
  );
}




