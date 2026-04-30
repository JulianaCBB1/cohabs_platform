import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          width: '450px',
          padding: '40px',
          border: '1px solid #000',
          backgroundColor: '#fff',
          textAlign: 'left',
        }}
      >
        <h2
          style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '5px',
          }}
        >
          Register
        </h2>
        <p
          style={{
            fontSize: '10px',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '30px',
          }}
        >
          Join the Platform
        </p>

        {error && (
          <div
            style={{
              border: '1px solid #ff4d4d',
              color: '#ff4d4d',
              padding: '10px',
              fontSize: '12px',
              marginBottom: '20px',
              fontWeight: 'bold',
            }}
          >
            {error.toUpperCase()}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label
              style={{
                width: '120px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flexGrow: 1,
                padding: '8px',
                border: '1px solid #000',
                borderRadius: 0,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label
              style={{
                width: '120px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                flexGrow: 1,
                padding: '8px',
                border: '1px solid #000',
                borderRadius: 0,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label
              style={{
                width: '120px',
                fontSize: '10px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              Confirm
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                flexGrow: 1,
                padding: '8px',
                border: '1px solid #000',
                borderRadius: 0,
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '20px',
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px',
              border: 'none',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {loading ? '...' : 'Create Account'}
          </button>
        </form>

        <p
          style={{
            marginTop: '30px',
            fontSize: '10px',
            textAlign: 'center',
            color: '#888',
          }}
        >
          HAVE AN ACCOUNT?{' '}
          <Link
            to="/login"
            style={{
              color: '#000',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
}
