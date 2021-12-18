# pull official base image
FROM node

# set working directory
WORKDIR /app

# install app dependencies
COPY build ./build
COPY run.js ./

RUN npm install --silent express

EXPOSE 9000

# start app
CMD ["node", "run.js"]
