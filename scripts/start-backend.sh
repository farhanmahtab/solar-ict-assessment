#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="/Users/farhanmahi/Personal/solar-ict-task"
LOG_DIR="$PROJECT_ROOT/logs"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Starting Solar ICT Backend Services${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to start a service in a new terminal tab/window
start_service() {
    local service_name=$1
    local service_path=$2
    local log_name=$3
    local full_path="$PROJECT_ROOT/$service_path"
    local log_file="$LOG_DIR/$log_name.log"
    local command="cd $full_path && npm run start:dev 2>&1 | tee $log_file"
    
    echo -e "${GREEN}Starting $service_name...${NC}"
    echo -e "  Log file: ${YELLOW}$log_file${NC}"
    
    # For macOS Terminal
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"$command\"" > /dev/null 2>&1
    # For Linux with gnome-terminal
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "$command; exec bash" > /dev/null 2>&1
    # For Linux with xterm
    elif command -v xterm &> /dev/null; then
        xterm -e "$command" &
    else
        echo -e "${YELLOW}Please run manually: $command${NC}"
    fi
}

# Start Notification Service (Port 3003) - Auth service depends on it
start_service "Notification Service" "backend/notification-service" "notification-service"
sleep 1

# Start Auth Service (Port 3006)
start_service "Auth Service" "backend/auth-service" "auth-service"
sleep 1

# Start User Service (Port 3002)
start_service "User Service" "backend/user-service" "user-service"
sleep 1

# Start API Gateway (Port 3000)
start_service "API Gateway" "backend/api-gateway" "api-gateway"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All services started in separate terminals!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Services running on:"
echo -e "  ${YELLOW}API Gateway:${NC}          http://localhost:3000"
echo -e "  ${YELLOW}User Service:${NC}         http://localhost:3002"
echo -e "  ${YELLOW}Notification Service:${NC} http://localhost:3003"
echo -e "  ${YELLOW}Auth Service:${NC}         http://localhost:3006"
echo ""
echo -e "Log files located in: ${YELLOW}$LOG_DIR${NC}"
echo -e "  - api-gateway.log"
echo -e "  - user-service.log"
echo -e "  - notification-service.log"
echo -e "  - auth-service.log"
echo ""
echo -e "Use ${YELLOW}'tail -f $LOG_DIR/<service>.log'${NC} to follow logs."
echo -e "Use ${YELLOW}'lsof -i :3000-3006'${NC} to check if they are running."