FROM node:14 AS builder
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN rm -rf node_modules \
    && yarn install --frozen-lockfile --production \
    && yarn run build

FROM node:14
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

EXPOSE 3000
CMD ["yarn", "run", "start:prod"]