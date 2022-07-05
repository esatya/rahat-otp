FROM node:14.17.0-alpine3.13
RUN apk add --update bash git curl
#set working directory
WORKDIR /usr/src/app
COPY . .
#make script executable
# RUN chmod +x wait-for-it.sh
RUN chmod +x start-prod-server.sh
#install packages
RUN yarn
#expose application working port
EXPOSE 3601 8558
ENTRYPOINT ["./start-prod-server.sh"]
