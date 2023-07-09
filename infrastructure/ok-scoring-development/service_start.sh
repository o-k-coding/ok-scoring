#!/bin/bash

SERVICE_FILE=infrastructure/ok-scoring-development/OK.Scoring.$1.docker-compose.yml

echo 'starting ' $SERVICE_FILE

docker-compose --env-file infrastructure/ok-scoring-development/.env.development -f $SERVICE_FILE up -d
