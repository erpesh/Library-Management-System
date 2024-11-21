# Use the official Node.js image
FROM node:18.7.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port that the service listens on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
