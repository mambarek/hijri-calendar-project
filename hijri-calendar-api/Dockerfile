FROM node:alpine
# Create app diector
WORKDIR /usr/src/server
# Install app dependencies
COPY package*.json ./
RUN npm install mongodb --save
RUN npm install
# Copy app source code
COPY app ./app
#Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]
