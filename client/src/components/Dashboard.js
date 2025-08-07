import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalBooks: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tasksResponse, booksResponse] = await Promise.all([
          axios.get('/api/tasks'),
          axios.get('/api/books')
        ]);

        const tasks = tasksResponse.data;
        const books = booksResponse.data;

        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter(task => task.completed).length,
          pendingTasks: tasks.filter(task => !task.completed).length,
          totalBooks: books.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="main-content">
      <h1 className="mb-4">
        <i className="fas fa-chart-line me-2"></i>
        Dashboard
      </h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card text-white">
            <Card.Body>
              <h3>Total Tasks</h3>
              <div className="stat-number">{stats.totalTasks}</div>
              <small>All your tasks</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-white" style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'}}>
            <Card.Body>
              <h3>Completed</h3>
              <div className="stat-number">{stats.completedTasks}</div>
              <small>Tasks finished</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-white" style={{background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'}}>
            <Card.Body>
              <h3>Pending</h3>
              <div className="stat-number">{stats.pendingTasks}</div>
              <small>Tasks to do</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card text-white" style={{background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)'}}>
            <Card.Body>
              <h3>eBooks</h3>
              <div className="stat-number">{stats.totalBooks}</div>
              <small>Available books</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-tasks me-2"></i>
                Task Progress
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Completion Rate</span>
                <Badge bg={completionRate >= 80 ? 'success' : completionRate >= 50 ? 'warning' : 'danger'}>
                  {completionRate}%
                </Badge>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{width: `${completionRate}%`}}
                  aria-valuenow={completionRate} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <Button as={Link} to="/tasks" variant="primary" className="w-100">
                <i className="fas fa-plus me-2"></i>
                Add New Task
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-book me-2"></i>
                eBook Library
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">
                Explore our collection of free eBooks. All books are available for reading online or downloading.
              </p>
              <div className="d-grid gap-2">
                <Button as={Link} to="/books" variant="outline-primary">
                  <i className="fas fa-eye me-2"></i>
                  Browse Library
                </Button>
                <Button as={Link} to="/books" variant="outline-success">
                  <i className="fas fa-download me-2"></i>
                  Download Books
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2"></i>
                Quick Tips
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-check-circle text-success" style={{fontSize: '2rem'}}></i>
                    <h6 className="mt-2">Mark Tasks Complete</h6>
                    <small className="text-muted">Use checkboxes to track your progress</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-filter text-info" style={{fontSize: '2rem'}}></i>
                    <h6 className="mt-2">Filter Tasks</h6>
                    <small className="text-muted">View all, completed, or pending tasks</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <i className="fas fa-bookmark text-warning" style={{fontSize: '2rem'}}></i>
                    <h6 className="mt-2">Save Progress</h6>
                    <small className="text-muted">Bookmarks are saved automatically</small>
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

export default Dashboard; 