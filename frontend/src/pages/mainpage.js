import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBook, faGraduationCap, faLanguage, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import TopMenu from '../components/main/TopMenu';
import { fetchArticles, fetchReadArticles } from '../components/main/utils/articleApi';
import '../assets/styles/mainpage.css';
import { useAuth } from '../context/AuthContext';

function MainPage() {
  const [level, setLevel] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [readArticleIds, setReadArticleIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [articlesData, readArticlesData] = await Promise.all([
          fetchArticles(),
          currentUser ? fetchReadArticles() : []
        ]);
        setArticles(articlesData);
        setReadArticleIds(readArticlesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  // Check if a specific article level has been read
  const isArticleLevelRead = (articleId) => {
    return readArticleIds.includes(articleId);
  };

  const handleLevelSelect = (title, selectedLevel) => {
    // Check if user is logged in
    if (!currentUser) {
      // Redirect to home page and open signup popup
      navigate('/', { state: { openSignupModal: true } });
      return;
    }

    // API'deki difficulty değerleri "A1_A2", "B1_B2", "C1_C2"
    const article = articles.find(a => a.title === title);
    if (!article) return;

    // "A1-A2" -> "A1_A2"
    const key = selectedLevel.replace('-', '_');
    const contentObj = article.articles.find(a => a.difficulty === key);
    if (!contentObj) return;

    navigate('/article', {
      state: {
        title: article.title,
        image: article.imageLink,
        difficulty: selectedLevel, 
        content: contentObj.content,
        articleId: contentObj.articleId,
        articles: article.articles
      }
    });
  };

  // Helper function to get the largest articleId for an article
  const getMaxArticleId = (article) => {
    if (!article.articles || article.articles.length === 0) return 0;
    return Math.max(...article.articles.map(content => content.articleId || 0));
  };

  const filteredArticles = articles.filter(article => {
    if (level !== 'all') {
      if (!article.articles.some(a => a.difficulty === level.replace('-', '_'))) {
        return false;
      }
    }
    if (searchTerm && !article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (category !== 'all' && article.category !== category) {
      return false;
    }
    return true;
  })
  // Sort by largest articleId first
  .sort((a, b) => {
    const maxIdA = getMaxArticleId(a);
    const maxIdB = getMaxArticleId(b);
    return maxIdB - maxIdA; // Descending order (largest first)
  });

  return (
    <div className="main-page">
      <TopMenu />
      
      {/* Welcome Section */}
      <div className="welcome-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="welcome-text">
              <h1 className="welcome-title">Welcome to Reading Lesson</h1>
              <p className="welcome-description">
                Enhance your English reading skills with our interactive articles. 
                Click on words to see their lemmatized forms and build your vocabulary.
              </p>
              <div className="feature-highlights">
                <div className="feature-item">
                  <FontAwesomeIcon icon={faBook} className="feature-icon" />
                  <span>Interactive Reading</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faLanguage} className="feature-icon" />
                  <span>Vocabulary Building</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faGraduationCap} className="feature-icon" />
                  <span>Multiple Difficulty Levels</span>
                </div>
              </div>
            </Col>
            <Col md={6} className="welcome-image">
              <div className="image-container">
               
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Search and Filter Section */}
      <div className="filter-section">
        <Container>
          <Row className="align-items-center">
            <Col md={4} className="mb-3 mb-md-0">
              <Form.Group className="search-box">
                <Form.Control
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </Form.Group>
            </Col>
            <Col md={8}>
              <div className="filter-buttons">
                <div className="filter-group">
                  <span className="filter-label">Level:</span>
                  <div className="d-flex flex-wrap ">
                    <Button 
                      variant={level === 'all' ? 'primary' : 'outline-primary'} 
                      onClick={() => setLevel('all')}
                      className="filter-btn"
                    >
                      All
                    </Button>
                    <Button 
                      variant={level === 'A1-A2' ? 'primary' : 'outline-primary'} 
                      onClick={() => setLevel('A1-A2')}
                      className="filter-btn level-a1-a2"
                    >
                      A1-A2
                    </Button>
                    <Button 
                      variant={level === 'B1-B2' ? 'primary' : 'outline-primary'} 
                      onClick={() => setLevel('B1-B2')}
                      className="filter-btn level-b1-b2"
                    >
                      B1-B2
                    </Button>
                    <Button 
                      variant={level === 'C1-C2' ? 'primary' : 'outline-primary'} 
                      onClick={() => setLevel('C1-C2')}
                      className="filter-btn level-c1-c2"
                    >
                      C1-C2
                    </Button>
                  </div>
                </div>
                <div className="filter-group">
                  <span className="filter-label">Category:</span>
                  <div className="d-flex flex-wrap">
                    <Button 
                      variant={category === 'all' ? 'primary' : 'outline-primary'} 
                      onClick={() => setCategory('all')}
                      className="filter-btn"
                    >
                      All
                    </Button>
                    <Button 
                      variant={category === 'science' ? 'primary' : 'outline-primary'} 
                      onClick={() => setCategory('science')}
                      className="filter-btn"
                    >
                      Science
                    </Button>
                    <Button 
                      variant={category === 'psychology' ? 'primary' : 'outline-primary'} 
                      onClick={() => setCategory('psychology')}
                      className="filter-btn"
                    >
                      Psychology
                    </Button>
                    <Button 
                      variant={category === 'movie' ? 'primary' : 'outline-primary'} 
                      onClick={() => setCategory('movie')}
                      className="filter-btn"
                    >
                      Movie
                    </Button>
                    <Button 
                      variant={category === 'history' ? 'primary' : 'outline-primary'} 
                      onClick={() => setCategory('history')}
                      className="filter-btn"
                    >
                      History
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Articles Section */}
      <div className="articles-section">
        <Container>
          <h2 className="section-title">Available Articles</h2>
          <h6 className='arrow-down'>&#x290B;</h6>

          <Row>
            {isLoading ? (
              <Col className="text-center">
                <div className="loading-spinner"></div>
                <p>Loading articles...</p>
              </Col>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <Col xs={12} sm={6} md={4} key={index} className="mb-4">
                  <Card className="book-card">
                    <div className="card-img-container">
                      <Card.Img 
                        variant="top" 
                        src={article.imageLink || `https://source.unsplash.com/random/400x200/?book,${article.title}`} 
                        alt={article.title}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{article.title}</Card.Title>
                      <div className="category-badge">
                        {article.category || 'Uncategorized'}
                      </div>
                      <div className="level-buttons">
                        {article.articles.map((content, idx) => {
                          // If a specific level is selected and this is not that level, hide the button
                          const levelKey = content.difficulty.replace('_', '-');
                          const shouldShow = level === 'all' || level === levelKey;
                          const isRead = isArticleLevelRead(content.articleId);
                          const buttonClass = `level-btn ${levelKey.toLowerCase()} ${isRead ? 'read' : ''}`;
                          
                          return (
                            <div key={idx} className="level-wrapper" style={{ display: shouldShow ? 'flex' : 'none' }}>
                              <Button
                                className={buttonClass}
                                onClick={() => handleLevelSelect(article.title, levelKey)}
                              >
                                {levelKey}
                                {isRead && (
                                  <FontAwesomeIcon icon={faCheckCircle} className="read-icon" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                      <Card.Text>
                        {article.articles[0].content.substring(0, 100)}...
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center no-results">
                <h3>No articles found</h3>
                <p>Try adjusting your search or filters</p>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default MainPage; 