import React, { useEffect, useState } from 'react';
import api from '../api/client';

function AdminPanelPage() {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState('');

  async function loadTracks() {
    try {
      const res = await api.get('/api/tracks');
      setTracks(res.tracks || []);
    } catch (err) {
      setError(err.message || 'Failed to load tracks');
    }
  }

  useEffect(() => {
    loadTracks();
  }, []);

  async function createTrack(e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const slug = form.slug.value;
    const description = form.description.value;
    const level = form.level.value;
    try {
      await api.post('/api/tracks', { title, slug, description, level });
      form.reset();
      loadTracks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createModule(trackId, e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    try {
      await api.post('/api/modules', { trackId, title, description });
      form.reset();
      loadTracks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createLesson(moduleId, e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const type = form.type.value;
    try {
      await api.post('/api/lessons', { moduleId, title, description, type });
      form.reset();
      loadTracks();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createAssignment(moduleId, e) {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const instructions = form.instructions.value;
    try {
      await api.post('/api/assignments', { moduleId, title, description, instructions });
      form.reset();
      alert('Assignment created');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="page-grid-stack fade-in">
      <div className="card" style={{ animationDelay: '0.05s' }}>
        <h1>Admin panel</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="card" style={{ animationDelay: '0.1s' }}>
        <h2>Create track</h2>
        <form onSubmit={createTrack} className="form">
          <input name="title" className="input" placeholder="Title" required />
          <input name="slug" className="input" placeholder="Slug (unique)" required />
          <input name="description" className="input" placeholder="Description" />
          <select name="level" className="input" defaultValue="beginner">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button className="button" type="submit">
            Create track
          </button>
        </form>
      </div>

      {tracks.map((track, idx) => (
        <div
          key={track._id}
          className="card"
          style={{ animationDelay: `${0.16 + idx * 0.04}s` }}
        >
          <h2>{track.title}</h2>
          <p>{track.description}</p>

          <h3>Create module</h3>
          <form onSubmit={(e) => createModule(track._id, e)} className="form">
            <input name="title" className="input" placeholder="Module title" required />
            <input name="description" className="input" placeholder="Module description" />
            <button className="button" type="submit">
              Add module
            </button>
          </form>

          {track.modules?.map((mod) => (
            <div key={mod._id} style={{ marginTop: '1rem' }}>
              <strong>Module: {mod.title}</strong>
              <p>{mod.description}</p>

              <h4>Create lesson</h4>
              <form onSubmit={(e) => createLesson(mod._id, e)} className="form">
                <input name="title" className="input" placeholder="Lesson title" required />
                <input name="description" className="input" placeholder="Lesson description" />
                <select name="type" className="input" defaultValue="reading">
                  <option value="reading">Reading</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="project">Project</option>
                </select>
                <button className="button" type="submit">
                  Add lesson
                </button>
              </form>

              <h4>Create assignment</h4>
              <form onSubmit={(e) => createAssignment(mod._id, e)} className="form">
                <input name="title" className="input" placeholder="Assignment title" required />
                <input name="description" className="input" placeholder="Assignment description" />
                <textarea
                  name="instructions"
                  className="input"
                  placeholder="Assignment instructions"
                  rows={3}
                />
                <button className="button" type="submit">
                  Add assignment
                </button>
              </form>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default AdminPanelPage;
