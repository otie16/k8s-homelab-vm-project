FROM node:20-apline AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json yarn.lock ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# Final image - only the standalone output, nothing else
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public


EXPOSE 3000

CMD ["node", "server.js"]