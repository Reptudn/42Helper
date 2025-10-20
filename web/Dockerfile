# Multi-stage Dockerfile for Next.js (App Router) production
# Builder stage: install deps and build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
# Install all dependencies (including devDependencies) so tools like typescript are available for the build step
RUN npm ci || npm install

# Copy rest of the sources
COPY . .

# Build the Next.js app
RUN npm run build

# Prune devDependencies (optional)
RUN npm prune --production || true

### Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Install a small runtime user for security
RUN addgroup -S app && adduser -S -G app app

# Copy only the built output and dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Use an unprivileged user
USER app

# Default start command (expects package.json start to run next start)
CMD ["npm", "start"]