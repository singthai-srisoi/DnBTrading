#!/usr/bin/env bash
set -e

cd /home/DnBTrading/backend

echo "🟢 Starting Django backend..."
nohup /home/DnBTrading/.venv/bin/python3 manage.py runserver 0.0.0.0:8000 > django.log 2>&1 </dev/null &

echo "🟣 Starting Svelte frontend..."
cd /home/DnBTrading/frontend
nohup node -r dotenv/config build > frontend.log 2>&1 </dev/null &

echo "✅ All systems running in background!"