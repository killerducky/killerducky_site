#!/bin/sh
set -e

# Default destination folder for Jekyll output
DEST="/srv/jekyll/_site"

# Check JEKYLL_ENV, use additional config if in development
if [ "$JEKYLL_ENV" = "development" ]; then
  echo "Building Jekyll in development mode..."
  bundle exec jekyll build --config _config.yml,_config_dev.yml --destination "$DEST"
else
  echo "Building Jekyll in production mode..."
  bundle exec jekyll build --config _config.yml --destination "$DEST"
fi

# Keep container alive for debugging if needed, otherwise exit
exec "$@"
