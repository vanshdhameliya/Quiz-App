import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/quizzes')
      .then((res) => setQuizzes(res.data))
      .catch(() => setError('Could not load quizzes. Is the backend running on port 8080?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page">Loading quizzes...</p>;
  if (error) return <p className="page error">{error}</p>;

  return (
    <div className="page">
      <h2 className="prompt"><span className="prompt-sigil">$</span> browse-quizzes</h2>
      {quizzes.length === 0 && <p>No quizzes yet. Create one from the admin panel.</p>}
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <span className="quiz-meta">{quiz.questionCount} questions</span>
            <Link to={`/quizzes/${quiz.id}/play`} className="btn btn-primary">Start Quiz</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
