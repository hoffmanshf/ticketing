FROM node:alpine

WORKDIR /app
COPY package.json ./
# avoid downloading dev depedency every time the image is rebuilt
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]
