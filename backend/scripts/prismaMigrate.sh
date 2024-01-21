#!/bin/bash

# You should download netcat. If you don't ıt will give an error.
while ! nc -z localhost 5432; do
  echo "waiting for postgres"
  sleep 10
done

echo "Migration started  🚜 🚜 🚜"

# this command will run the migration files in the prisma/migrations folder
docker-compose exec backend npx prisma migrate dev --name init


echo "Migration successfully completed 🎉🎉🎉"


