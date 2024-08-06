# using staged builds
# name each stage
FROM node:20.11-alpine as builder

WORKDIR /var/www/client-next

COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3001

RUN npm run build

ENTRYPOINT ["npm", "start"]
