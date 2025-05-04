import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

function BookCard({ title, image, category, excerpt, onLevelSelect }) {
  return (
    <Card className="book-card">
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Badge bg="secondary" className="mb-2 text-uppercase">{category}</Badge>
        <Card.Text>{excerpt}</Card.Text>
        <div className="level-buttons">
          <Button 
            variant="outline-success" 
            className="level-btn level-a1-a2"
            onClick={() => onLevelSelect(title, 'A1-A2')}
          >
            A1-A2
          </Button>
          <Button 
            variant="outline-warning" 
            className="level-btn level-b1-b2"
            onClick={() => onLevelSelect(title, 'B1-B2')}
          >
            B1-B2
          </Button>
          <Button 
            variant="outline-danger" 
            className="level-btn level-c1-c2"
            onClick={() => onLevelSelect(title, 'C1-C2')}
          >
            C1-C2
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookCard; 