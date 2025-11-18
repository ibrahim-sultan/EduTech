import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

function AssignmentsPage() {
  const { moduleId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [assignRes, subRes] = await Promise.all([
          api.get(`/api/assignments?moduleId=${moduleId}`),
          api.get('/api/submissions/me'),
        ]);
        setAssignments(assignRes.assignments || []);
        setSubmissions(subRes.submissions || []);
      } catch (err) {
        setError(err.message || 'Failed to load assignments');
      }
    }
    load();
  }, [moduleId]);

  function getSubmission(assignmentId) {
    return submissions.find((s) => s.assignment && s.assignment._id === assignmentId);
  }

  async function handleSubmit(assignmentId, e) {
    e.preventDefault();
    const form = e.target;
    const repoUrl = form.repoUrl.value;
    const demoUrl = form.demoUrl.value;
    const notes = form.notes.value;
    try {
      await api.post('/api/submissions', { assignmentId, repoUrl, demoUrl, notes });
      const subRes = await api.get('/api/submissions/me');
      setSubmissions(subRes.submissions || []);
      form.reset();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="page-grid-stack fade-in">
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h1>Assignments</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      {assignments.map((assignment, idx) => {
        const s = getSubmission(assignment._id);
        return (
          <div
            key={assignment._id}
            className="card"
            style={{ animationDelay: `${0.1 + idx * 0.04}s` }}
          >
            <h2>{assignment.title}</h2>
            <p>{assignment.description}</p>
            {assignment.instructions && <p>{assignment.instructions}</p>}
            {assignment.dueDate && (
              <p>Due: {new Date(assignment.dueDate).toLocaleString()}</p>
            )}
            {s && (
              <p>
                Your submission: {s.status} {s.score != null && `(Score: ${s.score})`}
              </p>
            )}
            <form onSubmit={(e) => handleSubmit(assignment._id, e)} className="form">
              <input name="repoUrl" className="input" placeholder="Repo URL" />
              <input name="demoUrl" className="input" placeholder="Live demo URL (optional)" />
              <textarea
                name="notes"
                className="input"
                placeholder="Notes to your mentor (optional)"
                rows={3}
              />
              <button className="button" type="submit">
                {s ? 'Update submission' : 'Submit assignment'}
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}

export default AssignmentsPage;
