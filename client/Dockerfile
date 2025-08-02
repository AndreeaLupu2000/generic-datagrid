# Multi-stage build for production
FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build args
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the project
RUN npm run build

# Production stage
FROM nginx:alpine AS production-build

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories
RUN mkdir -p /var/run/nginx /var/cache/nginx /workspace/build

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built application
COPY --from=builder /app/dist /workspace/build

# Expose port
EXPOSE 3000

# Run as root (simpler solution)
ENTRYPOINT ["nginx", "-g", "daemon off;"]