# Using an older base image with known vulnerabilities
FROM node:14.0.0

# Create app directory
WORKDIR /usr/src/app

# Install system packages with known vulnerabilities
RUN apt-get update && apt-get install -y \
    imagemagick \
    openssh-server \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Add a non-root user but give excessive permissions
RUN useradd -m appuser && \
    chown -R appuser:appuser /usr/src/app && \
    chmod -R 777 /usr/src/app

# Expose port
EXPOSE 3000

# Run as root (bad practice)
# USER appuser  # Commented out intentionally

# Start with a vulnerable command
CMD ["npm", "start"] 