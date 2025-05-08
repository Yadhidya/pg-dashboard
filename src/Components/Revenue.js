import React, { useEffect, useState } from "react";
import { useBookingContext } from "./BookingContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Revenue = () => {
  const { bookings, calculateTotalRevenue, calculateTodayRevenue, calculateWeeklyRevenue } = useBookingContext(); 
  const [revenue, setRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRevenueData, setFilteredRevenueData] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  };

  const getDateWiseRevenue = (filtered) => {
    const revenueMap = {};
    filtered.forEach((booking) => {
      const dateKey = new Date(booking.bookingDate).toLocaleDateString("en-GB");
      const revenue = booking.room.price * booking.numberOfPeople;
      revenueMap[dateKey] = (revenueMap[dateKey] || 0) + revenue;
    });

    return Object.entries(revenueMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => {
        const [d1, m1, y1] = a.date.split("/").map(Number);
        const [d2, m2, y2] = b.date.split("/").map(Number);
        return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
      });
  };

  useEffect(() => {
    setLoading(true);

    setRevenue(calculateTotalRevenue()); 
    setTodayRevenue(calculateTodayRevenue()); 
    setWeeklyRevenue(calculateWeeklyRevenue()); 

    const filtered = bookings.filter((booking) => {
      if (!startDate || !endDate) return true;
      const bookingDate = new Date(booking.bookingDate);
      return (
        bookingDate >= new Date(startDate) &&
        bookingDate <= new Date(endDate + "T23:59:59")
      );
    });

    const sortedBookings = [...filtered].sort(
      (a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)
    );

    setFilteredBookings(sortedBookings);
    setFilteredRevenueData(getDateWiseRevenue(sortedBookings));
    setLoading(false);
  }, [bookings, startDate, endDate, calculateTotalRevenue, calculateTodayRevenue, calculateWeeklyRevenue]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Revenue Overview</h2>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : (
        <>
          {/* Revenue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow rounded p-5">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">₹{revenue.toFixed(2)}</p>
            </div>
            <div className="bg-white shadow rounded p-5">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Today's Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">₹{todayRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white shadow rounded p-5">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">This Week's Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">₹{weeklyRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-4 mb-8 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-3 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-3 py-1"
              />
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white shadow rounded p-5 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Details Table */}
          <div className="bg-white shadow rounded p-5">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Booking Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 text-left">Booking ID</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Room</th>
                    <th className="py-2 px-4 text-left">People</th>
                    <th className="py-2 px-4 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{booking.id || `B-${index + 1}`}</td>
                      <td className="py-2 px-4">
                        {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-2 px-4">{booking.room.name}</td>
                      <td className="py-2 px-4">{booking.numberOfPeople}</td>
                      <td className="py-2 px-4">
                        ₹{booking.room.price * booking.numberOfPeople}
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
                        No bookings found in selected range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Revenue;
