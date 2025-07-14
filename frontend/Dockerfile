# Stage 1: Build the React application
FROM node:22-bullseye AS build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Copy package files
COPY package.json ./

# Install all dependencies (including dev dependencies)
RUN echo "Force rebuild of npm install layer"
RUN npm install

# Copy the rest of the application source code (including package-lock.json)
COPY . .

# Build the application
RUN rm -rf node_modules/.vite
RUN npm run build

# Stage 2: Serve the static assets with Nginx
FROM nginx:stable-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]