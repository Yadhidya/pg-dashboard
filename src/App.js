import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Dashboard from './Components/Dashboard';
import Bookings from './Components/Bookings';
import Settings from './Components/Settings';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Revenue from './Components/Revenue';
import OwnerDetails from './Components/OwnerDetails';
import { RoomProvider } from './Components/RoomContext'; 
import { BookingProvider } from './Components/BookingContext'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <RoomProvider>
      <BookingProvider>
        <Router>
          <div className="flex">
            {isAuthenticated && (
              <div className="w-64 bg-blue-900 text-white min-h-screen">
                <Sidebar />
              </div>
            )}

            <div className={`flex-1 p-8 min-h-screen ${isAuthenticated ? 'bg-gray-100' : 'bg-white'}`}>
              <Routes>
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/bookings" element={isAuthenticated ? <Bookings /> : <Navigate to="/login" />} />
                <Route path="/revenue" element={isAuthenticated ? <Revenue /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/owner-details" element={<OwnerDetails />} />
              </Routes>
            </div>
          </div>
        </Router>
      </BookingProvider>
    </RoomProvider>
  );
}

export default App;
