import { useNavigate } from 'react-router-dom';

function PostRide() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>🚗 Ride Post Karo</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '15px' }}>
        <input placeholder="Kahan Se (e.g. Hyderabad)" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input placeholder="Kahan Tak (e.g. Karachi)" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input placeholder="Kitni Seats (e.g. 3)" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <input placeholder="Fare (e.g. 500)" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        <button style={{ width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          ✅ Ride Post Karo
        </button>
      </div>
      <button onClick={() => navigate('/')} style={{ marginTop: '15px', padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
        ← Wapas Jao
      </button>
    </div>
  );
}

export default PostRide;