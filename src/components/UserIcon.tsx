// components/UserIcon.tsx
import React from 'react';

interface UserIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const UserIcon: React.FC<UserIconProps> = ({
  size = 24,
  color = 'currentColor',
  className = ''
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`user-icon ${className}`}
      aria-label="Ícone de usuário"
      role="img"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
};

export default UserIcon;