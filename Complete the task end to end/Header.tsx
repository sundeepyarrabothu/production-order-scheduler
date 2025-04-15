import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive 
          ? 'bg-blue-700 text-white' 
          : 'text-gray-300 hover:bg-blue-600 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">Production Order Scheduler</span>
            </div>
            <nav className="ml-10 flex items-center space-x-4">
              <NavLink href="/">Dashboard</NavLink>
              <NavLink href="/orders">Orders</NavLink>
              <NavLink href="/resources">Resources</NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
