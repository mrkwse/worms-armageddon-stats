#!/bin/bash
DOCKER_NAME=postgresql_worms
docker start $DOCKER_NAME || docker run --name $DOCKER_NAME \
  -e POSTGRES_PASSWORD=$(cat ./config.json | jq -r '.db_password') \
  -e POSTGRES_DB=$(cat ./config.json | jq -r '.db_name') \
  -e POSTGRES_USER=$(cat ./config.json | jq -r '.db_username') \
  -p $(cat ./config.json | jq -r '.db_port'):5432 \
  -d postgres
