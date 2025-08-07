#!/bin/bash

echo "Starting TaskLit Application..."
echo

echo "Starting backend server on port 5000..."
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev; bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run dev"' 2>/dev/null || \
echo "Please start backend manually: npm run dev"

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting frontend server on port 3000..."
gnome-terminal -- bash -c "npm run client; exec bash" 2>/dev/null || \
xterm -e "npm run client; bash" 2>/dev/null || \
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && npm run client"' 2>/dev/null || \
echo "Please start frontend manually: npm run client"

echo
echo "TaskLit is starting up!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Enter to close this window..."
read 