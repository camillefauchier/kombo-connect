# Étape de build
FROM node:20-alpine AS build
WORKDIR /app

# Ajout des arguments pour les variables d'environnement
ARG REACT_APP_KOMBO_BACKEND_URL
ENV REACT_APP_KOMBO_BACKEND_URL=$REACT_APP_KOMBO_BACKEND_URL

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Étape de production
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE $PORT

# Utilisation d'un script shell pour initialiser l'application
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
