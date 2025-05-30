import React from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <nav className={`space-y-2 ${className}`}>
      {children}
    </nav>
  );
};

export default Sidebar;
