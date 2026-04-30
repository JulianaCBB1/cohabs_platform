import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { THEME_TOKENS, layoutStyles, uiElements } from '../styles/theme';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);

      if (res.data?.token) {
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed';

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={layoutStyles.fullPageContainer}>
      <div style={layoutStyles.authCard}>
        <h2 style={uiElements.mainTitle}>Login</h2>
        <p style={uiElements.subtitle}>Authentication Required</p>

        {error && (
          <div style={uiElements.errorMessage}>{error.toUpperCase()}</div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div style={uiElements.inputGroup}>
            <label style={uiElements.label}>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={uiElements.inputField}
              autoComplete="email"
            />
          </div>

          <div style={uiElements.inputGroup}>
            <label style={uiElements.label}>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={uiElements.inputField}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...uiElements.primaryButton,
              marginTop: '20px',
              opacity: loading ? 0.7 : 1,
              backgroundColor: isHovered
                ? THEME_TOKENS.colors.darkGray
                : THEME_TOKENS.colors.black,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            marginTop: THEME_TOKENS.spacing.md,
            fontSize: '10px',
            textAlign: 'center',
            color: THEME_TOKENS.colors.gray,
          }}
        >
          NO ACCOUNT?{' '}
          <Link
            to="/register"
            style={{
              color: THEME_TOKENS.colors.black,
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
