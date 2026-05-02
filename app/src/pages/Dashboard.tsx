import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  layoutStyles,
  uiElements,
  dashboardStyles,
  dashboardElements,
} from '../styles/theme';
import HousesTab from '../components/tabs/HousesTab';
import RoomsTab from '../components/tabs/RoomsTab';
import LeasesTab from '../components/tabs/LeasesTab';

type Tab = 'houses' | 'rooms' | 'leases';
const TABS: Tab[] = ['houses', 'rooms', 'leases'];

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('houses');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutHovered, setLogoutHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={layoutStyles.dashboardContainer}>
      <nav style={dashboardStyles.navbar}>
        <span style={uiElements.navbarBrand}>Platform</span>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHovered(true)}
          onMouseLeave={() => setLogoutHovered(false)}
          style={
            logoutHovered
              ? uiElements.logoutButtonHovered
              : uiElements.logoutButton
          }
        >
          LOGOUT
        </button>
      </nav>

      <div style={dashboardStyles.body}>
        <aside style={dashboardStyles.sidebar}>
          <h6 style={dashboardElements.profileHeader}>USER</h6>
          <div style={dashboardStyles.sidebarProfile}>
            <p style={dashboardElements.emailDisplay}>
              {user?.email || 'OFFLINE'}
            </p>
          </div>

          <div style={dashboardStyles.sidebarNavSection}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={
                  tab === t
                    ? dashboardStyles.sidebarNavButtonActive
                    : dashboardStyles.sidebarNavButton
                }
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={dashboardElements.statusMarker}>
            <div style={dashboardElements.statusDot} />
            ONLINE
          </div>
        </aside>

        <main style={dashboardStyles.dashboard}>
          {tab === 'houses' && <HousesTab />}
          {tab === 'rooms' && <RoomsTab />}
          {tab === 'leases' && <LeasesTab />}
        </main>
      </div>
    </div>
  );
}
