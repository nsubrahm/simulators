FROM node:22-alpine AS build

WORKDIR /app
COPY /app .
COPY /app/package*.json .

RUN npm ci --omit=dev

FROM gcr.io/distroless/nodejs22-debian12
COPY --from=build /app /app
WORKDIR /app
CMD ["index.js"]
