import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="page-grid fade-in">
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <div className="badge">Project-based learning</div>
        <h1 className="hero-title">Learn by building real projects</h1>
        <p className="hero-subtitle">
          EduTech is a project-based learning platform with tracks, mentor feedback, and a
          career-focused curriculum.
        </p>
        {!user && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/register" className="button" style={{ marginRight: '0.5rem' }}>
              Get started
            </Link>
            <Link to="/login" className="button secondary">
              I already have an account
            </Link>
          </div>
        )}
        {user && (
          <div style={{ marginTop: '1rem' }}>
            <Link to="/dashboard" className="button">
              Go to dashboard
            </Link>
          </div>
        )}
      </div>
      <div className="card" style={{ animationDelay: '0.12s' }}>
        <h2>How it works</h2>
        <ul>
          <li>Pick a track and enroll.</li>
          <li>Complete modules and lessons, submitting real projects.</li>
          <li>Get detailed mentor feedback and book 1:1 sessions.</li>
        </ul>
      </div>
    </div>
  );
}

export default LandingPage;
