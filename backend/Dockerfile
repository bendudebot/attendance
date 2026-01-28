FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema first for caching
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

# Start command
# Run migrations, seed (if first run), and start
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed || true && npm start"]
