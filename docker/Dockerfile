FROM node:6.17.1 AS nodejs

# install git command cli

RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    sed -i '/security.debian.org/d' /etc/apt/sources.list && \
    apt-get update && apt-get install -y --no-install-recommends git && \
    rm -rf /var/lib/apt/lists/*

#change directory
WORKDIR /app

# git clone
RUN git clone https://github.com/Oscarhasanputra/bhakti-purna-jual-old.git

#RUN git pull origin main

WORKDIR bhakti-purna-jual-old


#update from branch main
RUN git pull origin main

RUN npm install -g yarn

RUN yarn install

# Stage 2: Configure Nginx to serve the app
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# # Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files
COPY --from=nodejs /app/bhakti-purna-jual-old/dist /usr/share/nginx/html

# Expose port 9180
EXPOSE 9180


#RUN npm run server:prod
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

#CMD ["npm","run start:prod"]