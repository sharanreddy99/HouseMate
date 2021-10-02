# Stage 1
FROM node:12-alpine
WORKDIR /app/frontend
COPY package.* .
RUN npm install
COPY . /app/frontend/
CMD ["sh","entrypoint.sh","prod"]