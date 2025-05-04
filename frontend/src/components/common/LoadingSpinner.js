import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../../assets/styles/loading.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
}

export default LoadingSpinner; 