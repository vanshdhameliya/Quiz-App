import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import QuestionManager from './QuestionManager';

function QuizFormPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  const reloadQuiz = () => {
    if (!isNew) {
      adminApi.get(`/quizzes/${id}`)
        .then((res) => {
          setQuiz(res.data);
          setTitle(res.data.title);
          setDescription(res.data.description || '');
        })
        .catch(() => setError('Could not load quiz.'));
    }
  };

  useEffect(() => {
    reloadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { title, description };

    if (isNew) {
      adminApi.post('/quizzes', payload)
        .then((res) => navigate(`/admin/quizzes/${res.data.id}`))
        .catch(() => setError('Could not create quiz.'));
    } else {
      adminApi.put(`/quizzes/${id}`, payload)
        .then((res) => setQuiz(res.data))
        .catch(() => setError('Could not update quiz.'));
    }
  };

  return (
    <div className="page">
      <h2 className="prompt">
        <span className="prompt-sigil">$</span> {isNew ? 'create-quiz' : 'edit-quiz'}
      </h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSave} className="quiz-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isNew ? 'Create Quiz' : 'Save Changes'}
          </button>
        </div>
      </form>

      {!isNew && quiz && (
        <QuestionManager quizId={quiz.id} questions={quiz.questions} onChange={reloadQuiz} />
      )}
    </div>
  );
}

export default QuizFormPage;
