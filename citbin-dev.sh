#!/usr/bin/env bash

# Set path for citbin directory
CITBIN_PATH="$HOME/Projects/citbin"

# Update infrastructure
cd "$CITBIN_PATH/infrastructure" || exit
./update-development.sh

# Start backend
cd "$CITBIN_PATH/apps/api" || exit
python app.py &
xdg-open "http://localhost:8000/api/docs"

# Start frontend
cd "$CITBIN_PATH/apps/web" || exit
npm run dev &
xdg-open "http://localhost:3000"
