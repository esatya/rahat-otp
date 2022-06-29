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
# CMD ["yarn","production"]
# ENTRYPOINT [ "/bin/bash", "-c" ]
# CMD ["./wait-for-it.sh" , "http://rahat_server:3601/api/v1/app/settings" , "--strict" , "--timeout=300" , "--" , "yarn production"]
ENTRYPOINT ["./start-prod-server.sh"]




