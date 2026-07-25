import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${id}/play`)
      .then((res) => setQuiz(res.data))
      .catch(() => setError('Could not load this quiz.'));
  }, [id]);

  const selectAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    api.post(`/quizzes/${id}/submit`, { answers })
      .then((res) => {
        navigate(`/quizzes/${id}/result`, { state: { result: res.data } });
      })
      .catch(() => setError('Could not submit your answers.'))
      .finally(() => setSubmitting(false));
  };

  if (error) return <p className="page error">{error}</p>;
  if (!quiz) return <p className="page">Loading quiz...</p>;

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="page">
      <h2 className="prompt"><span className="prompt-sigil">$</span> {quiz.title}</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>{quiz.description}</p>

      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="question-block">
          <h4>{idx + 1}. {q.questionText}</h4>
          <div className="options">
            {q.options.map((opt, optIdx) => (
              <label
                key={optIdx}
                className={`option ${answers[q.id] === optIdx ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={answers[q.id] === optIdx}
                  onChange={() => selectAnswer(q.id, optIdx)}
                />
                <span className="option-badge">{LETTERS[optIdx] || optIdx + 1}</span>
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        className="btn btn-primary"
        disabled={!allAnswered || submitting}
        onClick={handleSubmit}
      >
        {submitting ? 'Submitting...' : 'Submit Answers'}
      </button>
    </div>
  );
}

export default TakeQuiz;
