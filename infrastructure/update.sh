#!/bin/bash
sudo docker compose pull
sudo docker compose up -d --force-recreate
sudo docker image prune -a -f
