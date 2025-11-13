FROM node:18-alpine

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

# Run backend
CMD ["node", "server.js"]
