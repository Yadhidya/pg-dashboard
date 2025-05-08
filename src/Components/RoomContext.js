import React, { createContext, useState, useContext } from "react";

const RoomContext = createContext();


export const useRoomContext = () => {
  return useContext(RoomContext);
};

export const RoomProvider = ({ children }) => {
  
  const [floors, setFloors] = useState([
    { number: 1 },
    { number: 2 },
  ]);
  const [rooms, setRooms] = useState([
    { name: "101", floor: 1, type: "single", price: 5000, capacity: 1 },
    { name: "102", floor: 1, type: "double", price: 6000, capacity: 2 },
    { name: "201", floor: 2, type: "triple", price: 7000, capacity: 3 },
  ]);
  const [bookings, setBookings] = useState([]); 

  
  const addBooking = (booking) => {
    setBookings((prevBookings) => [...prevBookings, booking]);
  };

  return (
    <RoomContext.Provider value={{ rooms, setRooms, floors, setFloors, bookings, addBooking }}>
      {children}
    </RoomContext.Provider>
  );
};
