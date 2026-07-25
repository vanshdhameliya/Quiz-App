import React, { useState } from 'react';
import adminApi from '../../api/adminApi';

function emptyForm() {
  return { questionText: '', options: ['', '', '', ''], correctOption: 0 };
}

function QuestionManager({ quizId, questions, onChange }) {
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedOptions = form.options.map((o) => o.trim()).filter((o) => o !== '');

    if (trimmedOptions.length < 2) {
      setError('Add at least 2 answer options.');
      return;
    }

    const payload = {
      questionText: form.questionText,
      options: trimmedOptions,
      correctOption: Math.min(form.correctOption, trimmedOptions.length - 1),
    };

    const request = editingId
      ? adminApi.put(`/quizzes/questions/${editingId}`, payload)
      : adminApi.post(`/quizzes/${quizId}/questions`, payload);

    request
      .then(() => {
        resetForm();
        setError(null);
        onChange();
      })
      .catch(() => setError('Could not save question.'));
  };

  const handleEdit = (question) => {
    const options = [...question.options];
    while (options.length < 4) options.push('');
    setForm({ questionText: question.questionText, options, correctOption: question.correctOption });
    setEditingId(question.id);
    setError(null);
  };

  const handleDelete = (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    adminApi.delete(`/quizzes/questions/${questionId}`)
      .then(onChange)
      .catch(() => setError('Could not delete question.'));
  };

  return (
    <div className="question-manager">
      <h3>Questions</h3>
      {error && <p className="error">{error}</p>}

      <ul className="question-list">
        {questions && questions.map((q, idx) => (
          <li key={q.id}>
            <div>
              <strong>{idx + 1}. {q.questionText}</strong>
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i} className={i === q.correctOption ? 'correct-option' : ''}>{opt}</li>
                ))}
              </ul>
            </div>
            <div className="question-actions">
              <button className="btn btn-small btn-secondary" onClick={() => handleEdit(q)}>Edit</button>
              <button className="btn btn-small btn-danger" onClick={() => handleDelete(q.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <h4>{editingId ? 'Edit Question' : 'Add Question'}</h4>
      <form onSubmit={handleSubmit} className="question-form">
        <label>
          Question Text
          <input
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
            required
          />
        </label>

        <label>Answer options (select the radio next to the correct one)</label>
        {form.options.map((opt, idx) => (
          <label key={idx} className="option-input">
            <input
              type="radio"
              name="correctOption"
              checked={form.correctOption === idx}
              onChange={() => setForm({ ...form, correctOption: idx })}
            />
            <input
              type="text"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          </label>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Question' : 'Add Question'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default QuestionManager;
