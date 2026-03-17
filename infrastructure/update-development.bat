docker compose  -f docker-compose-develop.yml pull
docker compose  -f docker-compose-develop.yml up -d --force-recreate
docker image prune -a -f