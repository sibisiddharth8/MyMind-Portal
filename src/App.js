import React from 'react';
import { darkTheme } from './utils/Themes.js';
import { ThemeProvider } from "styled-components";
import { Routes, Route, HashRouter as Router } from 'react-router-dom'; 
import BioSection from './pages/Bio.jsx';
import SkillsSection from './pages/Skills.jsx';
import ExperienceSection from './pages/Experience.jsx';
import ProjectsSection from './pages/Projects.jsx';
import EducationSection from './pages/Education.jsx';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
          <Routes>
            <Route path="/" element={<div>Portal</div>} />
            <Route path="/Bio" element={<BioSection />} />
            <Route path="/skills" element={<SkillsSection />} />
            <Route path="/experience" element={<ExperienceSection />} />
            <Route path="/projects" element={<ProjectsSection />} />
            <Route path="/education" element={<EducationSection />} />
          </Routes>
       
      </Router>
    </ThemeProvider>

  );
}

export default App;
