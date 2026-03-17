#!/bin/bash
sudo docker compose  -f docker-compose-develop.yml pull
sudo docker compose  -f docker-compose-develop.yml up -d --force-recreate
sudo docker image prune -a -f
