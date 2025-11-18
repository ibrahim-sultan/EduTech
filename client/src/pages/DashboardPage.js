import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const [tracks, setTracks] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [tracksRes, enrollmentsRes] = await Promise.all([
          api.get('/api/tracks'),
          api.get('/api/enrollments/me'),
        ]);
        setTracks(tracksRes.tracks || []);
        setEnrollments(enrollmentsRes.enrollments || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleEnroll(trackId) {
    try {
      await api.post('/api/enrollments', { trackId });
      const enrollmentsRes = await api.get('/api/enrollments/me');
      setEnrollments(enrollmentsRes.enrollments || []);
    } catch (err) {
      alert(err.message);
    }
  }

  const enrolledTrackIds = new Set(enrollments.map((e) => e.track && e.track._id));

  if (loading) return <div className="card">Loading dashboard...</div>;

  return (
    <div className="page-grid-stack fade-in">
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h1>Welcome, {user.name}</h1>
        <p className="text-muted">Your learning dashboard</p>
      </div>

      {error && (
        <div className="card" style={{ color: 'red' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ animationDelay: '0.1s' }}>
        <h2>Your enrollments</h2>
        {enrollments.length === 0 && <p>You are not enrolled in any tracks yet.</p>}
        {enrollments.map((enrollment) => (
          <div key={enrollment._id} style={{ marginBottom: '0.75rem' }}>
            <strong>{enrollment.track?.title}</strong>
            <div>
              Status: {enrollment.status}
              <span style={{ marginLeft: '1rem' }}>
                <Link to={`/tracks/${enrollment.track?._id}`}>View track</Link>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ animationDelay: '0.16s' }}>
        <h2>Available tracks</h2>
        {tracks.map((track) => (
          <div key={track._id} style={{ marginBottom: '0.75rem' }}>
            <strong>{track.title}</strong> ({track.level})
            <div style={{ marginTop: '0.25rem' }}>{track.description}</div>
            <div style={{ marginTop: '0.25rem' }}>
              <Link to={`/tracks/${track._id}`} className="button secondary" style={{ marginRight: '0.5rem' }}>
                View track
              </Link>
              {!enrolledTrackIds.has(track._id) && (
                <button className="button" onClick={() => handleEnroll(track._id)}>
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
