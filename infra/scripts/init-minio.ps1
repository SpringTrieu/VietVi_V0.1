Write-Host "Creating MinIO buckets via Docker container..."
docker exec vietvi-minio mc alias set local http://localhost:9000 minioadmin minioadmin
docker exec vietvi-minio mc mb --ignore-existing local/vietvi-public
docker exec vietvi-minio mc mb --ignore-existing local/vietvi-private
docker exec vietvi-minio mc anonymous set download local/vietvi-public
Write-Host "MinIO buckets initialized successfully."
