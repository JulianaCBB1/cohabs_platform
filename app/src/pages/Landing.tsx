import { Link } from 'react-router-dom';

export default function LandingPage() {
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
          width: '500px',
          padding: '50px',
          border: '1px solid #000',
          backgroundColor: '#fff',
          textAlign: 'left',
        }}
      >
        <h1
          style={{
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            fontSize: '32px',
            margin: 0,
            lineHeight: '1',
          }}
        >
          Cohabs
        </h1>

        <p
          style={{
            fontSize: '10px',
            color: '#888',
            textTransform: 'uppercase',
            marginTop: '10px',
            marginBottom: '40px',
            letterSpacing: '1px',
          }}
        >
          Community Management System // v1.0
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link
            to="/register"
            style={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontSize: '14px',
              letterSpacing: '1px',
            }}
          >
            Get Started
          </Link>

          <Link
            to="/login"
            style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textDecoration: 'none',
              fontSize: '12px',
              border: '1px solid #000',
            }}
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
