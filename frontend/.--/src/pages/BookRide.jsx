import { useNavigate } from 'react-router-dom';

function BookRide() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>🎫 Ride Book Karo</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '15px' }}>
        <h3>Ride Details</h3>
        <p>🚗 From: <b>Hyderabad</b></p>
        <p>📍 To: <b>Karachi</b></p>
        <p>💺 Available Seats: <b>3</b></p>
        <p>💰 Fare: <b>Rs. 500</b></p>
        <button style={{ width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
          ✅ Confirm Booking
        </button>
      </div>
      <button onClick={() => navigate('/')} style={{ marginTop: '15px', padding: '10px 20px', background: '#gray', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
        ← Wapas Jao
      </button>
    </div>
  );
}

export default BookRide;