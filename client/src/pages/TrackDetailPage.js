import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';

function TrackDetailPage() {
  const { trackId } = useParams();
  const [track, setTrack] = useState(null);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/tracks/${trackId}`);
        setTrack(res.track);

        const allLessonIds = [];
        res.track.modules?.forEach((m) => {
          m.lessons?.forEach((l) => allLessonIds.push(l._id));
        });
        if (allLessonIds.length) {
          const progressRes = await api.get(`/api/progress/me?lessonIds=${allLessonIds.join(',')}`);
          setProgress(progressRes.progress || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load track');
      }
    }
    load();
  }, [trackId]);

  function getLessonStatus(id) {
    const p = progress.find((x) => x.lesson && x.lesson._id === id);
    return p ? p.status : 'not_started';
  }

  async function updateLessonStatus(lessonId, status) {
    try {
      await api.post('/api/progress', { lessonId, status });
      setProgress((prev) => {
        const existing = prev.find((p) => p.lesson && p.lesson._id === lessonId);
        if (existing) {
          return prev.map((p) => (p.lesson && p.lesson._id === lessonId ? { ...p, status } : p));
        }
        return [...prev, { lesson: { _id: lessonId }, status }];
      });
    } catch (err) {
      alert(err.message);
    }
  }

  if (!track) return <div className="card">{error || 'Loading track...'}</div>;

  return (
    <div className="page-grid-stack fade-in">
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h1>{track.title}</h1>
        <p className="text-muted">{track.description}</p>
      </div>

      {track.modules?.map((mod, idx) => (
        <div key={mod._id} className="card" style={{ animationDelay: `${0.1 + idx * 0.04}s` }}>
          <h2>{mod.title}</h2>
          <p>{mod.description}</p>
          <div>
            <Link to={`/assignments/${mod._id}`} className="button secondary">
              View assignments
            </Link>
          </div>
          <h3>Lessons</h3>
          {(!mod.lessons || mod.lessons.length === 0) && <p>No lessons yet.</p>}
          {mod.lessons?.map((lesson) => (
            <div key={lesson._id} style={{ marginBottom: '0.5rem' }}>
              <strong>{lesson.title}</strong> ({lesson.type})
              <div>
                Status: {getLessonStatus(lesson._id)}
                <button
                  className="button secondary"
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => updateLessonStatus(lesson._id, 'completed')}
                >
                  Mark completed
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TrackDetailPage;
