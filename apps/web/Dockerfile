ARG NODE_VERSION=24

# Create build stage
FROM node:${NODE_VERSION}-slim AS builder

ARG PUBLIC_API_URL=https://citbin-backend.sybit.education

ENV NEXT_PUBLIC_API_URL=${PUBLIC_API_URL}
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY ./package*.json .

## Install dependencies
RUN npm ci

# Copy the rest of the application files to the working directory
COPY . .

# Build the application
RUN npm run build

# remove dev dependencies
RUN npm prune --production

# Create a new stage for the production image
FROM node:${NODE_VERSION}-slim AS production

# Set the working directory inside the container
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
# Expose the port the application will run on
EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
