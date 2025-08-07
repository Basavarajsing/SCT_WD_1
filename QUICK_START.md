# TaskLit - Quick Start Guide

Get TaskLit running in 5 minutes! 🚀

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Quick Setup

### 1. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Start the Application

#### Option A: Automatic Start (Windows)
```bash
# Double-click or run:
start.bat
```

#### Option B: Automatic Start (Linux/Mac)
```bash
# Make script executable and run:
chmod +x start.sh
./start.sh
```

#### Option C: Manual Start
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
npm run client
```

### 3. Access the App
- Open your browser and go to: **http://localhost:3000**
- The backend API is available at: **http://localhost:5000**

## What You'll See

### Dashboard
- Overview statistics
- Quick access to tasks and books
- Progress indicators

### Task Management
- Add new tasks with deadlines
- Mark tasks as complete
- Filter by status (All/Pending/Completed)
- Edit or delete tasks

### eBook Library
- Browse available books
- Read books online
- Download books
- Set bookmarks to save progress

## Sample Data
The app comes with:
- 5 sample tasks
- 5 free eBooks from Project Gutenberg
- Sample bookmarks (if you've used the app before)

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000 5000
```

### Module Not Found
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Can't Access the App
1. Check that both servers are running
2. Verify ports 3000 and 5000 are available
3. Check browser console for errors

## Next Steps
- Read the full [README.md](README.md) for detailed documentation
- Customize the app by editing the source code
- Add your own books to the library
- Deploy to a hosting service

---

**Enjoy TaskLit! 📚✨** 