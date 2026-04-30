import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Cohabs</h1>
      <p>The best way to manage your community.</p>

      {/* Change your button or anchor tag to a Link component */}
      <Link to="/register" className="btn btn-primary btn-lg px-5">
        Get Started
      </Link>

      <div className="mt-3">
        <Link to="/login" className="text-muted small">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
