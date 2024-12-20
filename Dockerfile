# 1: Build the application
FROM node:18 AS build

# Set the working directory
WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm install -g npm@latest

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Verify the dist folder
RUN ls -la /src/dist

# Stage 2: Create a production image
FROM node:18 AS production

# Set the working directory
WORKDIR /src

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JavaScript files and other required assets
COPY --from=build /src/dist ./dist

# Expose the application port (change this based on your app configuration)
EXPOSE 3100

# Command to run the application
CMD ["node", "dist/index.js"]