FROM golang:tip-alpine AS builder
WORKDIR /builder
COPY . .
RUN mkdir bin
RUN go mod download
RUN go build -o bin/pastebin

FROM node:lts-alpine AS asset-builder
WORKDIR /frontend
COPY --from=builder /builder/frontend .
RUN npm install
RUN npm run build

FROM golang:tip-alpine AS app
WORKDIR /app
EXPOSE 8888
COPY --from=asset-builder /frontend/dist ./frontend/dist
COPY --from=builder /builder/bin/pastebin .
CMD ["./pastebin"]
