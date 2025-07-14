import React from 'react';
import { FaBell, FaRegCommentAlt, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-blue-500 rounded mr-3"></div>
        <h1 className="text-xl font-bold text-gray-800">Galvaware</h1>
      </div>
      <div className="flex space-x-4">
        <button className="text-gray-600 hover:text-blue-500">
          <FaBell size={20} />
        </button>
        <button className="text-gray-600 hover:text-blue-500">
          <FaRegCommentAlt size={20} />
        </button>
        <button className="text-gray-600 hover:text-blue-500">
          <FaUserCircle size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;