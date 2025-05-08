import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaEdit } from "react-icons/fa";

const OwnerDetails = () => {
  
  const initialOwnerData = {
    name: "Yadhidya Ulli",
    phone: "+91 8074729571",
    email: "yadhidya@example.com",
    pgName: "Sunrise PG",
    location: "Chennai",
  };

  
  const [owner, setOwner] = useState(initialOwnerData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...initialOwnerData });
  const [error, setError] = useState("");

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSave = () => {
    const { name, phone, email, pgName, location } = formData;

    
    if (!name || !phone || !email || !pgName || !location) {
      setError("All fields are required.");
      return;
    }

    setOwner(formData); 
    setIsEditing(false); 
    setError(""); 
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-3xl font-bold text-blue-900 text-center">Owner Details</h2>

      <div className="flex items-center space-x-4">
        <strong className="text-lg w-24">Name:</strong>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          />
        ) : (
          <span className="text-gray-700">{owner.name}</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <FaPhoneAlt className="text-blue-600" />
        <strong className="text-lg w-24">Phone:</strong>
        {isEditing ? (
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          />
        ) : (
          <span className="text-gray-700">{owner.phone}</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <FaEnvelope className="text-blue-600" />
        <strong className="text-lg w-24">Email:</strong>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          />
        ) : (
          <span className="text-gray-700">{owner.email}</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <strong className="text-lg w-24">PG Name:</strong>
        {isEditing ? (
          <input
            type="text"
            name="pgName"
            value={formData.pgName}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          />
        ) : (
          <span className="text-gray-700">{owner.pgName}</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <FaMapMarkerAlt className="text-blue-600" />
        <strong className="text-lg w-24">Location:</strong>
        {isEditing ? (
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded-md w-full"
          />
        ) : (
          <span className="text-gray-700">{owner.location}</span>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="text-center space-x-4">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {isEditing ? "Cancel" : <><FaEdit className="inline mr-2" /> Edit Details</>}
        </button>

        {isEditing && (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default OwnerDetails;
