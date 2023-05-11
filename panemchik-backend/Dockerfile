### BUILD STAGE ###
FROM node:18.13-alpine
WORKDIR /panemchik-backend
COPY ./package.json .
RUN npm install
COPY . .
CMD ["node","index.js"]
EXPOSE 5000



