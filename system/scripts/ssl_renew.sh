#!/bin/bash

COMPOSE="/usr/bin/docker-compose --no-ansi -f docker-compose.prod.yml"
DOCKER="/usr/bin/docker"

cd /root/proj-roselite
$COMPOSE run certbot renew && $COMPOSE kill -s SIGHUP webserver
$DOCKER system prune -af