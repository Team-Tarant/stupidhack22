FROM node:16.15-alpine

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./tsconfig.json /app/tsconfig.json
COPY ./src /app/src
COPY firstNames.json /app/firstNames.json
COPY lastNames.json /app/lastNames.json
COPY ./public /app/public


RUN npm ci --only=production
RUN ls -la
RUN npm run build
RUN mkdir -p ./dist/src/utils/ && cp firstNames.json dist/firstNames.json && cp lastNames.json dist/lastNames.json

CMD ["node", "./dist/app.js"]

