#!/bin/bash
# Garage S3 初期化スクリプト
# Langfuse用のバケットとアクセスキーを作成

set -e

echo "========================================="
echo "Garage S3 Initialization Script"
echo "========================================="
echo ""

# Check if Garage container is running
if ! docker compose ps | grep -q "langfuse-garage-1.*Up"; then
  echo "❌ Error: Garage container is not running"
  echo "Please start services first: docker compose up -d"
  exit 1
fi

echo "✓ Garage container is running"
echo ""

# Wait for Garage to be ready
echo "Waiting for Garage to be ready..."
sleep 5

# Get node ID
echo "Getting Garage node ID..."
NODE_ID=$(docker compose exec -T garage /garage status 2>/dev/null | grep -A2 "HEALTHY NODES" | tail -1 | awk '{print $1}')

if [ -z "$NODE_ID" ]; then
  echo "❌ Error: Could not get Garage node ID"
  exit 1
fi

echo "✓ Node ID: $NODE_ID"
echo ""

# Assign layout
echo "Assigning Garage layout..."
docker compose exec -T garage /garage layout assign -z dc1 -c 1G "$NODE_ID" >/dev/null 2>&1
echo "✓ Layout assigned"

# Apply layout
echo "Applying layout changes..."
docker compose exec -T garage /garage layout apply --version 1 >/dev/null 2>&1
echo "✓ Layout applied"
echo ""

# Create access key
echo "Creating access key 'langfuse-key'..."
KEY_OUTPUT=$(docker compose exec -T garage /garage key create langfuse-key 2>/dev/null)

# Extract key ID and secret from output
ACCESS_KEY_ID=$(echo "$KEY_OUTPUT" | grep "Key ID:" | awk '{print $NF}')
SECRET_KEY=$(echo "$KEY_OUTPUT" | grep "Secret key:" | awk '{print $NF}')

if [ -z "$ACCESS_KEY_ID" ] || [ -z "$SECRET_KEY" ]; then
  echo "❌ Error: Could not extract access key credentials"
  exit 1
fi

echo "✓ Access key created"
echo ""

# Create bucket
echo "Creating bucket 'langfuse'..."
docker compose exec -T garage /garage bucket create langfuse >/dev/null 2>&1
echo "✓ Bucket created"

# Grant permissions
echo "Granting permissions..."
docker compose exec -T garage /garage bucket allow \
  --read --write --owner \
  langfuse \
  --key langfuse-key >/dev/null 2>&1
echo "✓ Permissions granted"
echo ""

# Update .env file
echo "Updating .env file with new credentials..."
if [ -f ".env" ]; then
  # Backup .env
  cp .env .env.backup

  # Update access key ID
  sed -i.tmp "s/LANGFUSE_S3_EVENT_UPLOAD_ACCESS_KEY_ID=.*/LANGFUSE_S3_EVENT_UPLOAD_ACCESS_KEY_ID=$ACCESS_KEY_ID/" .env
  sed -i.tmp "s/LANGFUSE_S3_MEDIA_UPLOAD_ACCESS_KEY_ID=.*/LANGFUSE_S3_MEDIA_UPLOAD_ACCESS_KEY_ID=$ACCESS_KEY_ID/" .env
  sed -i.tmp "s/LANGFUSE_S3_BATCH_EXPORT_ACCESS_KEY_ID=.*/LANGFUSE_S3_BATCH_EXPORT_ACCESS_KEY_ID=$ACCESS_KEY_ID/" .env

  # Update secret access key
  sed -i.tmp "s/LANGFUSE_S3_EVENT_UPLOAD_SECRET_ACCESS_KEY=.*/LANGFUSE_S3_EVENT_UPLOAD_SECRET_ACCESS_KEY=$SECRET_KEY/" .env
  sed -i.tmp "s/LANGFUSE_S3_MEDIA_UPLOAD_SECRET_ACCESS_KEY=.*/LANGFUSE_S3_MEDIA_UPLOAD_SECRET_ACCESS_KEY=$SECRET_KEY/" .env
  sed -i.tmp "s/LANGFUSE_S3_BATCH_EXPORT_SECRET_ACCESS_KEY=.*/LANGFUSE_S3_BATCH_EXPORT_SECRET_ACCESS_KEY=$SECRET_KEY/" .env

  # Remove temporary files
  rm -f .env.tmp

  echo "✓ .env file updated (backup saved as .env.backup)"
else
  echo "⚠️  Warning: .env file not found, skipping auto-update"
fi

echo ""
echo "========================================="
echo "Garage S3 initialization complete!"
echo "========================================="
echo ""
echo "Credentials:"
echo "  Access Key ID: $ACCESS_KEY_ID"
echo "  Secret Access Key: $SECRET_KEY"
echo ""
echo "Configuration:"
echo "  S3 Endpoint: http://localhost:3900"
echo "  Region: garage"
echo "  Bucket: langfuse"
echo ""
echo "Next steps:"
echo "  1. Restart Langfuse services: docker compose restart langfuse-web langfuse-worker"
echo "  2. Access Langfuse UI: http://localhost:3001"
echo ""
