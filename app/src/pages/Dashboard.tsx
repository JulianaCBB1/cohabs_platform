import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column', // Navbar on top, Content below
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* 1. TOP NAVBAR */}
      <nav
        style={{
          height: '60px',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          Cohabs
        </span>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          style={{
            color: '#ff4d4d',
            background: 'none',
            border: '1px solid #ff4d4d',
            padding: '4px 12px',
            cursor: 'pointer',
          }}
        >
          LOGOUT
        </button>
      </nav>

      {/* 2. BODY - This is where the COLUMNS happen */}
      <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'row' }}>
        {/* LEFT COLUMN: User Info */}
        <aside
          style={{
            width: '300px',
            backgroundColor: '#f8f8f8',
            padding: '30px',
            borderRight: '1px solid #ddd',
            textAlign: 'left', // Ensures text isn't centered
          }}
        >
          <h6
            style={{
              fontSize: '10px',
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            User Profile
          </h6>
          <p
            style={{
              fontSize: '12px',
              marginBottom: '4px',
              fontWeight: 'bold',
            }}
          >
            {user?.email}
          </p>
          <span
            style={{
              fontSize: '10px',
              border: '1px solid #000',
              padding: '2px 6px',
            }}
          >
            {user?.role?.toUpperCase()}
          </span>
        </aside>

        {/* RIGHT COLUMN: Workspace */}
        <main
          style={{
            flexGrow: 1,
            padding: '40px',
            textAlign: 'left', // Force left alignment
          }}
        >
          <h4
            style={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Workspace
          </h4>
          <p style={{ fontSize: '10px', color: '#aaa' }}>
            Main Content Node Active
          </p>
          <div
            style={{
              marginTop: '30px',
              border: '1px dashed #ccc',
              padding: '20px',
            }}
          >
            Select a module to get started.
          </div>
        </main>
      </div>
    </div>
  );
}
