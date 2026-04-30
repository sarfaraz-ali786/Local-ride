import { useState } from 'react';
import axios from 'axios';

const API = 'https://local-ride-production.up.railway.app';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { phone, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Login Successful!');
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || 'Login Failed!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', boxShadow: '0 0 10px #ccc' }}>
      <h2>Local Ride — Login</h2>
      <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
      <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#1E3A5F', color: 'white', border: 'none', cursor: 'pointer' }}>
        Login
      </button>
      <p>No account? <a href="/register">Register here</a></p>
    </div>
  );
}