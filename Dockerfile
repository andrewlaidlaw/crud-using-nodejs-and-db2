FROM node

# RUN sudo yum install -y libnuma-devel
RUN apt-get update && apt-get install libnuma-dev

COPY package*.json .
RUN npm install

COPY server.js .
COPY .env .

EXPOSE 8080

CMD [ "node", "server.js" ]