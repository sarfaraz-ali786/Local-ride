import { useNavigate } from 'react-router-dom';

function ActiveRides() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>🚗 Active Rides</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '15px' }}>
        <p>Abhi koi active ride nahi hai</p>
        <button onClick={() => navigate('/driver/post')} style={{ width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          + Nayi Ride Post Karo
        </button>
      </div>
      <button onClick={() => navigate('/')} style={{ marginTop: '15px', padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
        ← Wapas Jao
      </button>
    </div>
  );
}

export default ActiveRides;