# Use Node.js as the base image
FROM node:22.11-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for Next.js
EXPOSE 3000

# Start Next.js in development mode
CMD ["npm", "run", "dev"]
