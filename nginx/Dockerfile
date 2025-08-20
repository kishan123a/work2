# Stage 1: Build the React app from your 'frontend' folder
FROM node:18-alpine AS builder
WORKDIR /app
COPY ../frontend/package.json ../frontend/package-lock.json* ./
RUN npm install
COPY ../frontend ./
RUN npm run build

# Stage 2: Set up the final Nginx server
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf