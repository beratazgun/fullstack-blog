#!/bin/bash

while ! nc -z localhost 4566; do
  echo "waiting for s3/localstack"
  sleep 10
done

aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket blog-aws --no-sign-request