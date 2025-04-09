
//frontend/src/App.js
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard';
import Workspace from './pages/Workspace';
import Board from './pages/Board';
import TaskDetail from './pages/TaskDetail';
import Layout from './components/layout/Layout';
import './index.css';

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <BrowserRouter>
      <div className='content-wrap'>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

        {/* Routes protégées */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="workspaces/:id" element={<Workspace />} />
          <Route path="boards/:id" element={<Board />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
        </Route>

        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes> 
      </div>
    </BrowserRouter>
    <footer className="footer">
      <p>&copy; KO 2025 - Project Management Application </p>
    </footer>
     <ToastContainer />
     
     
     </div>
 );
}

export default App;
