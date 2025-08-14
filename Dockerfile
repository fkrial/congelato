# Dockerfile (Versión Corregida)

# --- Etapa 1: Builder ---
FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build


# --- Etapa 2: Runner ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos la salida 'standalone'
COPY --from=builder /app/.next/standalone ./

# Copiamos la carpeta 'public'
COPY --from=builder /app/public ./public

# --- LÍNEA CRÍTICA AÑADIDA ---
# Copiamos explícitamente la carpeta 'static' que contiene el CSS y JS del cliente.
# Esto asegura que el servidor pueda encontrar y servir estos archivos.
COPY --from=builder /app/.next/static ./.next/static

# Copiamos los scripts por si se necesitan
COPY --from=builder /app/scripts ./scripts

RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]