import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';

function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkPage, setBookmarkPage] = useState(1);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data);
      
      // Load bookmark if exists
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
      const bookmark = bookmarks[id];
      if (bookmark) {
        setCurrentPage(bookmark.page);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to fetch book');
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = (page) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    bookmarks[id] = {
      page,
      timestamp: new Date().toISOString(),
      bookTitle: book.title
    };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    saveBookmark(newPage);
  };

  const getBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    return bookmarks[id] || null;
  };

  const handleBookmarkSave = () => {
    saveBookmark(bookmarkPage);
    setShowBookmarkModal(false);
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

  if (error || !book) {
    return (
      <div className="main-content">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Book not found'}</p>
          <hr />
          <Button as={Link} to="/books" variant="outline-danger">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Library
          </Button>
        </Alert>
      </div>
    );
  }

  const bookmark = getBookmark();

  return (
    <div className="main-content">
      {/* Book Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-3">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/books')}
              className="me-3"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Library
            </Button>
            <h1 className="mb-0">{book.title}</h1>
          </div>
          <div className="d-flex align-items-center">
            <Badge bg="secondary" className="me-3">
              {book.category}
            </Badge>
            <span className="text-muted">by {book.author}</span>
            {bookmark && (
              <Badge bg="warning" className="ms-3">
                <i className="fas fa-bookmark me-1"></i>
                Bookmarked at Page {bookmark.page}
              </Badge>
            )}
          </div>
        </Col>
        <Col xs="auto">
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              onClick={() => setShowBookmarkModal(true)}
            >
              <i className="fas fa-bookmark me-2"></i>
              Set Bookmark
            </Button>
            <Button 
              variant="outline-success" 
              onClick={() => window.open(book.downloadUrl, '_blank')}
            >
              <i className="fas fa-download me-2"></i>
              Download
            </Button>
          </div>
        </Col>
      </Row>

      {/* Book Description */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h6>About this book:</h6>
              <p className="text-muted mb-0">{book.description}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* PDF Viewer */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-file-pdf me-2"></i>
                  Reader
                </h5>
                <div className="d-flex align-items-center">
                  <span className="text-muted me-3">
                    Page {currentPage}
                  </span>
                  <div className="btn-group btn-group-sm">
                    <Button 
                      variant="outline-secondary"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="pdf-viewer">
                <iframe
                  src={`${book.downloadUrl}#page=${currentPage}`}
                  title={book.title}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bookmark Modal */}
      <Modal show={showBookmarkModal} onHide={() => setShowBookmarkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Bookmark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Set a bookmark for this book. You can return to this page later.</p>
          <div className="mb-3">
            <label htmlFor="bookmarkPage" className="form-label">Page Number</label>
            <input
              type="number"
              className="form-control"
              id="bookmarkPage"
              value={bookmarkPage}
              onChange={(e) => setBookmarkPage(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          {bookmark && (
            <Alert variant="info">
              <i className="fas fa-info-circle me-2"></i>
              Current bookmark: Page {bookmark.page} (set on {new Date(bookmark.timestamp).toLocaleDateString()})
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookmarkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBookmarkSave}>
            Save Bookmark
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BookReader; 