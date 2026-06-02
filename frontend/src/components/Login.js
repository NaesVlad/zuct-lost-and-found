import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (error) {
      setMessage('Invalid email or password');
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
          <h2 style={{ color: '#e0e6f0', marginBottom: '25px', fontSize: '20px' }}>Welcome Back</h2>
          
          <form onSubmit={handleLogin}>
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
            {message && <p style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '14px' }}>{message}</p>}
            <button type="submit"
              style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1a6bc4, #4a9eff)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              Login
            </button>
          </form>

          <p style={{ color: '#a0b4c8', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
            Don't have an account? <a href="/register" style={{ color: '#4a9eff', textDecoration: 'none' }}>Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;