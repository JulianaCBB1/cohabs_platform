import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  THEME_TOKENS,
  layoutStyles,
  uiElements,
  dashboardStyles,
  dashboardElements,
} from '../styles/theme';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={layoutStyles.dashboardContainer}>
      <nav style={dashboardStyles.navbar}>
        <span
          style={{
            ...uiElements.mainTitle,
            fontSize: '18px',
            color: THEME_TOKENS.colors.white,
          }}
        >
          Platform
        </span>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          style={{
            ...uiElements.secondaryButton,
            padding: '6px 16px',
            fontSize: '10px',
            borderColor: THEME_TOKENS.colors.error,
            backgroundColor: isLogoutHovered
              ? THEME_TOKENS.colors.error
              : 'transparent',
            color: isLogoutHovered
              ? THEME_TOKENS.colors.white
              : THEME_TOKENS.colors.error,
          }}
        >
          LOGOUT
        </button>
      </nav>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <aside style={dashboardStyles.sidebar}>
          <h6 style={dashboardElements.profileHeader}>User Profile</h6>

          <div
            style={{
              marginBottom: THEME_TOKENS.spacing.lg,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <p style={dashboardElements.emailDisplay}>
              {user?.email || 'OFFLINE_USER'}
            </p>
            <div style={dashboardStyles.badge}>
              ROLE: {user?.role?.toUpperCase() || 'GUEST'}
            </div>
          </div>
        </aside>

        <main style={dashboardStyles.dashboard}>
          <h4 style={uiElements.mainTitle}>Dashboard</h4>
          <p style={uiElements.subtitle}>Main Content Node Active // v1.0</p>

          <div style={dashboardElements.contentBox}>
            <p style={dashboardElements.placeholderText}>
              Select a module from the system interface to begin operation.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
