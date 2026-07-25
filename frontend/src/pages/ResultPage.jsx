import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="page result-page">
        <p>No result to show yet.</p>
        <Link to="/quizzes" className="btn btn-primary">Back to Quizzes</Link>
      </div>
    );
  }

  const percentage = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="page result-page">
      <h2 className="prompt"><span className="prompt-sigil">$</span> result</h2>
      <p className="score">{result.score} / {result.total}</p>
      <p style={{ color: 'var(--color-text-muted)' }}>{percentage}% correct</p>
      <Link to="/quizzes" className="btn btn-primary" style={{ marginTop: 20 }}>
        Try Another Quiz
      </Link>
    </div>
  );
}

export default ResultPage;
