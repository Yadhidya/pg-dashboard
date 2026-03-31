import { createContext, useState, useContext, useMemo } from "react";

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Add booking
  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  // Utility: calculate booking revenue
  const getBookingRevenue = (booking) =>
    booking.room.price * booking.numberOfPeople;

  // Utility: normalize date (remove time)
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Total Revenue
  const totalRevenue = useMemo(() => {
    return bookings.reduce((total, booking) => {
      return total + getBookingRevenue(booking);
    }, 0);
  }, [bookings]);

  // Today's Revenue
  const todayRevenue = useMemo(() => {
    const today = normalizeDate(new Date());

    return bookings.reduce((total, booking) => {
      const bookingDate = normalizeDate(booking.bookingDate);

      if (bookingDate.getTime() === today.getTime()) {
        total += getBookingRevenue(booking);
      }

      return total;
    }, 0);
  }, [bookings]);

  // Weekly Revenue
  const weeklyRevenue = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return bookings.reduce((total, booking) => {
      const bookingDate = new Date(booking.bookingDate);

      if (bookingDate >= startOfWeek && bookingDate <= endOfWeek) {
        total += getBookingRevenue(booking);
      }

      return total;
    }, 0);
  }, [bookings]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        totalRevenue,
        todayRevenue,
        weeklyRevenue,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
