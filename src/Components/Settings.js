import React, { useState } from "react";
import {
  Building2,
  BedDouble,
  Plus,
  Trash2,
  Pencil,
  IndianRupee,
  Users,
  Layers3,
} from "lucide-react";

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
        [name]:
          name === "price" ||
          name === "capacity" ||
          name === "floor"
            ? parseInt(value)
            : value,
      }));
    }
  };

  const isRoomNameDuplicate = (name) => {
    return rooms.some(
      (room) =>
        room.name.toLowerCase() === name.toLowerCase()
    );
  };

  const resetRoomForm = () => {
    setNewRoom({
      name: "",
      floor: floors.length ? floors[0].number : 1,
      type: "single",
      price: "",
      capacity: 1,
    });

    setEditingRoomIndex(null);
    setErrorMessage("");
  };

  const addRoom = () => {
    if (
      !newRoom.name ||
      !newRoom.price ||
      !newRoom.capacity
    ) {
      setErrorMessage("Fill all required fields");
      return;
    }

    if (
      isRoomNameDuplicate(newRoom.name) &&
      editingRoomIndex === null
    ) {
      setErrorMessage("Room name already exists");
      return;
    }

    if (editingRoomIndex !== null) {
      const updated = [...rooms];
      updated[editingRoomIndex] = newRoom;
      setRooms(updated);
    } else {
      setRooms([...rooms, newRoom]);
    }

    resetRoomForm();
  };

  const addFloor = () => {
    const floorNumber = parseInt(newFloor);

    if (
      !floorNumber ||
      floors.find((f) => f.number === floorNumber)
    )
      return;

    setFloors([
      ...floors,
      {
        number: floorNumber,
      },
    ]);

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
    setFloors((prev) =>
      prev.filter((f) => f.number !== floorNumber)
    );

    setRooms((prev) =>
      prev.filter((room) => room.floor !== floorNumber)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Building2 className="text-cyan-400" size={36} />
          Hotel Settings
        </h1>

        <p className="text-slate-400 mt-2">
          Manage floors and rooms with modern controls
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Floors */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-5">
            <Layers3 className="text-cyan-400" />
            <h2 className="text-xl font-semibold">
              Floors
            </h2>
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              value={newFloor}
              onChange={(e) =>
                setNewFloor(e.target.value)
              }
              placeholder="Floor Number"
              className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button
              onClick={addFloor}
              className="rounded-xl bg-cyan-500 px-4 hover:bg-cyan-400 transition"
            >
              <Plus size={22} />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {floors.map((floor) => (
              <div
                key={floor.number}
                className="flex items-center justify-between rounded-2xl bg-slate-800 px-4 py-3"
              >
                <span className="font-medium">
                  Floor {floor.number}
                </span>

                <button
                  onClick={() =>
                    deleteFloor(floor.number)
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Room Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-xl">
          
          <div className="flex items-center gap-2 mb-6">
            <BedDouble className="text-cyan-400" />
            <h2 className="text-xl font-semibold">
              {editingRoomIndex !== null
                ? "Edit Room"
                : "Add Room"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <input
              type="text"
              name="name"
              value={newRoom.name}
              onChange={handleRoomChange}
              placeholder="Room Name"
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <select
              name="floor"
              value={newRoom.floor}
              onChange={handleRoomChange}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {floors.map((f) => (
                <option
                  key={f.number}
                  value={f.number}
                >
                  Floor {f.number}
                </option>
              ))}
            </select>

            <select
              name="type"
              value={newRoom.type}
              onChange={handleRoomChange}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="single">
                Single
              </option>
              <option value="double">
                Double
              </option>
              <option value="triple">
                Triple
              </option>
              <option value="custom">
                Custom
              </option>
            </select>

            <div className="relative">
              <IndianRupee
                className="absolute left-4 top-3.5 text-slate-400"
                size={18}
              />

              <input
                type="number"
                name="price"
                value={newRoom.price}
                onChange={handleRoomChange}
                placeholder="Room Price"
                className="w-full rounded-xl border border-white/10 bg-slate-800 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {newRoom.type === "custom" && (
              <div className="relative">
                <Users
                  className="absolute left-4 top-3.5 text-slate-400"
                  size={18}
                />

                <input
                  type="number"
                  name="capacity"
                  value={newRoom.capacity}
                  onChange={handleRoomChange}
                  placeholder="Capacity"
                  className="w-full rounded-xl border border-white/10 bg-slate-800 pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          <button
            onClick={addRoom}
            className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-medium text-slate-900 hover:bg-cyan-400 transition"
          >
            <Plus size={18} />

            {editingRoomIndex !== null
              ? "Update Room"
              : "Add Room"}
          </button>
        </div>
      </div>

      {/* Room List */}
      <div className="mt-10 space-y-6">
        {floors.map((floor) => {
          const floorRooms = rooms.filter(
            (room) => room.floor === floor.number
          );

          return (
            <div
              key={floor.number}
              className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl"
            >
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  Floor {floor.number}
                </h3>

                <span className="rounded-full bg-cyan-500/20 px-4 py-1 text-sm text-cyan-300">
                  {floorRooms.length} Rooms
                </span>
              </div>

              {floorRooms.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400">
                        <th className="py-4 text-left">
                          Room
                        </th>
                        <th className="py-4 text-left">
                          Type
                        </th>
                        <th className="py-4 text-left">
                          Price
                        </th>
                        <th className="py-4 text-left">
                          Capacity
                        </th>
                        <th className="py-4 text-left">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {floorRooms.map((room, index) => (
                        <tr
                          key={room.name}
                          className="border-b border-white/5 hover:bg-white/5 transition"
                        >
                          <td className="py-4">
                            {room.name}
                          </td>

                          <td className="py-4 capitalize">
                            {room.type}
                          </td>

                          <td className="py-4">
                            ₹{room.price}
                          </td>

                          <td className="py-4">
                            {room.capacity}
                          </td>

                          <td className="py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() =>
                                  editRoom(index)
                                }
                                className="rounded-lg bg-blue-500/20 p-2 text-blue-300 hover:bg-blue-500/30"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() =>
                                  deleteRoom(index)
                                }
                                className="rounded-lg bg-red-500/20 p-2 text-red-300 hover:bg-red-500/30"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-500">
                  No rooms available on this floor
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
