// App.jsx
import React from 'react';
import { darkTheme } from './utils/Themes.js';
import { ThemeProvider } from "styled-components";
import { Routes, Route, HashRouter as Router } from 'react-router-dom'; 
import BioSection from './pages/Bio.jsx';
import SkillsSection from './pages/Skills.jsx';
import ExperienceSection from './pages/Experience.jsx';
import ProjectsSection from './pages/Projects.jsx';
import EducationSection from './pages/Education.jsx';
import Portal from './pages/Portal.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Login />;
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider> 
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Portal />} />
            <Route path="/Bio" element={<PrivateRoute element={<BioSection />} />} />
            <Route path="/Skills" element={<PrivateRoute element={<SkillsSection />} />} />
            <Route path="/Experience" element={<PrivateRoute element={<ExperienceSection />} />} />
            <Route path="/Projects" element={<PrivateRoute element={<ProjectsSection />} />} />
            <Route path="/Education" element={<PrivateRoute element={<EducationSection />} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
