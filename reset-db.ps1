Write-Host "Stopping and removing Docker containers..."
docker compose down -v

# Define container and backup file path
$containerName = "factory_storage_db"
$backupFile = "./backup.sql"

# Check if backup exists
if (-Not (Test-Path $backupFile)) {
    Write-Host "No backup file found at $backupFile."
    exit 1
}

Write-Host "Starting Docker containers..."
docker compose up -d postgres

# Wait for the database container to be ready
Write-Host "Waiting for PostgreSQL to start..."
Start-Sleep -Seconds 5

# Copy backup file into the container
Write-Host "Copying backup file into the container..."
docker cp $backupFile "${containerName}:/tmp/backup.sql"

# Restore the database
Write-Host "Restoring database from backup..."
docker exec -i $containerName psql -U factory_user -d factory_storage -f /tmp/backup.sql

Write-Host "Database restored successfully!" -ForegroundColor Green
