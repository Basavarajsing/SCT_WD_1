# TaskLit - Task Manager & eBook Library

A lightweight web application that combines task management with an eBook library. Built with React.js frontend and Node.js backend.

## Features

### 📋 Task Management
- **Add/Edit/Delete Tasks**: Create tasks with name, description, and deadline
- **Mark Complete**: Toggle task completion status with checkboxes
- **Filter Tasks**: View all, completed, or pending tasks
- **Progress Tracking**: Visual progress indicators and statistics
- **Deadline Management**: Set and track task deadlines with overdue indicators

### 📚 eBook Library
- **Browse Books**: View a collection of free eBooks with covers and descriptions
- **Read Online**: Embedded PDF viewer for reading books directly in the browser
- **Download Books**: Direct download links to eBook files
- **Bookmarks**: Save reading progress using localStorage
- **Category Filtering**: Filter books by genre/category

### 🎨 Modern UI
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Bootstrap Styling**: Clean, modern interface with smooth animations
- **Dashboard**: Overview with statistics and quick actions
- **Intuitive Navigation**: Easy-to-use navigation between features

## Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **React Router**: Client-side routing
- **Bootstrap 5**: Responsive CSS framework
- **Axios**: HTTP client for API calls
- **Font Awesome**: Icons

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **fs-extra**: Enhanced file system operations

### Data Storage
- **JSON Files**: Simple file-based storage for tasks and books
- **LocalStorage**: Client-side bookmarks and user preferences

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Step 1: Clone/Download the Project
```bash
# If you have the project files, navigate to the project directory
cd tasklit
```

### Step 2: Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Start the Application

#### Option A: Development Mode (Recommended)
```bash
# Terminal 1: Start the backend server
npm run dev

# Terminal 2: Start the React development server
npm run client
```

#### Option B: Production Mode
```bash
# Build the React app
npm run build

# Start the production server
npm start
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Endpoints**: http://localhost:5000/api

## Project Structure

```
tasklit/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── TaskList.js
│   │   │   ├── BookLibrary.js
│   │   │   └── BookReader.js
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── data/                  # JSON data files
│   ├── tasks.json         # Task data
│   └── books.json         # Book data
├── server.js              # Express server
├── package.json           # Backend dependencies
└── README.md             # This file
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book

## Usage Guide

### Task Management
1. **Adding Tasks**: Click "Add Task" button and fill in the form
2. **Editing Tasks**: Click the edit icon on any task card
3. **Completing Tasks**: Check the checkbox to mark as complete
4. **Filtering**: Use the filter buttons to view different task states
5. **Deleting**: Click the trash icon to remove tasks

### eBook Library
1. **Browsing**: View all available books in the library
2. **Filtering**: Use category buttons to filter books
3. **Reading**: Click "Read Online" to open the PDF viewer
4. **Downloading**: Click "Download" to get the book file
5. **Bookmarking**: Set bookmarks to save your reading progress

### Dashboard
- View overall statistics and progress
- Quick access to add tasks or browse books
- Progress indicators and completion rates

## Data Storage

### Tasks
Tasks are stored in `data/tasks.json` with the following structure:
```json
{
  "id": 1234567890,
  "name": "Task Name",
  "description": "Task description",
  "deadline": "2024-01-15T10:00:00.000Z",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Books
Books are stored in `data/books.json` with the following structure:
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "cover": "cover-image-url",
  "downloadUrl": "book-download-url",
  "category": "Fiction"
}
```

### Bookmarks
Bookmarks are stored in browser localStorage:
```json
{
  "bookId": {
    "page": 42,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "bookTitle": "Book Title"
  }
}
```

## Customization

### Adding New Books
Edit `data/books.json` to add new books:
```json
{
  "id": 6,
  "title": "New Book",
  "author": "New Author",
  "description": "Book description",
  "cover": "https://via.placeholder.com/150x200/color/FFFFFF?text=Title",
  "downloadUrl": "https://example.com/book.pdf",
  "category": "Category"
}
```

### Styling
- Modify `client/src/index.css` for global styles
- Edit `client/src/App.css` for app-specific styles
- Bootstrap classes can be customized in the components

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **Module Not Found Errors**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API Connection Issues**
   - Ensure the backend server is running on port 5000
   - Check that the proxy is set correctly in `client/package.json`
   - Verify CORS settings in `server.js`

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reloading
2. **API Testing**: Use tools like Postman to test API endpoints
3. **Console Logs**: Check browser console and server logs for debugging
4. **Data Reset**: Delete `data/tasks.json` to reset task data

## Deployment

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main
```

### Vercel (Frontend Only)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the console logs
3. Ensure all dependencies are installed
4. Verify the server is running

---

**TaskLit** - Where productivity meets literature! 📚✨ 