import React from 'react';
import { Form } from 'react-bootstrap';

function Sidebar({ searchTerm, level, category, onSearchChange, onLevelChange, onCategoryChange }) {
  return (
    <div className="sidebar-content">
      <h3>Filters</h3>
      
      <Form.Group className="mb-3">
        <Form.Label>Search</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Search books..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Form.Group>
      
      
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select 
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="psychology">psychology</option>
          <option value="science">science</option>
         
        </Form.Select>
      </Form.Group>
    </div>
  );
}

export default Sidebar; 