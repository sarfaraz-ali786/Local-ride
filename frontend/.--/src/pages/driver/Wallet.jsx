import { useNavigate } from 'react-router-dom';

function Wallet() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>💰 Driver Wallet</h2>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginTop: '15px', textAlign: 'center' }}>
        <h3>Total Balance</h3>
        <h1 style={{ color: '#1a1a2e' }}>Rs. 0</h1>
        <p>10% commission cut hoti hai har ride se</p>
      </div>
      <button onClick={() => navigate('/')} style={{ marginTop: '15px', padding: '10px 20px', border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }}>
        ← Wapas Jao
      </button>
    </div>
  );
}

export default Wallet;