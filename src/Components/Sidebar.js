import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaDollarSign, FaCog, FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  

  return (
    <div className="h-screen bg-blue-900 text-white p-4">
      {/* Mobile Toggle Button (Hamburger Icon or Close Icon) */}
      <button onClick={toggleSidebar} className="sm:hidden text-white mb-4 p-2">
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar for Desktop and Mobile */}
      <div className={`w-48 ${isOpen ? "block" : "hidden"} sm:block`}>
        <h1 className="text-2xl font-bold mb-6">PG Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <NavLink
              to={isAuthenticated ? "/" : "/login"}
              className="flex items-center space-x-2 hover:text-blue-300 active:bg-blue-700"
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={isAuthenticated ? "/bookings" : "/login"}
              className="flex items-center space-x-2 hover:text-blue-300 active:bg-blue-700"
            >
              <FaClipboardList />
              <span>Bookings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={isAuthenticated ? "/revenue" : "/login"}
              className="flex items-center space-x-2 hover:text-blue-300 active:bg-blue-700"
            >
              <FaDollarSign />
              <span>Revenue</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={isAuthenticated ? "/settings" : "/login"}
              className="flex items-center space-x-2 hover:text-blue-300 active:bg-blue-700"
            >
              <FaCog />
              <span>Rooms Setup</span>
            </NavLink>
          </li>
        </ul>

       
      </div>
    </div>
  );
};

export default Sidebar;
