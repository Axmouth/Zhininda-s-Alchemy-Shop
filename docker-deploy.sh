docker build . --file Dockerfile.user.client.builder --tag ghcr.io/axmouth/zhinindas-alchemy-shop-user-client-builder
docker build . --file Dockerfile.user.client.final --tag ghcr.io/axmouth/zhinindas-alchemy-shop-user-client
# docker build . --file Dockerfile.api.builder --tag ghcr.io/axmouth/zhinindas-alchemy-shop-backend-api
docker build . --file "Zhininda's Alchemy Shop/Dockerfile" --tag ghcr.io/axmouth/zhinindas-alchemy-shop-api
docker-compose build
docker-compose up -d --remove-orphans
