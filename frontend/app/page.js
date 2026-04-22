'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

export default function Home() {
  const [tasks, setTasks]   = useState([]);
  const [title, setTitle]   = useState('');
  const [desc, setDesc]     = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await fetch(`${API}/api/tasks/`);
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const createTask = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/tasks/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: desc, completed: false }),
    });
    setTitle(''); setDesc('');
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await fetch(`${API}/api/tasks/${task.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/api/tasks/${id}/`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <main style={{ maxWidth: 680, margin: '40px auto', fontFamily: 'system-ui', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>AfriPoint Task Manager</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>
        Running on Kubernetes — Django + PostgreSQL backend
      </p>

      <form onSubmit={createTask} style={{ background: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>New task</h2>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Task title" required
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd',
            marginBottom: 10, fontSize: 14, boxSizing: 'border-box' }}
        />
        <textarea
          value={desc} onChange={e => setDesc(e.target.value)}
          placeholder="Description (optional)" rows={3}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd',
            marginBottom: 10, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }}
        />
        <button type="submit"
          style={{ background: '#0070f3', color: '#fff', border: 'none', padding: '10px 20px',
            borderRadius: 6, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
          Add task
        </button>
      </form>

      {loading ? <p>Loading...</p> : (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Tasks ({tasks.length})
          </h2>
          {tasks.length === 0 && <p style={{ color: '#999' }}>No tasks yet. Add one above.</p>}
          {tasks.map(task => (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '14px 16px', borderRadius: 8, border: '1px solid #eee',
              marginBottom: 10, background: task.completed ? '#f0fdf4' : '#fff'
            }}>
              <input type="checkbox" checked={task.completed}
                onChange={() => toggleTask(task)}
                style={{ marginTop: 3, cursor: 'pointer', width: 16, height: 16 }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 500,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#999' : '#111' }}>
                  {task.title}
                </p>
                {task.description && (
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#666' }}>
                    {task.description}
                  </p>
                )}
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#bbb' }}>
                  {new Date(task.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => deleteTask(task.id)}
                style={{ background: 'none', border: '1px solid #ffcccc', color: '#cc0000',
                  padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontSize: 12 }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}