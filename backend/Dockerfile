# Production build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src


# Production runtime stage
FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 nodejs && adduser -S nodeuser -u 1001 -G nodejs
COPY --from=build --chown=nodeuser:nodejs /app .
USER nodeuser
EXPOSE 4000
CMD ["node", "src/app.js"]
