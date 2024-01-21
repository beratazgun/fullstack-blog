# Bucket creation

aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket blog-aws --no-sign-request

# List buckets

aws --endpoint-url=http://localhost:4566 s3 ls s3://blog-aws/

# Upload file

aws --endpoint-url=http://localhost:4566 s3 cp ./README.md s3://blog-aws/README.md

# Download file

aws --endpoint-url=http://localhost:4566 s3 cp s3://blog-aws/README.md ./README.md

#
