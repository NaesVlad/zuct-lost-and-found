import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage('Error registering. Email may already exist.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '20px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🔍</div>
          <h1 style={{ color: '#4a9eff', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>ZUCT Lost & Found</h1>
          <p style={{ color: '#a0b4c8', margin: '8px 0 0' }}>Zambia University College of Technology</p>
        </div>

        {/* Card */}
        <div style={{ background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '35px' }}>
          <h2 style={{ color: '#e0e6f0', marginBottom: '25px', fontSize: '20px' }}>Create Account</h2>

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#a0b4c8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
              <input type="text" placeholder="John Doe" value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e0e6f0', fontSize: '15px', boxSizing: 'border-box' }}
                required />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#a0b4c8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>EMAIL</label>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e0e6f0', fontSize: '15px', boxSizing: 'border-box' }}
                required />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#a0b4c8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e0e6f0', fontSize: '15px', boxSizing: 'border-box' }}
                required />
            </div>
            {message && <p style={{ color: message.includes('successful') ? '#51cf66' : '#ff6b6b', marginBottom: '15px', fontSize: '14px' }}>{message}</p>}
            <button type="submit"
              style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1a6bc4, #4a9eff)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              Create Account
            </button>
          </form>

          <p style={{ color: '#a0b4c8', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Already have an account? <a href="/" style={{ color: '#4a9eff', textDecoration: 'none' }}>Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;