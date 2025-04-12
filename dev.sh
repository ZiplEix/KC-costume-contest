#!/bin/bash

# Nom de l'image
IMAGE_NAME="my-svelte-app"

# Port local
PORT=3000

# Dossier d'uploads (sur l'hôte)
UPLOADS_DIR="$(pwd)/uploads"

# Build de l'image si elle n'existe pas
echo "🔧 Building image $IMAGE_NAME..."
docker build -t $IMAGE_NAME .

# Création du dossier d'uploads si nécessaire
if [ ! -d "$UPLOADS_DIR" ]; then
  echo "📁 Creating uploads directory at $UPLOADS_DIR"
  mkdir -p "$UPLOADS_DIR"
fi

# Suppression de l'ancien conteneur s'il existe
if docker ps -a --format '{{.Names}}' | grep -Eq "^$IMAGE_NAME$"; then
  echo "🗑️ Removing old container..."
  docker rm -f $IMAGE_NAME
fi

# Lancement du conteneur
echo "🚀 Running container..."
docker run -d \
  --name $IMAGE_NAME \
  -p $PORT:3000 \
  -v "$UPLOADS_DIR":/app/uploads \
  -v "$(pwd)/db":/app/db \
  $IMAGE_NAME

echo "🌐 App running at http://localhost:$PORT"
