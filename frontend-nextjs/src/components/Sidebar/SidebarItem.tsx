import React from 'react';
import Link from 'next/link'; // Assuming Next.js Link component is available

interface SidebarItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  // Add isActive prop for more explicit active state styling if needed later
  // isActive?: boolean; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  label,
  icon,
  className = '',
  // isActive,
}) => {
  // Basic active state styling can be done via NavLink in Next.js or by checking router.pathname
  // For simplicity, only hover state is explicitly defined here.
  // const activeClasses = isActive ? 'bg-gray-200 text-blue-600' : 'hover:bg-gray-100';
  const baseClasses = 'flex items-center space-x-3 p-2 rounded-md text-gray-700 transition-colors duration-150';
  const hoverClasses = 'hover:bg-gray-200 hover:text-gray-900';

  return (
    <Link href={href} className={`${baseClasses} ${hoverClasses} ${className}`}>
      {icon && <span className="flex-shrink-0 w-5 h-5">{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

export default SidebarItem;
