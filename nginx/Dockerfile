# Stage 1: Build the React app from your 'frontend' folder
FROM node:18-alpine AS builder
WORKDIR /app
COPY ../first_landing/package.json ../first_landing/package-lock.json* ./
RUN npm install
COPY ../first_landing ./
RUN npm run build

# Stage 2: Set up the final Nginx server
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf