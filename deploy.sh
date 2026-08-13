#!/usr/bin/env bash
set -e

cd /home/DnBTrading

echo "--> Pulling latest code..."
git pull origin main

echo "--> Running Django migrations..."
# Update path to your venv python if you use one (e.g. ./venv/bin/python)
cd /home/DnBTrading/backend
/home/DnBTrading/.venv/bin/python3 manage.py migrate

echo "--> Building frontend..."
# Adjust directory if frontend package.json lives in a subfolder (e.g. cd frontend && npm run build)
cd /home/DnBTrading/frontend
npm run build

echo "--> Restarting services..."
pkill -f "manage.py runserver" || true
pkill -f "node -r dotenv/config build" || true

cd /home/DnBTrading
./start.sh

echo "--> Verifying processes..."
sleep 3
ps aux | grep -E "manage.py|node" | grep -v grep