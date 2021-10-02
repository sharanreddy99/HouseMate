FROM node:12-alpine
WORKDIR /app/backend
COPY package.* ./
RUN npm install
COPY . /app/backend/ 
WORKDIR /app/backend
CMD ["sh","entrypoint.sh","prod"]