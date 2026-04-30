import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });

      // Safety check: ensure we actually got data back
      if (res.data && res.data.token) {
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Check all common error paths from your backend
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed';

      setError(backendMessage);
      console.error('Login Error:', err.response?.data);
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
          width: '400px',
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
          Login
        </h2>
        <p
          style={{
            fontSize: '10px',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '30px',
          }}
        >
          Authentication Required
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
                width: '100px',
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
                width: '100px',
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
            {loading ? '...' : 'Sign In'}
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
          NO ACCOUNT?{' '}
          <Link
            to="/register"
            style={{
              color: '#000',
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            REGISTER
          </Link>
        </p>
      </div>
    </div>
  );
}
