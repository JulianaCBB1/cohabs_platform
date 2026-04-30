import { useState } from 'react';
import { Link } from 'react-router-dom';
import { THEME_TOKENS, layoutStyles, uiElements } from '../styles/theme';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={layoutStyles.fullPageContainer}>
      <div style={layoutStyles.authCard}>
        <h1 style={uiElements.mainTitle}>Cohabs</h1>

        <p style={uiElements.subtitle}>Community Management System // v1.0</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link
            to="/register"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              ...uiElements.primaryButton,
              textAlign: 'center',
              textDecoration: 'none',
              backgroundColor: isHovered
                ? THEME_TOKENS.colors.darkGray
                : THEME_TOKENS.colors.black,
            }}
          >
            Get Started
          </Link>

          <Link to="/login" style={uiElements.secondaryButton}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
