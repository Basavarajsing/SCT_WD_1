import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import TaskList from './components/TaskList';
import BookLibrary from './components/BookLibrary';
import BookReader from './components/BookReader';
import Dashboard from './components/Dashboard';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-tasks me-2"></i>
          TaskLit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active' : ''}>
              <i className="fas fa-chart-line me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/tasks" className={location.pathname === '/tasks' ? 'active' : ''}>
              <i className="fas fa-list-check me-1"></i>
              Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/books" className={location.pathname.startsWith('/books') ? 'active' : ''}>
              <i className="fas fa-book me-1"></i>
              eBooks
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Container fluid>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/books" element={<BookLibrary />} />
            <Route path="/books/:id" element={<BookReader />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App; 