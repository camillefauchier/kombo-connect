# Use Node.js 20 as the base image
FROM node:20 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the application code
COPY . .

# Build the application
RUN yarn build

# Use a lightweight web server for the static files
FROM nginx:alpine

# Copy the build files to the nginx public directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
