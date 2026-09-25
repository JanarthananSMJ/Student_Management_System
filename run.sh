#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

check_and_install() {
  local dir="$1"
  local name="$2"

  if [ ! -d "$dir/node_modules" ]; then
    echo "[$name] node_modules not found, installing dependencies..."
    (cd "$dir" && npm install)
  else
    echo "[$name] node_modules already installed, skipping install."
  fi
}

check_and_install "$BACKEND_DIR" "backend"
check_and_install "$FRONTEND_DIR" "frontend"

cleanup() {
  trap - EXIT INT TERM
  echo "Stopping servers..."
  kill 0 2>/dev/null
}
trap cleanup EXIT INT TERM

echo "Starting backend..."
(cd "$BACKEND_DIR" && npm run dev) &

echo "Starting frontend..."
(cd "$FRONTEND_DIR" && npm run dev) &

wait
