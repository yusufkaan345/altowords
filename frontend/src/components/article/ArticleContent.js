import React from 'react';
import { Image } from 'react-bootstrap';

const ArticleContent = ({ 
  title, 
  image, 
  difficulty, 
  content, 
  renderClickableWords 
}) => {
  return (
    <div className="article-card">
      <div className="article-image-container">
        <Image 
          src={image || `https://source.unsplash.com/random/800x400/?book,${title}`} 
          fluid 
          className="article-image" 
          alt={title}
          loading="lazy"
        />
      </div>
      
      <div className="article-content">
        <h1 className="article-title">
          {renderClickableWords(title)}
        </h1>
        <h5 className={`article-difficulty difficulty-${difficulty.toLowerCase().replace('-', '-')}`}>
          {difficulty}
        </h5>
        <div className="article-text">
          {renderClickableWords(content)}
        </div>
      </div>
    </div>
  );
};

export default ArticleContent; 