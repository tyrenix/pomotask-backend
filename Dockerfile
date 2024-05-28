FROM node:22
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . ./code
RUN cd ./code && npm run build
RUN mv ./code/dist ./dist
RUN rm -r ./code/ && rm -r ./package*.json
EXPOSE 3000
CMD ["npm", "run", "start:prod"]