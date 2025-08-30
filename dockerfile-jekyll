FROM ruby:3.2.2

# Install dependencies
RUN apt-get update && apt-get install -y build-essential nodejs npm git

# Set working directory
WORKDIR /usr/src/app

# Copy Gemfile and Gemfile.lock first
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle install

# Copy rest of the site
COPY . .

EXPOSE 4000

# Use bundle exec to run Jekyll
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload"]
