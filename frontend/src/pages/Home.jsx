import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page home-page">
      <h1>Test what you know. Build what others will.</h1>
      <p>
        Take a quiz to see how you score, or open the admin panel to write your own
        quizzes and questions.
      </p>
      <div className="home-actions">
        <Link to="/quizzes" className="btn btn-primary">Browse Quizzes</Link>
        <Link to="/admin" className="btn btn-secondary">Go to Admin</Link>
      </div>
    </div>
  );
}

export default Home;
