FROM node:16-alpine3.14

RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

WORKDIR /receiver/app
COPY . .

RUN npm i

EXPOSE 5001

CMD [ "npm", "start" ]
