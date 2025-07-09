FROM node:22-alpine

WORKDIR /app

# Install Tailwind CSS and dependencies first
COPY package*.json ./
RUN npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
RUN npx tailwindcss init -p

# Install remaining dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Serve the app
CMD ["npm", "run", "dev"]