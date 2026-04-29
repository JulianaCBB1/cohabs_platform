import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export default function LandingPage() {
  const { data, loading, error } = useFetch<HealthResponse>('/health');

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="text-center px-4">
        <h1 className="display-4 fw-bold text-primary mb-3">Cohabs</h1>
        <div className="lead text-muted mb-5">
          Operations platform for managing houses, rooms and leases.
        </div>

        <div className="lead text-muted mb-5">
          {loading && <span>Loading platform details...</span>}
          {error && <span>Error loading info</span>}
          {data && (
            <span>
              {data.status} - {new Date(data.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <Link to="/login" className="btn btn-primary btn-lg px-5">
          Get started
        </Link>
      </div>
    </div>
  );
}
