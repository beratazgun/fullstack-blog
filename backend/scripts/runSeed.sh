#!/bin/bash

# You should download netcat. If you don't ıt will give an error.
while ! nc -z localhost 5432; do
  echo "waiting for postgres"
  sleep 10
done

echo "Seed started  🚜 🚜 🚜"

docker-compose exec backend npm run seed:run

echo "Seed successfully completed 🎉🎉🎉"