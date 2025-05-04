import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

const SaveButton = ({ onSave, isLoading }) => {
  return (
    <div className="save-finish-container">
      <Button 
        variant="primary" 
        className="save-finish-button"
        onClick={onSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner 
              as="span" 
              animation="border" 
              size="sm" 
              role="status" 
              aria-hidden="true" 
              className="me-2"
            />
            Saving...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faSave} /> Save and Finish
          </>
        )}
      </Button>
    </div>
  );
};

export default SaveButton; 