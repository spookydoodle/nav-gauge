FROM node:24-alpine AS builder

WORKDIR /app/

COPY package.json yarn.lock ./
RUN yarn install --network-timeout 300000

COPY . .
RUN yarn build

FROM nginx:1.28.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]