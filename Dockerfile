FROM ubi7/nodejs-12

RUN sudo yum install -y libnuma-devel

COPY package*.json .
RUN npm install

COPY server.js .
COPY .env .

EXPOSE 8080

CMD [ "node", "server.js" ]