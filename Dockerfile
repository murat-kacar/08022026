FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (dev + prod) so the builder can run the TypeScript/Tailwind build
# We'll rely on Next.js standalone output for the runtime to avoid shipping dev deps into the final image.
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
