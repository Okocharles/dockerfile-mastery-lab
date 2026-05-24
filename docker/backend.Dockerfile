FROM node:22-alpine AS deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev

FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app/backend
RUN apk add --no-cache tini && addgroup -S api && adduser -S api -G api
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend ./
RUN mkdir -p /data && chown -R api:api /data /app/backend
USER api
EXPOSE 4000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
