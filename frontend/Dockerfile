# Image de production du front TogoExpo (Next.js en serveur autonome).
# Construite sur le serveur par deploy/docker-compose.yml.

FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Variables publiques : inscrites dans le code au moment du build.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WP_URL
ARG NEXT_PUBLIC_WP_GRAPHQL_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_WP_URL=$NEXT_PUBLIC_WP_URL \
    NEXT_PUBLIC_WP_GRAPHQL_URL=$NEXT_PUBLIC_WP_GRAPHQL_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
# Dossier du cache ISR, monté en volume : il doit appartenir à l'utilisateur du serveur.
RUN mkdir -p .next/cache && chown nextjs:nodejs .next/cache
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
