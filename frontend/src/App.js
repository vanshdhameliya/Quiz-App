import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import ResultPage from './pages/ResultPage';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import QuizFormPage from './pages/admin/QuizFormPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id/play" element={<TakeQuiz />} />
            <Route path="/quizzes/:id/result" element={<ResultPage />} />

            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/quizzes/new"
              element={
                <RequireAuth>
                  <QuizFormPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/quizzes/:id"
              element={
                <RequireAuth>
                  <QuizFormPage />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
