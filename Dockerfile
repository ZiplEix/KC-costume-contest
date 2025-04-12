FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:23-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/static static/
COPY package.json .
COPY init-db.cjs /app/init-db.cjs

RUN npm install sqlite3 --production
EXPOSE 3000
ENV NODE_ENV=production
ENV ORIGIN=http://localhost:3000

CMD ["sh", "-c", "node /app/init-db.cjs && node build"]
