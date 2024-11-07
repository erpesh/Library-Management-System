# Stage 1: Build the Go application
FROM golang:1.23.2-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum to the workspace
COPY go.mod ./
COPY go.sum ./

# Download the Go module dependencies
RUN go mod download

# Copy the rest of the application source code to the workspace
COPY . .

# Build the Go application
RUN go build -o media-service .

# Stage 2: Create a minimal runtime image
FROM alpine:latest

# Install certificates so the app can make HTTPS requests
RUN apk --no-cache add ca-certificates

# Set the working directory
WORKDIR /root/

# Copy the built Go binary from the builder stage
COPY --from=builder /app/media-service .

# Expose port 8080 to the outside world
EXPOSE 8080

# Set environment variable for MongoDB URI (optional, can also be passed in docker-compose.yml)
ENV MONGO_URI=mongodb://mongo:27017/your_database_name

# Run the Go application
CMD ["./media-service"]
