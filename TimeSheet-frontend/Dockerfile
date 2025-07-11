# Stage 1: Build React App
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Set working directory (optional, for clarity)
WORKDIR /usr/share/nginx/html

# Copy build output from Stage 1 to Nginx's web root directory
COPY --from=build /app/build .

# Copy a custom Nginx configuration to use port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000 for the Nginx server
EXPOSE 3000

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

 
