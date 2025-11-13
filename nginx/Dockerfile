# Stage 1: Build React App
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . ./

# Build the React app
RUN npm run build

# Stage 2: Nginx to serve React SPA
FROM nginx:alpine

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
