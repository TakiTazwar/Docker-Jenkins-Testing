FROM node:16.15.0

WORKDIR /app

COPY package.json /app

RUN npm install 

COPY . /app

EXPOSE 5000

CMD ["npm","run","start"]