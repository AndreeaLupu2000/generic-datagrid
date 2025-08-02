FROM node:21-alpine

WORKDIR /home/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set build args and environment variables
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_PORT

ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV DB_PORT=${DB_PORT}

# Expose the correct port (8080, not 3001)
EXPOSE 8080

# Create a startup script that waits for DB and imports CSV
RUN echo '#!/bin/sh' > /home/app/start.sh && \
    echo 'echo "Waiting for database to be ready..."' >> /home/app/start.sh && \
    echo 'sleep 10' >> /home/app/start.sh && \
    echo 'echo "Importing CSV data..."' >> /home/app/start.sh && \
    echo 'npm run import-csv || echo "CSV import failed, continuing..."' >> /home/app/start.sh && \
    echo 'echo "Starting server..."' >> /home/app/start.sh && \
    echo 'npm run start' >> /home/app/start.sh && \
    chmod +x /home/app/start.sh

CMD ["/home/app/start.sh"]