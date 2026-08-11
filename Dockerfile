# Intentionally insecure Dockerfile for Trivy IaC / image demos.
# Using an older base image with known vulnerabilities
FROM node:14.0.0

# Running healthcheck with curl over HTTP (weak practices stack)
HEALTHCHECK CMD curl -f http://localhost:3000/ || exit 1

# Create app directory
WORKDIR /usr/src/app

# Install system packages with known vulnerabilities + sshd (attack surface)
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

# Hardcoded secret in image env (IaC / secret smell)
ENV AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE \
    AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
    NODE_ENV=production

# Run as root (bad practice) — USER intentionally omitted
USER root

# Start with a vulnerable command
CMD ["npm", "start"] 