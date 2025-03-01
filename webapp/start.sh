#!/bin/sh
set -e
echo "Building production bundle..."
npx @rspack/cli build
echo "Starting production server..."
exec npm start