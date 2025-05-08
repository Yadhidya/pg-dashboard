import React, { useState } from "react";
import { useRoomContext } from "./RoomContext";

const Settings = () => {
  const { floors, setFloors, rooms, setRooms } = useRoomContext();
  const [newFloor, setNewFloor] = useState("");
  const [newRoom, setNewRoom] = useState({
    name: "",
    floor: floors.length ? floors[0].number : 1,
    type: "single",
    price: "",
    capacity: 1,
  });
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);
  const [editingFloorIndex, setEditingFloorIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const roomTypeCapacity = {
    single: 1,
    double: 2,
    triple: 3,
    custom: null,
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" && value !== "custom") {
      setNewRoom((prev) => ({
        ...prev,
        [name]: value,
        capacity: roomTypeCapacity[value],
      }));
    } else {
      setNewRoom((prev) => ({
        ...prev,
        [name]: name === "price" || name === "capacity" || name === "floor" ? parseInt(value) : value,
      }));
    }
  };

  const isRoomNameDuplicate = (name) => {
    return rooms.some((room) => room.name.toLowerCase() === name.toLowerCase());
  };

  const addRoom = () => {
    if (!newRoom.name || !newRoom.price || !newRoom.capacity) {
      setErrorMessage("All fields must be filled out.");
      return;
    }

    if (isRoomNameDuplicate(newRoom.name)) {
      setErrorMessage("Room name already exists. Please choose a different name.");
      return;
    }

    if (editingRoomIndex !== null) {
      const updated = [...rooms];
      updated[editingRoomIndex] = newRoom;
      setRooms(updated);
      setEditingRoomIndex(null);
    } else {
      setRooms([...rooms, newRoom]);
    }

    resetRoomForm();
  };

  const resetRoomForm = () => {
    setNewRoom({
      name: "",
      floor: floors.length ? floors[0].number : 1,
      type: "single",
      price: "",
      capacity: 1,
    });
    setErrorMessage(""); 
  };

  const addFloor = () => {
    const floorNumber = parseInt(newFloor);
    if (!floorNumber || floors.find((f) => f.number === floorNumber)) return;

    const updated = [...floors];
    if (editingFloorIndex !== null) {
      updated[editingFloorIndex] = { number: floorNumber };
      setEditingFloorIndex(null);
    } else {
      updated.push({ number: floorNumber });
    }

    setFloors(updated.sort((a, b) => a.number - b.number));
    setNewFloor("");
  };

  const editRoom = (index) => {
    setNewRoom(rooms[index]);
    setEditingRoomIndex(index);
  };

  const deleteRoom = (index) => {
    const updated = [...rooms];
    updated.splice(index, 1);
    setRooms(updated);
  };

  const deleteFloor = (floorNumber) => {
    setFloors((prev) => prev.filter((f) => f.number !== floorNumber));
    setRooms((prev) => prev.filter((room) => room.floor !== floorNumber));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Room & Floor Setup</h2>

      {/* Floor Management */}
      <div className="mb-6 bg-white shadow rounded p-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Manage Floors</h3>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={newFloor}
            onChange={(e) => setNewFloor(e.target.value)}
            placeholder="Enter floor number"
            className="p-3 border rounded-md w-1/2"
          />
          <button
            onClick={addFloor}
            className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700"
          >
            Add Floor
          </button>
        </div>
      </div>

      {/* Room Management */}
      <div className="mb-6 bg-white shadow rounded p-5">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add / Edit Room</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newRoom.name}
            onChange={handleRoomChange}
            placeholder="Room Name"
            className="p-3 border rounded-md"
          />
          <select
            name="floor"
            value={newRoom.floor}
            onChange={handleRoomChange}
            className="p-3 border rounded-md"
          >
            {floors.map((f) => (
              <option key={f.number} value={f.number}>
                Floor {f.number}
              </option>
            ))}
          </select>
          <select
            name="type"
            value={newRoom.type}
            onChange={handleRoomChange}
            className="p-3 border rounded-md"
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
            <option value="custom">Custom</option>
          </select>
          <input
            type="number"
            name="price"
            value={newRoom.price}
            onChange={handleRoomChange}
            placeholder="Price"
            className="p-3 border rounded-md"
          />
          {newRoom.type === "custom" && (
            <input
              type="number"
              name="capacity"
              value={newRoom.capacity}
              onChange={handleRoomChange}
              placeholder="Capacity"
              className="p-3 border rounded-md"
            />
          )}
        </div>
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
        <button
          onClick={addRoom}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          {editingRoomIndex !== null ? "Update Room" : "Add Room"}
        </button>
      </div>

      {/* Floor-wise Room Display */}
      <div className="space-y-6">
        {floors.map((floor) => {
          const floorRooms = rooms.filter((room) => room.floor === floor.number);
          return (
            <div key={floor.number} className="bg-gray-100 p-5 rounded shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800">Floor {floor.number}</h4>
                <div className="space-x-3">
                  <button
                    onClick={() => deleteFloor(floor.number)}
                    className="text-red-600 hover:underline"
                  >
                    Delete Floor
                  </button>
                </div>
              </div>
              {floorRooms.length > 0 ? (
                <table className="w-full table-auto text-left bg-white rounded">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2">Room</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Capacity</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floorRooms.map((room, index) => (
                      <tr key={room.name}>
                        <td className="px-4 py-2">{room.name}</td>
                        <td className="px-4 py-2">{room.type}</td>
                        <td className="px-4 py-2">${room.price}</td>
                        <td className="px-4 py-2">{room.capacity}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => editRoom(index)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>{" "}
                          |{" "}
                          <button
                            onClick={() => deleteRoom(index)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No rooms available on this floor</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;