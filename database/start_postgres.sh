#!/bin/bash
DOCKER_NAME=postgresql_worms
docker start $DOCKER_NAME || docker run --name $DOCKER_NAME \
  -e POSTGRES_PASSWORD=$(cat ../config.json | jq '.db_password') \
  -e POSTGRES_USER=$(cat ../config.json | jq '.db_username') \
  -e POSTGRES_DB=$(cat ../config.json | jq '.db_name') \
  -d postgres
