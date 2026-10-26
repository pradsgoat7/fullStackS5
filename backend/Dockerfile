# CampusEats API — production image
FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies first so this layer is cached between code changes
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Run as the unprivileged "node" user that ships with the image
USER node

EXPOSE 5000

# The server only starts listening after MongoDB connects, so "healthy" means ready
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://127.0.0.1:5000/ > /dev/null || exit 1

CMD ["node", "server.js"]
