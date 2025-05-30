import React from 'react';

interface LayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {sidebar && (
        <aside className="w-64 bg-white p-4 shadow-md print:hidden"> 
          {/* Added print:hidden as sidebars are usually not for printing */}
          {sidebar}
        </aside>
      )}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
