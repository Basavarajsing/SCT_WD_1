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

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Data file path
const tasksFile = path.join(__dirname, 'data', 'tasks.json');
const booksFile = path.join(__dirname, 'data', 'books.json');

// Initialize data files if they don't exist
async function initializeDataFiles() {
  try {
    await fs.ensureDir(path.join(__dirname, 'data'));
    
    // Initialize tasks.json
    if (!await fs.pathExists(tasksFile)) {
      await fs.writeJson(tasksFile, []);
    }
    
    // Initialize books.json with sample data
    if (!await fs.pathExists(booksFile)) {
      const sampleBooks = [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
          category: "Fiction",
          coverUrl: "https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Gatsby",
          downloadUrl: "https://www.gutenberg.org/files/64317/64317-h/64317-h.htm",
          fileSize: "2.3 MB"
        },
        {
          id: 2,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          description: "The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage.",
          category: "Romance",
          coverUrl: "https://via.placeholder.com/150x200/E91E63/FFFFFF?text=Pride",
          downloadUrl: "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",
          fileSize: "1.8 MB"
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          description: "A dystopian social science fiction novel and cautionary tale.",
          category: "Science Fiction",
          coverUrl: "https://via.placeholder.com/150x200/FF5722/FFFFFF?text=1984",
          downloadUrl: "https://www.gutenberg.org/files/3289/3289-h/3289-h.htm",
          fileSize: "3.1 MB"
        },
        {
          id: 4,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          description: "The story of young Scout Finch and her father Atticus in a racially divided Alabama town.",
          category: "Fiction",
          coverUrl: "https://via.placeholder.com/150x200/795548/FFFFFF?text=Mockingbird",
          downloadUrl: "https://www.gutenberg.org/files/29053/29053-h/29053-h.htm",
          fileSize: "2.7 MB"
        },
        {
          id: 5,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          description: "A fantasy novel about the adventures of Bilbo Baggins, a hobbit who embarks on a quest.",
          category: "Fantasy",
          coverUrl: "https://via.placeholder.com/150x200/8BC34A/FFFFFF?text=Hobbit",
          downloadUrl: "https://www.gutenberg.org/files/5901/5901-h/5901-h.htm",
          fileSize: "4.2 MB"
        }
      ];
      await fs.writeJson(booksFile, sampleBooks);
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
  }
}

// API Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    const newTask = {
      id: Date.now(),
      ...req.body,
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

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await fs.readJson(tasksFile);
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
      await fs.writeJson(tasksFile, tasks);
      res.json(tasks[taskIndex]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

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

app.get('/api/books', async (req, res) => {
  try {
    const books = await fs.readJson(booksFile);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const books = await fs.readJson(booksFile);
    const book = books.find(book => book.id == req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('React build not found. Please run: npm run build');
  }
});

// Initialize and start server
initializeDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}); 