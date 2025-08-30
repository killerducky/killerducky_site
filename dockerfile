# Use official Ruby image
FROM ruby:3.2

# Install dependencies for Jekyll
RUN apt-get update && \
    apt-get install -y build-essential nodejs npm && \
    gem install bundler jekyll

# Set working directory
WORKDIR /srv/jekyll

# Copy site files
COPY . .

# Install gems
RUN bundle install || true

# Expose Jekyll default port
EXPOSE 4000

# Serve the site with live reload
CMD ["jekyll", "serve", "--host", "0.0.0.0", "--livereload"]
