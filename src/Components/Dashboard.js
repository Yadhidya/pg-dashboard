import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useBookingContext } from "./BookingContext";  

import Chart from "./Chart";  

const Dashboard = () => {
  const { bookings, calculateWeeklyRevenue } = useBookingContext(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.setItem("isAuthenticated", "false");
    
    window.location.reload();
  
    navigate("/login");
  };
  

  const handleOwnerDetails = () => {
    navigate("/owner-details");
  };

  const todaysBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.bookingDate);
    const today = new Date();
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const weeklyRevenue = calculateWeeklyRevenue();

  const revenueData = [
    { day: "Monday", revenue: 3000 },
    { day: "Tuesday", revenue: 2500 },
    { day: "Wednesday", revenue: 2000 },
    { day: "Thursday", revenue: 3500 },
    { day: "Friday", revenue: 3000 },
    { day: "Saturday", revenue: 1000 },
    { day: "Sunday", revenue: 1500 },
  ];

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="bg-white text-black shadow-md px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">PG Owner Dashboard</h2>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="focus:outline-none"
          >
            <FaUserCircle size={28} className="text-blue-900" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={handleOwnerDetails}
                className="block px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 w-full"
              >
                PG Owner Details
              </button>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 w-full"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="p-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl shadow text-blue-900">
            <h4 className="text-lg font-semibold">Today's Bookings</h4>
            <p className="text-3xl mt-2 font-bold">{todaysBookings}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow text-green-900">
            <h4 className="text-lg font-semibold">This Week's Revenue</h4>
            <p className="text-3xl mt-2 font-bold">₹{weeklyRevenue}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Weekly Revenue Chart</h3>
          <Chart data={revenueData} />
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue Breakdown</h3>
          <ul className="divide-y divide-gray-200">
            {revenueData.map((item) => (
              <li key={item.day} className="py-2 flex justify-between text-gray-700">
                <span>{item.day}</span>
                <span>₹{item.revenue}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
