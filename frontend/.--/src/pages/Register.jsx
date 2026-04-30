import { useState } from 'react';
import axios from 'axios';

const API = 'https://local-ride-production.up.railway.app';

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', cnic: '', password: '', role: 'passenger', agreedToTerms: false });
  const [showTerms, setShowTerms] = useState(true);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleRegister = async () => {
    if (!form.agreedToTerms) return alert('Please agree to Terms & Conditions!');
    try {
      await axios.post(`${API}/api/auth/register`, form);
      alert('Registered Successfully! Please Login.');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.message || 'Registration Failed!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', boxShadow: '0 0 10px #ccc' }}>
      {showTerms && (
        <div style={{ background: '#fff3cd', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
          <h3>Terms & Conditions</h3>
          <p style={{ fontSize: '13px' }}>This platform only connects drivers and passengers. In case of any accident, robbery, fraud, or any loss, the App and its Owner will not be responsible. Users travel at their own risk.</p>
          <button onClick={() => setShowTerms(false)} style={{ background: '#1E3A5F', color: 'white', padding: '8px 20px', border: 'none', cursor: 'pointer' }}>I Agree</button>
        </div>
      )}
      <h2>Local Ride — Register</h2>
      <input name="name" placeholder="Full Name" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '8px 0' }} />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '8px 0' }} />
      <input name="cnic" placeholder="CNIC Number" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '8px 0' }} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '8px 0' }} />
      <select name="role" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '8px 0' }}>
        <option value="passenger">Passenger</option>
        <option value="driver">Driver</option>
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
        <input type="checkbox" name="agreedToTerms" onChange={handleChange} />
        I agree to Terms & Conditions
      </label>
      <button onClick={handleRegister} style={{ width: '100%', padding: '10px', background: '#1E3A5F', color: 'white', border: 'none', cursor: 'pointer' }}>
        Register
      </button>
      <p>Already have account? <a href="/login">Login here</a></p>
    </div>
  );
}