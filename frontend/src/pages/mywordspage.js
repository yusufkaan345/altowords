import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import TopMenu from '../components/main/TopMenu';
import WordStrip from '../components/mywords/WordStrip';
import { useUserWords } from '../hooks/useUserWords';
import '../assets/styles/mywordspage.css';
import FilterSidebar from '../components/mywords/FilterSidebar';

function MyWordsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { articleId: initialArticleId } = location.state || {};
  
  const {
    filteredWords,
    articles,
    wordTypes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterArticle,
    setFilterArticle,
    filterType,
    setFilterType,
    resetFilters,
    deleteWord
  } = useUserWords();

  // Set initial article filter if provided in state
  useEffect(() => {
    if (initialArticleId) {
      setFilterArticle(initialArticleId.toString());
    }
  }, [initialArticleId, setFilterArticle]);

  return (
    <div className="my-words-page">
      <TopMenu />
      
      <Container fluid className=" pt-5">
        <h1 className="page-title">My Saved Words</h1>
        
        {error && (
          <Alert variant="danger" className="mx-auto" style={{ maxWidth: '800px' }}>
            {error}
          </Alert>
        )}
        
        <Row>
          {/* Sidebar */}
          <Col md={3} className="mb-4">
            <FilterSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterArticle={filterArticle}
              setFilterArticle={setFilterArticle}
              filterType={filterType}
              setFilterType={setFilterType}
              wordTypes={wordTypes}
              articles={articles}
              totalWords={filteredWords.length}
              resetFilters={resetFilters}
            />
          </Col>
          
          {/* Main Content */}
          <Col md={9}>
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status" className="spinner">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : filteredWords.length > 0 ? (
              <div className="word-strips-container">
                {filteredWords.map((word, index) => (
                  <WordStrip key={index} word={word} onDelete={deleteWord} />
                ))}
              </div>
            ) : (
              <div className="no-words-message">
                <p>No words found matching your filters.</p>
                {searchTerm || filterArticle !== 'all' || filterType !== 'all' ? (
                  <Button 
                    variant="outline-primary"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button 
                    variant="secondary"
                    onClick={() => navigate('/main')}
                  >
                    Browse Articles
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MyWordsPage; 