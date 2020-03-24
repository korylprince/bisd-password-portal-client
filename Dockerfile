FROM alpine:3.11 as builder

ARG VERSION

RUN apk add --no-cache git nodejs nodejs-npm

RUN git clone --branch "$VERSION" --single-branch --depth 1 \
    https://github.com/korylprince/bisd-password-portal-client.git /client

WORKDIR /client

RUN npm install

ENV API_BASE="/students/api/2.0"

RUN npm run build-prod

FROM alpine:3.11

RUN apk add --no-cache caddy

COPY --from=builder /client/dist /www

WORKDIR /www

RUN echo ":8080" > /Caddyfile && echo "log /dev/stdout" >> /Caddyfile

CMD ["caddy", "-conf", "/Caddyfile"]
