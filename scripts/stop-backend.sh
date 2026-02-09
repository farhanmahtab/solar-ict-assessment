#!/bin/bash

echo "Stopping Backend Services..."

# 1. Kill processes on specific ports (handles child processes)
PORTS=(3000 3001 3002 3003 3006)
for port in "${PORTS[@]}"; do
  PID=$(lsof -t -i :$port)
  if [ -n "$PID" ]; then
    echo "Killing processes on port $port..."
    kill -9 $PID 2>/dev/null
  fi
done

# 2. Kill watcher processes and any remaining node processes for this project
echo "Cleaning up remaining nest/node processes..."
pkill -9 -f "nest start --watch"
pkill -9 -f "solar-ict-task/backend"

echo "All backend services have been stopped."
