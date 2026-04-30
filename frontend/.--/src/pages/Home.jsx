import { useState } from 'react';
import axios from 'axios';

const API = 'https://local-ride-production.up.railway.app';

export default function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rides, setRides] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const searchRides = async () => {
    if (!from || !to) return alert('Dono cities daalo!');
    try {
      const res = await axios.get(`${API}/api/rides/search?from=${from}&to=${to}`);
      setRides(res.data);
    } catch (err) {
      alert('Server se connection nahi! Backend chala rahe ho?');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#1E3A5F' }}>🚗 Local Ride</h1>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '12px', color: '#555' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} style={{ padding: '6px 14px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ marginRight: '12px', color: '#1E3A5F' }}>Login</a>
              <a href="/register" style={{ color: '#1E3A5F' }}>Register</a>
            </>
          )}
        </div>
      </div>

      {/* Driver ka button */}
      {user?.role === 'driver' && (
        <div style={{ background: '#fff3cd', padding: '12px', marginBottom: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Driver Panel:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href="/driver/post-ride" style={{ padding: '6px 14px', background: '#1E3A5F', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>+ Post Ride</a>
            <a href="/driver/active-rides" style={{ padding: '6px 14px', background: '#555', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>My Rides</a>
          </div>
        </div>
      )}

      {/* Search Box */}
      <div style={{ boxShadow: '0 0 10px #ccc', padding: '24px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, color: '#1E3A5F' }}>Ride Dhundo</h2>
        <input
          placeholder="Kahan Se (e.g. Hyderabad)"
          value={from}
          onChange={e => setFrom(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box' }}
        />
        <input
          placeholder="Kahan Tak (e.g. Karachi)"
          value={to}
          onChange={e => setTo(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box' }}
        />
        <button
          onClick={searchRides}
          style={{ width: '100%', padding: '10px', background: '#1E3A5F', color: 'white', border: 'none', cursor: 'pointer', marginTop: '8px' }}
        >
          🔍 Search Rides
        </button>
      </div>

      {/* Results */}
      {rides.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ color: '#1E3A5F' }}>Available Rides ({rides.length})</h3>
          {rides.map(ride => (
            <div key={ride._id} style={{ border: '1px solid #ccc', padding: '16px', margin: '10px 0', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 6px', fontWeight: 'bold' }}>{ride.startCity} → {ride.endCity}</p>
              <p style={{ margin: '0 0 6px', color: '#555' }}>💺 Seats: {ride.availableSeats} &nbsp;|&nbsp; 💰 Fare: Rs. {ride.fare}</p>
              <p style={{ margin: '0 0 10px', color: '#555' }}>⭐ Driver: {ride.driver?.name} ({ride.driver?.rating})</p>
              <button
                onClick={() => {
                  if (!user) { window.location.href = '/login'; return; }
                  window.location.href = `/book/${ride._id}`;
                }}
                style={{ padding: '8px 20px', background: '#1E3A5F', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
              >
                Book Seat
              </button>
            </div>
          ))}
        </div>
      )}

      {rides.length === 0 && from && to && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '24px' }}>Pehle Search karo!</p>
      )}
    </div>
  );
}