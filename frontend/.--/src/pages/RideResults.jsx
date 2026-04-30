import { useLocation, useNavigate } from 'react-router-dom';

function RideResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to } = location.state || {};

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>🚗 Available Rides</h2>
      <p>From: <b>{from}</b> → To: <b>{to}</b></p>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginTop: '15px' }}>
        <p>No rides found yet.</p>
        <p>Backend connect hone ke baad rides yahan dikhenge!</p>
      </div>
      <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        ← Wapas Jao
      </button>
    </div>
  );
}

export default RideResults;