import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./shared/components/layout/Header";
import PodcastListPage from "./features/podcast-list/pages/PodcastListPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<PodcastListPage />} />
            {/* We will add more routes later */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
