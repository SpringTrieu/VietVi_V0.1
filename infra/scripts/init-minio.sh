#!/bin/sh
set -e

echo "Waiting for MinIO..."
until curl -s http://localhost:9000/minio/health/live; do
  sleep 1
done

echo "Setting up MinIO alias..."
mc alias set local http://localhost:9000 ${S3_ACCESS_KEY:-minioadmin} ${S3_SECRET_KEY:-minioadmin}

echo "Creating buckets..."
mc mb --ignore-existing local/${S3_BUCKET_PUBLIC:-vietvi-public}
mc mb --ignore-existing local/${S3_BUCKET_PRIVATE:-vietvi-private}

echo "Configuring public policy for ${S3_BUCKET_PUBLIC:-vietvi-public}..."
mc anonymous set download local/${S3_BUCKET_PUBLIC:-vietvi-public}

echo "MinIO buckets initialized successfully."
