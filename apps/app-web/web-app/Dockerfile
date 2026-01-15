FROM node:22-alpine AS builder

WORKDIR /app/

COPY apps/package.json apps/yarn.lock apps/tsconfig.base.json ./

COPY apps/app-web ./app-web
COPY apps/packages ./packages
COPY apps/ui ./ui
COPY apps/types ./types

RUN yarn install --network-timeout 300000
RUN yarn build

FROM nginx:1.28.0-alpine

COPY --from=builder /app/app-web/web-app/dist /usr/share/nginx/html

COPY apps/app-web/web-app/conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]