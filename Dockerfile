# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Expose the port the app runs on
EXPOSE 4000

# CMD will be overridden by docker-compose.yml for development
# CMD ["node", "dist/index.js"]
