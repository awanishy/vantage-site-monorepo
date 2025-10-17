# Stage 1: Build TypeScript code
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy all source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]
