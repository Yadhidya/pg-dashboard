import { createContext, useState, useContext } from "react";

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    setBookings((prevBookings) => [...prevBookings, booking]);
  };

  const calculateTotalRevenue = () => {
    return bookings.reduce(
      (total, booking) => total + booking.room.price * booking.numberOfPeople,
      0
    );
  };

  const getTodayDate = () => {
    const today = new Date();
    return new Date(today.setHours(0, 0, 0, 0)); 
  };

  const calculateTodayRevenue = () => {
    const today = getTodayDate();
    return bookings.reduce((total, booking) => {
      const bookingDate = new Date(booking.bookingDate); 
      if (bookingDate >= today) {
        total += booking.room.price * booking.numberOfPeople;
      }
      return total;
    }, 0);
  };

  const calculateWeeklyRevenue = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0); 

    const endOfWeek = new Date(today.setDate(today.getDate() + (6 - today.getDay())));
    endOfWeek.setHours(23, 59, 59, 999);

    return bookings.reduce((total, booking) => {
      const bookingDate = new Date(booking.bookingDate); 
      if (bookingDate >= startOfWeek && bookingDate <= endOfWeek) {
        total += booking.room.price * booking.numberOfPeople;
      }
      return total;
    }, 0);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        calculateTotalRevenue,
        calculateTodayRevenue,
        calculateWeeklyRevenue,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
