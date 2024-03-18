# Stage 1: Build the Vue.js application
FROM node:lts AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json (if available) to the Docker image
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine as production-stage

# Copy built assets from the build stage to the default Nginx serve folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# When the container starts, Nginx will start as well
CMD ["nginx", "-g", "daemon off;"]
