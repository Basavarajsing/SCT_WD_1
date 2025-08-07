const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data file path
const tasksFile = path.join(__dirname, 'data', 'tasks.json');
const booksFile = path.join(__dirname, 'data', 'books.json');

// Ensure data directory exists
fs.ensureDirSync(path.join(__dirname, 'data'));

// Initialize data files if they don't exist
if (!fs.existsSync(tasksFile)) {
  fs.writeJsonSync(tasksFile, []);
}

if (!fs.existsSync(booksFile)) {
  const sampleBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
      cover: "https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Gatsby",
      downloadUrl: "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm",
      category: "Fiction"
    },
    {
      id: 2,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "The story follows the emotional development of Elizabeth Bennet.",
      cover: "https://via.placeholder.com/150x200/E74C3C/FFFFFF?text=Pride",
      downloadUrl: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
      category: "Romance"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      description: "A dystopian social science fiction novel and cautionary tale.",
      cover: "https://via.placeholder.com/150x200/2ECC71/FFFFFF?text=1984",
      downloadUrl: "https://www.gutenberg.org/files/3296/3296-h/3296-h.htm",
      category: "Science Fiction"
    },
    {
      id: 4,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "The story of young Scout Finch and her father Atticus in a racially divided Alabama.",
      cover: "https://via.placeholder.com/150x200/F39C12/FFFFFF?text=Mockingbird",
      downloadUrl: "https://www.gutenberg.org/files/29053/29053-h/29053-h.htm",
      category: "Fiction"
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description: "Bilbo Baggins is a hobbit who embarks on an unexpected journey.",
      cover: "https://via.placeholder.com/150x200/9B59B6/FFFFFF?text=Hobbit",
      downloadUrl: "https://www.gutenberg.org/files/11/11-h/11-h.htm",
      category: "Fantasy"
    }
  ];
  fs.writeJsonSync(booksFile, sampleBooks);
}

// API Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    const newTask = {
      id: Date.now(),
      name: req.body.name,
      description: req.body.description,
      deadline: req.body.deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    await fs.writeJson(tasksFile, tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    await fs.writeJson(tasksFile, tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    const filteredTasks = tasks.filter(task => task.id != req.params.id);
    await fs.writeJson(tasksFile, filteredTasks);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const books = await fs.readJson(booksFile);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read books' });
  }
});

// Get a specific book
app.get('/api/books/:id', async (req, res) => {
  try {
    const books = await fs.readJson(booksFile);
    const book = books.find(book => book.id == req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read book' });
  }
});

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 