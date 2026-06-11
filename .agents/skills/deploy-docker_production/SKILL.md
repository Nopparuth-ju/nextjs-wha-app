---
name: deploy-docker_production
description: Use this skill when the user wants to build and run the Next.js app in a production Docker container. Triggers on "run docker", "start production", "deploy docker".
compatibility: Docker required
license: MIT
metadata: 
  author: Nopparuth Julayanont
  version: "1.0"
---

## Running Production Docker

Follow these steps to deploy the application using Docker.

### 1. Build the Docker Image (If not already built)
Before running, ensure the Docker image is built from the Dockerfile:
```bash
docker build -t nextjs-wha-app:1.0.0 .
```

### 2. Run the Docker Container
Run the container in the background, mapping port 4000 on your host to port 3000 inside the container:
```bash
docker run --restart=always -d --name my-nextjs-wha-app --env-file .env.production -p 4000:3000 nextjs-wha-app:1.0.0
```

### 3. Fix "Conflict" Errors (If the name is already in use)
If you get an error that the container name `/my-nextjs-wha-app` is already in use, remove the old one first:
```bash
docker rm -f my-nextjs-wha-app
```
Then run the command in step 2 again.

## Gotchas

- **Environment File**: Ensure `.env.production` is present in the root folder (without `.txt` extension) before running.
- **Ports**: If port 4000 is already in use by another app, you can change it (e.g., `-p 5000:3000`).
