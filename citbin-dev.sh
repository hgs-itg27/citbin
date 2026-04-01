#!/usr/bin/env bash

# Update infrastructure
cd "infrastructure" || exit
./update-development.sh

# Start backend
cd "../apps/api" || exit
python app.py &
xdg-open "http://localhost:8000/api/docs"

# Start frontend
cd "../web" || exit
npm run dev &
xdg-open "http://localhost:3000"
