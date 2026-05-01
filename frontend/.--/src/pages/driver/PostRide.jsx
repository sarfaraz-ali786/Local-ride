import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostRide() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: '', to: '', date: '', seats: '', fare: ''
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('https://local-ride-production.up.railway.app/api/rides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Ride post ho gayi!');
      navigate('/');
    } else {
      alert(data.message || 'Error aa gaya');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>🚗 Ride Post Karo</h2>
      <input placeholder="From (city)" value={form.from}
        onChange={e => setForm({...form, from: e.target.value})}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
      <input placeholder="To (city)" value={form.to}
        onChange={e => setForm({...form, to: e.target.value})}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
      <input type="date" value={form.date}
        onChange={e => setForm({...form, date: e.target.value})}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
      <input placeholder="Seats" type="number" value={form.seats}
        onChange={e => setForm({...form, seats: e.target.value})}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
      <input placeholder="Fare (PKR)" type="number" value={form.fare}
        onChange={e => setForm({...form, fare: e.target.value})}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }} />
      <button onClick={handleSubmit}
        style={{ width: '100%', padding: '12px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px' }}>
        🚀 Ride Post Karo
      </button>
      <button onClick={() => navigate('/')}
        style={{ width: '100%', padding: '10px', marginTop: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
        ← Wapas Jao
      </button>
    </div>
  );
}

export default PostRide;