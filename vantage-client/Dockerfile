# ------------------------------
# Stage 1: Build Next.js app
# ------------------------------
FROM node:latest AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy environment variables (production)
COPY .env .env

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# ------------------------------
# Stage 2: Production
# ------------------------------
FROM node:latest AS runner
WORKDIR /app

# Copy only necessary files from builder
COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port
EXPOSE 3000

# Start Next.js in production
CMD ["npm", "start"]
