FROM node:lts-alpine

RUN apk add --no-cache \
    curl \
    bind-tools \
    iputils \
    net-tools

WORKDIR /app

COPY package*.json ./
RUN npm install  # Using ci instead of install for more reproducible builds

COPY . .

# Make script executable (can combine with COPY to reduce layers)
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
