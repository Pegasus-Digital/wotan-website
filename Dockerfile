FROM node:20-alpine as base

FROM base as builder

# Accept build arguments
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG PAYLOAD_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_SERVER_URL
ARG SMTP_EMAIL
ARG SMTP_HOST
ARG SMTP_USER
ARG SMTP_PASS
ARG SMTP_PORT

# Set as environment variables for build process
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV DATABASE_URI=${DATABASE_URI}
ENV PAYLOAD_PUBLIC_SERVER_URL=${PAYLOAD_PUBLIC_SERVER_URL}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV SMTP_EMAIL=${SMTP_EMAIL}
ENV SMTP_HOST=${SMTP_HOST}
ENV SMTP_USER=${SMTP_USER}
ENV SMTP_PASS=${SMTP_PASS}
ENV SMTP_PORT=${SMTP_PORT}

WORKDIR /home/node/app
COPY package*.json ./

COPY . .
RUN yarn install
RUN yarn build

FROM base as runtime

ENV NODE_ENV=production
ENV PAYLOAD_CONFIG_PATH=dist/payload/payload.config.js
# SMTP env vars will be set by docker-compose.yml at runtime
ENV SMTP_EMAIL=""
ENV SMTP_HOST=""
ENV SMTP_USER=""
ENV SMTP_PASS=""
ENV SMTP_PORT=""

WORKDIR /home/node/app
COPY package*.json  ./
COPY yarn.lock ./

RUN yarn install --production
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/build ./build
COPY --from=builder /home/node/app/.next ./.next
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/next.config.mjs ./next.config.mjs
COPY --from=builder /home/node/app/media ./media

EXPOSE 3000

CMD ["node", "dist/server.js"]