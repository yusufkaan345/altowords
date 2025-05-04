import React from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faBook ,faSearch } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/mywordspage.css';
/**
 * Sidebar with filtering options for words
 */
const FilterSidebar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterArticle, 
  setFilterArticle, 
  articles, 
  totalWords,
  resetFilters 
}) => {
  return (
    <div className="sidebar">
      <Card className="filter-card">
        <Card.Body>
          <h5 className="filter-title">
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            Filters
          </h5>
          
          <Form>
            <Form.Group className="mb-3 ">
              <Form.Label>
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Search</Form.Label>
              <InputGroup>
               
                <Form.Control
                  type="text"
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>
                <FontAwesomeIcon icon={faBook} className="me-2" />
                Article
              </Form.Label>
              <Form.Select
                value={filterArticle}
                onChange={(e) => setFilterArticle(e.target.value)}
              >
                <option value="all">All Articles</option>
                {articles.map((article) => (
                  <option key={article.id} value={article.id.toString()}>
                    {article.title} {article.difficulty}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Button 
              variant="primary" 
              className="w-100"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="mt-3 stats-card">
        <Card.Body>
          <h5 className="stats-title">Statistics</h5>
          <div className="stats-item">
            <span>Total Words:</span>
            <strong>{totalWords}</strong>
          </div>
          <div className="stats-item">
            <span>Articles:</span>
            <strong>{articles.length}</strong>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FilterSidebar; 