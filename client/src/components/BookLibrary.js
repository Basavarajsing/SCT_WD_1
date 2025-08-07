import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function BookLibrary() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/books');
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => 
    selectedCategory === 'all' || book.category === selectedCategory
  );

  const handleDownload = (book) => {
    // For demo purposes, we'll open the download URL in a new tab
    // In a real app, you might want to trigger an actual download
    window.open(book.downloadUrl, '_blank');
  };

  const getBookmark = (bookId) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    return bookmarks[bookId] || null;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-3">
            <i className="fas fa-book me-2"></i>
            eBook Library
          </h1>
          <p className="text-muted">
            Explore our collection of free eBooks. All books are available for reading online or downloading.
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Category Filter */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {category !== 'all' && (
                  <Badge bg="light" text="dark" className="ms-2">
                    {books.filter(book => book.category === category).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {filteredBooks.length === 0 ? (
        <Card>
          <Card.Body className="empty-state">
            <i className="fas fa-books"></i>
            <h5>No books found</h5>
            <p className="text-muted">
              {selectedCategory === 'all' 
                ? 'No books available in the library.' 
                : `No books found in the "${selectedCategory}" category.`
              }
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredBooks.map(book => {
            const bookmark = getBookmark(book.id);
            
            return (
              <Col key={book.id} lg={4} md={6} className="mb-4">
                <Card className="book-card h-100">
                  <div className="position-relative">
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="book-cover w-100"
                    />
                    {bookmark && (
                      <Badge 
                        bg="warning" 
                        className="position-absolute top-0 end-0 m-2"
                      >
                        <i className="fas fa-bookmark me-1"></i>
                        Bookmarked
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Badge bg="secondary" className="mb-2">
                        {book.category}
                      </Badge>
                    </div>
                    
                    <h5 className="card-title">{book.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      by {book.author}
                    </h6>
                    
                    <p className="card-text flex-grow-1">
                      {book.description}
                    </p>
                    
                    {bookmark && (
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="fas fa-bookmark me-1"></i>
                          Last read: Page {bookmark.page}
                        </small>
                      </div>
                    )}
                    
                    <div className="d-grid gap-2 mt-auto">
                      <Button 
                        as={Link} 
                        to={`/books/${book.id}`} 
                        variant="primary"
                        className="mb-2"
                      >
                        <i className="fas fa-eye me-2"></i>
                        Read Online
                      </Button>
                      <Button 
                        variant="outline-success" 
                        onClick={() => handleDownload(book)}
                      >
                        <i className="fas fa-download me-2"></i>
                        Download
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Library Stats */}
      <Row className="mt-5">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Library Information
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-primary">{books.length}</h4>
                    <small className="text-muted">Total Books</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-success">{categories.length - 1}</h4>
                    <small className="text-muted">Categories</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-info">
                      {books.filter(book => getBookmark(book.id)).length}
                    </h4>
                    <small className="text-muted">Bookmarked</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h4 className="text-warning">
                      {books.filter(book => book.downloadUrl).length}
                    </h4>
                    <small className="text-muted">Available for Download</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default BookLibrary; 