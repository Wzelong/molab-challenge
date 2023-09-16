# Build the React frontend
FROM node:18-alpine
WORKDIR /app
COPY ./client/package.json ./client/package-lock.json ./
RUN npm install
COPY ./client ./
RUN npm run build && rm -rf node_modules

# Build the Node.js backend
WORKDIR /app
COPY ./server/package.json ./server/package-lock.json ./
RUN npm install
COPY ./server ./

# Expose port and start server
EXPOSE 4000
CMD ["npm", "start"]
