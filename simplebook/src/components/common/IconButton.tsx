import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: 'default' | 'danger';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ariaLabel,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
    danger: 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
  };

  return (
    <button
      className={`
        p-2 rounded-lg
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${variantClasses[variant]}
        ${className}
      `}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
};
