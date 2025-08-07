
import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Button, Form, Modal, 
  Badge, ButtonGroup, Spinner, Alert 
} from 'react-bootstrap';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}`, formData);
      } else {
        await axios.post('/api/tasks', formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({ name: '', description: '', deadline: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
      console.error('Error saving task:', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description,
      deadline: task.deadline ? task.deadline.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await axios.put(`/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (deadline, completed) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && !completed;
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
            <i className="fas fa-list-check me-2"></i>
            Task Manager
          </h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Add Task
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Row className="mb-3">
        <Col>
          <ButtonGroup>
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </Button>
            <Button 
              variant={filter === 'pending' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('pending')}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </Button>
            <Button 
              variant={filter === 'completed' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('completed')}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      {filteredTasks.length === 0 ? (
        <Card>
          <Card.Body className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <h5>No tasks found</h5>
            <p className="text-muted">
              {filter === 'all' 
                ? 'Create your first task to get started!' 
                : `No ${filter} tasks found.`
              }
            </p>
            {filter === 'all' && (
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Add Your First Task
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredTasks.map(task => (
            <Col key={task.id} lg={4} md={6} className="mb-3">
              <Card className={`task-card ${task.completed ? 'completed' : ''}`}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Form.Check
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                      label=""
                    />
                    <div className="task-actions">
                      <Button 
                        size="sm" 
                        variant="outline-primary" 
                        onClick={() => handleEdit(task)}
                        className="me-1"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline-danger" 
                        onClick={() => handleDelete(task.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                  
                  <h6 className={`mb-2 ${task.completed ? 'completed-task' : ''}`}>
                    {task.name}
                  </h6>
                  
                  {task.description && (
                    <p className={`text-muted mb-2 ${task.completed ? 'completed-task' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="fas fa-calendar me-1"></i>
                      {formatDate(task.deadline)}
                    </small>
                    {isOverdue(task.deadline, task.completed) && (
                      <Badge bg="danger">Overdue</Badge>
                    )}
                  </div>
                  
                  <small className="text-muted d-block mt-2">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Add/Edit Task Modal */}
      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setEditingTask(null);
        setFormData({ name: '', description: '', deadline: '' });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Task Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter task name"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter task description (optional)"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default TaskList;