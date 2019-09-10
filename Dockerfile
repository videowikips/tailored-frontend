FROM node:10.15.0-jessie
WORKDIR /tvw_frontend

COPY package*.json ./
# RUN npm install
EXPOSE 3000

COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "run", "docker:prod"]