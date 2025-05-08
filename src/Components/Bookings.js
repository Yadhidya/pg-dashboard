import React, { useState, useEffect } from "react";
import { useRoomContext } from "./RoomContext";
import { useBookingContext } from "./BookingContext";

const Bookings = () => {
  const { rooms, floors } = useRoomContext();
  const { addBooking } = useBookingContext();

  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    customerName: "",
    bookingDate: "",
    phoneNumber: "",
    numberOfPeople: 1,
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Load bookings from localStorage on mount
  useEffect(() => {
    const storedBookings = localStorage.getItem("pg-bookings");
    if (storedBookings) {
      const parsed = JSON.parse(storedBookings);
      parsed.forEach((b) => {
        b.bookingDate = new Date(b.bookingDate);
      });
      setBookings(parsed);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBooking = () => {
    const { customerName, bookingDate, phoneNumber } = bookingDetails;

    if (!customerName || !bookingDate || !selectedRoom || !phoneNumber) {
      setErrorMessage("All fields must be filled out.");
      return;
    }

    const existingBookings = bookings.filter(
      (b) => b.room.name === selectedRoom.name
    );
    const totalPeopleBooked = existingBookings.reduce(
      (sum, b) => sum + b.numberOfPeople,
      0
    );
    const seatsLeft = selectedRoom.capacity - totalPeopleBooked;

    if (seatsLeft < 1) {
      setErrorMessage("Room is fully booked.");
      return;
    }

    const newBooking = {
      ...bookingDetails,
      room: selectedRoom,
      bookingDate: new Date(bookingDate),
      numberOfPeople: 1,
    };

    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem("pg-bookings", JSON.stringify(updatedBookings));
    addBooking(newBooking);
    setErrorMessage("");
    resetForm();
  };

  const resetForm = () => {
    setBookingDetails({
      customerName: "",
      bookingDate: "",
      phoneNumber: "",
      numberOfPeople: 1,
    });
    setSelectedRoom(null);
  };

  const handleCancelBooking = (bookingToCancel) => {
    const updatedBookings = bookings.filter((booking) => booking !== bookingToCancel);
    setBookings(updatedBookings);
    localStorage.setItem("pg-bookings", JSON.stringify(updatedBookings));
  };

  const getAvailableRooms = (floorNumber) => {
    return rooms
      .filter((room) => room.floor === floorNumber)
      .filter((room) => {
        const totalPeopleBooked = bookings
          .filter((b) => b.room.name === room.name)
          .reduce((sum, b) => sum + b.numberOfPeople, 0);
        return totalPeopleBooked < room.capacity;
      });
  };

  const groupBookingsByFloor = () => {
    return bookings.reduce((grouped, booking) => {
      const floorNumber = booking.room.floor;
      if (!grouped[floorNumber]) {
        grouped[floorNumber] = [];
      }
      grouped[floorNumber].push(booking);
      return grouped;
    }, {});
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Room Booking</h2>

      <div className="bg-white shadow rounded p-5 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Book a Room</h3>

        <input
          type="text"
          name="customerName"
          value={bookingDetails.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          className="p-3 border rounded-md w-full mb-4"
        />

        <input
          type="date"
          name="bookingDate"
          value={bookingDetails.bookingDate}
          onChange={handleChange}
          className="p-3 border rounded-md w-full mb-4"
        />

        <input
          type="text"
          name="phoneNumber"
          value={bookingDetails.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-3 border rounded-md w-full mb-4"
        />

        <div className="mb-4">
          <label htmlFor="room" className="block text-gray-700">Select Room</label>
          <select
            name="room"
            value={selectedRoom?.name || ""}
            onChange={(e) => {
              const selected = rooms.find((r) => r.name === e.target.value);
              setSelectedRoom(selected || null);
            }}
            className="p-3 border rounded-md w-full"
          >
            <option value="">-- Select Room --</option>
            {floors.map((floor) => (
              <optgroup key={floor.number} label={`Floor ${floor.number}`}>
                {getAvailableRooms(floor.number).map((room) => {
                  const totalPeopleBooked = bookings
                    .filter((b) => b.room.name === room.name)
                    .reduce((sum, b) => sum + b.numberOfPeople, 0);
                  const seatsLeft = room.capacity - totalPeopleBooked;

                  return (
                    <option key={room.name} value={room.name}>
                      {room.name} - {room.type} - ₹{room.price} - {seatsLeft} seats left
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </div>

        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}

        <button
          onClick={handleSubmitBooking}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Book Room
        </button>
      </div>

      <div className="bg-white shadow rounded p-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Booked Rooms</h3>
        {bookings.length > 0 ? (
          Object.keys(groupBookingsByFloor()).map((floorNumber) => (
            <div key={floorNumber}>
              <h4 className="text-lg font-semibold mb-3">Floor {floorNumber}</h4>
              <table className="w-full table-auto text-left bg-white rounded mb-6">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Customer Name</th>
                    <th className="px-4 py-2">Room</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Phone Number</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupBookingsByFloor()[floorNumber].map((booking, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{booking.customerName}</td>
                      <td className="px-4 py-2">{booking.room.name}</td>
                      <td className="px-4 py-2">{booking.bookingDate.toLocaleDateString()}</td>
                      <td className="px-4 py-2">{booking.phoneNumber}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
