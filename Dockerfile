FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN npm -g install browser-sync

# Bundle app source
COPY . .

EXPOSE 8001
CMD [ "browser-sync", "start", "--server", "--host", "0.0.0.0", "--port", "8001", "--files='**/*.js'" ]
