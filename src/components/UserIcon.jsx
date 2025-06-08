import React, { FC } from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface UserIconProps {
  size?: number;
  color?: string;
}

const UserIcon: FC<UserIconProps> = ({ size = 24, color = '#4a5568' }) => {
  return <FaUserCircle size={size} color={color} />;
};