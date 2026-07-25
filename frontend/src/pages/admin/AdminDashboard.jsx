import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';

function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  const loadQuizzes = () => {
    adminApi.get('/quizzes')
      .then((res) => setQuizzes(res.data))
      .catch(() => setError('Could not load quizzes.'));
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this quiz and all its questions? This cannot be undone.')) return;
    adminApi.delete(`/quizzes/${id}`)
      .then(loadQuizzes)
      .catch(() => setError('Could not delete quiz.'));
  };

  return (
    <div className="page">
      <div className="admin-header">
        <h2 className="prompt"><span className="prompt-sigil">$</span> manage-quizzes</h2>
        <Link to="/admin/quizzes/new" className="btn btn-primary">+ new quiz</Link>
      </div>
      {error && <p className="error">{error}</p>}

      {quizzes.length === 0 ? (
        <p>No quizzes yet. Create the first one.</p>
      ) : (
        <div className="log-panel">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="log-row">
              <span className="log-title">{quiz.title}</span>
              <span className="log-desc">{quiz.description}</span>
              <span className="log-count">{quiz.questions ? quiz.questions.length : 0}q</span>
              <span className="log-actions">
                <Link to={`/admin/quizzes/${quiz.id}`} className="btn btn-small btn-secondary">manage</Link>
                <button className="btn btn-small btn-danger" onClick={() => handleDelete(quiz.id)}>delete</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
