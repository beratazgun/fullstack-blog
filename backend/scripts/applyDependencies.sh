#!/bin/bash

# You should download netcat. If you don't ıt will give an error.
while ! nc -z localhost 4566; do
  echo "waiting for s3/localstack"
  sleep 10
done

aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket blog-aws --no-sign-request

if [ ! -d "$(pwd)/prisma/migrations" ]
then
  while ! nc -z localhost 5432; do
    echo "waiting for postgres"
    sleep 10
  done
  
  echo "Migration started  🚜 🚜 🚜"

  # this command will run the migration files in the prisma/migrations folder
  docker-compose exec backend npx prisma migrate dev --name init
  sleep 5
  docker-compose exec backend npm run seed:run

  echo "Migration successfully completed 🎉🎉🎉"
fi




