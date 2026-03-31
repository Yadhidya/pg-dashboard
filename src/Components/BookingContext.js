import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
} from "react";

const BookingContext = createContext();

export const useBookingContext = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookingContext must be used inside BookingProvider");
  }

  return context;
};

/* ---------------- Reducer ---------------- */

const bookingReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BOOKING":
      return [...state, action.payload];

    case "DELETE_BOOKING":
      return state.filter((booking) => booking.id !== action.payload);

    case "UPDATE_BOOKING":
      return state.map((booking) =>
        booking.id === action.payload.id ? action.payload : booking
      );

    default:
      return state;
  }
};

/* ---------------- Utilities ---------------- */

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getBookingRevenue = (booking) =>
  booking.room.price * booking.numberOfPeople;

/* ---------------- Provider ---------------- */

export const BookingProvider = ({ children }) => {
  const [bookings, dispatch] = useReducer(
    bookingReducer,
    [],
    () => JSON.parse(localStorage.getItem("bookings")) || []
  );

  /* Persist bookings */
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  /* Actions */

  const addBooking = (booking) => {
    dispatch({ type: "ADD_BOOKING", payload: booking });
  };

  const deleteBooking = (id) => {
    dispatch({ type: "DELETE_BOOKING", payload: id });
  };

  const updateBooking = (booking) => {
    dispatch({ type: "UPDATE_BOOKING", payload: booking });
  };

  /* ---------------- Revenue Calculations ---------------- */

  const totalRevenue = useMemo(() => {
    return bookings.reduce((total, booking) => {
      return total + getBookingRevenue(booking);
    }, 0);
  }, [bookings]);

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

  const monthlyRevenue = useMemo(() => {
    const today = new Date();

    return bookings.reduce((total, booking) => {
      const bookingDate = new Date(booking.bookingDate);

      if (
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()
      ) {
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
        deleteBooking,
        updateBooking,
        totalRevenue,
        todayRevenue,
        weeklyRevenue,
        monthlyRevenue,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
