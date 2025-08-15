# Dockerfile (Versión Corregida para pnpm)

# --- Etapa 1: Builder ---
FROM node:18-alpine AS builder

# Instala pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Comando de build de Next.js
RUN pnpm build


# --- Etapa 2: Runner ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos la salida 'standalone' generada por el build
COPY --from=builder /app/.next/standalone ./

# Copiamos la carpeta 'public'
COPY --from=builder /app/public ./public

# Copiamos la carpeta de assets estáticos de Next.js
COPY --from=builder /app/.next/static ./.next/static

# Copiamos los scripts (opcional pero buena práctica)
COPY --from=builder /app/scripts ./scripts

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]