FROM node:18-alpine

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Optional: Install nodemon globally for hot reload
RUN npm install -g nodemon

EXPOSE 5000

# Run backend with nodemon
CMD ["nodemon", "src/server.js"]
