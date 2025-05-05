FROM node:lts-alpine AS asset-builder
WORKDIR /frontend
COPY ./frontend .
RUN npm install
RUN npm run build

FROM golang:tip-alpine AS builder
WORKDIR /builder
COPY . .
RUN mkdir bin
RUN go mod download
RUN go build -o bin/pastebin

FROM golang:tip-alpine AS app
WORKDIR /app
EXPOSE 8888
COPY --from=asset-builder /frontend/build ./frontend/build
COPY --from=builder /builder/bin/pastebin .
CMD ["./pastebin"]
