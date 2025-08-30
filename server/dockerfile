# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching installs)
COPY package*.json ./

# Install dependencies (only production deps if NODE_ENV=production)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your Express app listens on
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]