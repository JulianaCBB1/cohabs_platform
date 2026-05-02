import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { THEME_TOKENS, layoutStyles, uiElements } from '../styles/theme';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
      });
      navigate('/login');
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={layoutStyles.fullPageContainer}>
      <div style={layoutStyles.authCard}>
        <h2 style={uiElements.mainTitle}>Register</h2>

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
              autoComplete="new-password"
            />
          </div>

          <div style={uiElements.inputGroup}>
            <label style={uiElements.label}>Confirm</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={uiElements.inputField}
              autoComplete="new-password"
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
            {loading ? '...' : 'Create Account'}
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
          HAVE AN ACCOUNT?{' '}
          <Link
            to="/login"
            style={{
              color: THEME_TOKENS.colors.black,
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
