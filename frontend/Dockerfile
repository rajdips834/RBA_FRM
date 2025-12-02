# Use Node.js version 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the application port
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]