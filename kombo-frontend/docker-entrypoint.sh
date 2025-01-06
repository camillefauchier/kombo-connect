#!/bin/sh
set -e

# Remplace la variable PORT dans la configuration nginx
sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf

# Exécute la commande passée au conteneur
exec "$@"
