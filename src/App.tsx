import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./shared/components/layout/Header";
import PodcastListPage from "./features/podcast-list/pages/PodcastListPage";
import "./App.css";
import PodcastDetailPage from "./features/podcast-detail/pages/PodcastDetailPage";
import EpisodeDetailPage from "./features/episode-details/pages/EpisodeDetailPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main id="main-content" className="app__main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<PodcastListPage />} />
            <Route path="/podcast/:podcastId" element={<PodcastDetailPage />} />
            <Route
              path="/podcast/:podcastId/episode/:episodeId"
              element={<EpisodeDetailPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
