FROM node:18-alpine as build

WORKDIR /app
COPY /app .
COPY /app/package*.json .

RUN npm ci --only=production

FROM gcr.io/distroless/nodejs18-debian11
COPY --from=build /app /app
WORKDIR /app
CMD ["index.js"]
