'use client';

import { ReactNode } from 'react';
import Button from './ui/Button';
import Icon, { IconName } from './ui/Icon';

interface EmptyStateProps {
  icon?: ReactNode | IconName | string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: IconName;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'error' | 'warning' | 'info';
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  const variantStyles = {
    default: 'bg-neutral-50 border-neutral-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const iconSize = 'text-7xl md:text-8xl';

  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      // Check if it's a valid IconName
      const validIconNames: IconName[] = ['users', 'camera', 'search', 'alertTriangle', 'alert', 'info', 'heart', 'brain', 'globe', 'help'];
      if (validIconNames.includes(icon as IconName)) {
        return (
          <div className="mb-6 animate-bounce-in flex justify-center" style={{ animationDelay: '0.1s' }}>
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icon name={icon as IconName} size={40} className="text-neutral-400" />
            </div>
          </div>
        );
      }

      // Legacy emoji support (for backward compatibility)
      const iconMap: Record<string, IconName> = {
        '👨‍👩‍👧‍👦': 'users',
        '📷': 'camera',
        '🔍': 'search',
        '🚫📷': 'alertTriangle',
        '⚠️': 'alertTriangle',
      };

      const iconName = iconMap[icon];
      if (iconName) {
        return (
          <div className="mb-6 animate-bounce-in flex justify-center" style={{ animationDelay: '0.1s' }}>
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
              <Icon name={iconName} size={40} className="text-neutral-400" />
            </div>
          </div>
        );
      }

      // Fallback for other strings (shouldn't happen)
      return null;
    }

    return (
      <div className="mb-6 animate-bounce-in flex justify-center" style={{ animationDelay: '0.1s' }}>
        {icon}
      </div>
    );
  };

  return (
    <div
      className={`
        rounded-2xl border-2 p-8 md:p-12 text-center
        animate-fade-in-up
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {renderIcon()}

      <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {title}
      </h3>

      <p className="text-base text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              variant="primary"
              size="lg"
              icon={primaryAction.icon}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Predefined empty state variations
export function NoFamilyMembersEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon="users"
      title="No family members yet"
      description="Add your first family member to get started with face recognition"
      primaryAction={{
        label: 'Add Family Member',
        onClick: onAdd,
        icon: 'plus',
      }}
    />
  );
}

export function NoRecognitionHistoryEmptyState({ onOpenCamera }: { onOpenCamera: () => void }) {
  return (
    <EmptyState
      icon="camera"
      title="No recognitions yet"
      description="Use the camera to recognize someone and see their information here"
      primaryAction={{
        label: 'Open Camera',
        onClick: onOpenCamera,
        icon: 'camera',
      }}
    />
  );
}

export function NoSearchResultsEmptyState({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : 'Try a different search term'}
      variant="info"
    />
  );
}

// Error state variations
export function CameraPermissionErrorState({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <EmptyState
      icon="alertTriangle"
      title="Camera access needed"
      description="Please allow camera access in your browser settings to recognize faces"
      primaryAction={{
        label: 'Open Settings',
        onClick: onOpenSettings,
        icon: 'settings',
      }}
      variant="error"
    />
  );
}

export function NetworkErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="globe"
      title="Connection lost"
      description="Check your internet connection and try again"
      primaryAction={{
        label: 'Try Again',
        onClick: onRetry,
        icon: 'refresh',
      }}
      variant="error"
    />
  );
}

export function RecognitionFailedState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon="help"
      title="Couldn't recognize"
      description="Try better lighting, a different angle, or make sure the person is facing the camera"
      primaryAction={{
        label: 'Try Again',
        onClick: onRetry,
        icon: 'refresh',
      }}
      variant="warning"
    />
  );
}

// Generic error state
export function GenericErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="alertTriangle"
      title={title}
      description={description}
      primaryAction={
        onRetry
          ? {
            label: 'Try Again',
            onClick: onRetry,
            icon: 'refresh',
          }
          : undefined
      }
      variant="error"
    />
  );
}



