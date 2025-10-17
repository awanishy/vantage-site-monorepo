# Stage 1: Build TypeScript code
FROM node:latest AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production
FROM node:latest

WORKDIR /app

# Copy package.json and production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built files and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]
