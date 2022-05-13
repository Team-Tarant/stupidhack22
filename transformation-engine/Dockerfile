FROM node:16.15-slim

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./tsconfig.json /app/tsconfig.json
COPY ./src /app/

RUN npm install
RUN npm run build

CMD ["node", "./dist/app.js"]

