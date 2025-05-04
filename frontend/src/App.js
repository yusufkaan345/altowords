import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import MainPage from './pages/mainpage';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArticlePage from './pages/articlepage';
import MyWordsPage from './pages/mywordspage';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/utils/ScrollToTop';
import TestsPage from './pages/TestsPage';
import RankPage from './pages/rankpage';
// Create a wrapper component to use the useLocation hook

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/mywords" element={<MyWordsPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/rank" element={<RankPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
