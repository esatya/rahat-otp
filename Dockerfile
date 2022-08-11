FROM node:16.13.2-alpine3.14

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --production

COPY . /app
CMD ["node","."]