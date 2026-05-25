FROM node:20 As builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:20 As runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
Run npm prune --production
COPY --from=builder /app ./
EXPOSE 5000
CMD ["node", "server.js"]