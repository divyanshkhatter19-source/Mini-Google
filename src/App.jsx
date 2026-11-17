import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsPanel from './components/ResultsPanel';
import LinkGraph from './components/LinkGraph';
import PageModal from './components/PageModal';
import StatsBar from './components/StatsBar';
import { useSearchEngine } from './hooks/useSearchEngine';
import './App.css';

function App() {
  const {
    pages,
    query,
    oldResults,
    newResults,
    pageRankData,
    linkStats,
    addPage,
    updatePage,
    deletePage,
    resetDataset,
    search,
    clearSearch,
  } = useSearchEngine();

  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [showGraph, setShowGraph] = useState(false);

  const handleAddPage = () => {
    setEditingPage(null);
    setShowModal(true);
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setShowModal(true);
  };

  const handleSavePage = (data) => {
    if (editingPage) {
      updatePage(editingPage.id, data.url, data.content, data.outgoingLinks);
    } else {
      addPage(data.url, data.content, data.outgoingLinks);
    }
    setShowModal(false);
    setEditingPage(null);
  };

  const handleDeletePage = (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      deletePage(id);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <button
          type="button"
          className="try-pizza-hint"
          onClick={() => search('pizza')}
          title="Click to search 'pizza'"
        >
          🍕 Try searching - &ldquo;Pizza&rdquo;
        </button>
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">🔍</span>{' '}
            <span className="logo-word mini-word">
              <span className="google-blue">M</span>
              <span className="google-red">I</span>
              <span className="google-yellow">N</span>
              <span className="google-green">I</span>
            </span>{' '}
            <span className="logo-word google-word">
              <span className="google-blue">G</span>
              <span className="google-red">O</span>
              <span className="google-yellow">O</span>
              <span className="google-blue">G</span>
              <span className="google-green">L</span>
              <span className="google-red">E</span>
            </span>
          </h1>
          <div className="app-author">(by Divyansh Khatter)</div>
          <p className="app-tagline">
            Explains and shows the new and old webpage ranking system of Google
          </p>
        </div>
      </header>

      <main className="app-main">
        <SearchBar
          query={query}
          onSearch={search}
          onClear={clearSearch}
        />

        <StatsBar
          totalPages={pages.length}
          iterations={pageRankData.iterations}
          dampingFactor={pageRankData.dampingFactor}
          onAddPage={handleAddPage}
          onResetDataset={resetDataset}
          onToggleGraph={() => setShowGraph(!showGraph)}
          showGraph={showGraph}
        />

        {showGraph && (
          <LinkGraph
            pages={pages}
            pageRankScores={pageRankData.scores}
          />
        )}

        <div className="panels-container">
          <ResultsPanel
            type="old"
            title="OLD GOOGLE"
            algorithmName="Keyword Frequency"
            description="Ranks pages based on how frequently the searched keyword appears in the page content."
            results={oldResults}
            query={query}
            linkStats={linkStats}
            onEdit={handleEditPage}
            onDelete={handleDeletePage}
          />
          <ResultsPanel
            type="new"
            title="NEW GOOGLE"
            algorithmName="Link Analysis"
            description="Ranks pages based on the importance and authority of pages, calculated using their incoming links."
            results={newResults}
            query={query}
            linkStats={linkStats}
            onEdit={handleEditPage}
            onDelete={handleDeletePage}
          />
        </div>
      </main>

      {showModal && (
        <PageModal
          page={editingPage}
          allPages={pages}
          onSave={handleSavePage}
          onClose={() => { setShowModal(false); setEditingPage(null); }}
        />
      )}
    </div>
  );
}

export default App;
