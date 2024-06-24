# Use an existing node alpine image as a base image.
FROM node:18-alpine as build

# Set the working directory.
WORKDIR /app

# Copy the package.json and package-lock.json files.
COPY package.json package-lock.json ./

# Install application dependencies.
RUN npm install

# Copy the rest of the application files.
COPY . .

# Build the application.
RUN npm run build:pro

# Use an existing nginx image as a base image.
FROM nginx:1.13.0

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
