import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaQuoteLeft, FaClipboardList, FaCog } from 'react-icons/fa';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <aside className={`bg-gray-800 text-white h-full flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-lg font-semibold">Navigation</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-300 hover:text-white"
        >
          {/* Simple collapse icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <nav className="flex-grow">
        <ul className="space-y-2 p-2">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <FaHome className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Home</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/quotes"
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <FaQuoteLeft className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Quotes</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/jobs"
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <FaClipboardList className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Jobs</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <FaCog className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;