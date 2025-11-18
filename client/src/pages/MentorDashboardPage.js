import React, { useEffect, useState } from 'react';
import api from '../api/client';

function MentorDashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [subsRes, sessionsRes] = await Promise.all([
          api.get('/api/submissions'),
          api.get('/api/sessions/mentor'),
        ]);
        setSubmissions(subsRes.submissions || []);
        setSessions(sessionsRes.sessions || []);
      } catch (err) {
        setError(err.message || 'Failed to load mentor dashboard');
      }
    }
    load();
  }, []);

  async function reviewSubmission(id, status) {
    const score = window.prompt('Score (leave blank to skip)');
    const feedback = window.prompt('Feedback (optional)');
    try {
      await api.post(`/api/submissions/${id}/review`, {
        status,
        score: score ? Number(score) : undefined,
        feedback: feedback || undefined,
      });
      const subsRes = await api.get('/api/submissions');
      setSubmissions(subsRes.submissions || []);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="page-grid-stack fade-in">
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h1>Mentor dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="card" style={{ animationDelay: '0.1s' }}>
        <h2>Submissions to review</h2>
        {submissions.length === 0 && <p>No submissions yet.</p>}
        {submissions.map((s) => (
          <div key={s._id} style={{ marginBottom: '0.75rem' }}>
            <strong>{s.assignment?.title}</strong> by {s.student?.name || 'Unknown student'}
            <div>Status: {s.status}</div>
            <div>
              Repo: {s.repoUrl || 'N/A'}
              <br />
              Demo: {s.demoUrl || 'N/A'}
            </div>
            <button
              className="button secondary"
              style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
              onClick={() => reviewSubmission(s._id, 'changes_requested')}
            >
              Request changes
            </button>
            <button
              className="button"
              style={{ marginTop: '0.25rem' }}
              onClick={() => reviewSubmission(s._id, 'approved')}
            >
              Approve
            </button>
          </div>
        ))}
      </div>

      <div className="card" style={{ animationDelay: '0.16s' }}>
        <h2>Your sessions</h2>
        {sessions.length === 0 && <p>No sessions scheduled.</p>}
        {sessions.map((session) => (
          <div key={session._id} style={{ marginBottom: '0.75rem' }}>
            With {session.student?.name || 'Student'} on{' '}
            {new Date(session.scheduledAt).toLocaleString()} ({session.status})
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorDashboardPage;
