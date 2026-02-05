# Deployment guide — HK

This document describes a careful, two-stage deployment (staging / production) using GitHub Actions, GHCR and an SSH deploy step that runs Docker Compose on the VPS.

Important: do NOT put secrets in the repo. Use GitHub Secrets and `.env.production` / `.env.staging` files on the server.

- `GHCR_TOKEN` — Personal access token with `write:packages` (used to push images to ghcr.io)
- `SSH_PRIVATE_KEY` — private key for the `deploy` user on the VPS (add corresponding public key to `/home/deploy/.ssh/authorized_keys`)
- `VPS_HOST` — server IP or hostname
- `VPS_USER` — username (e.g., `deploy`)
- `VPS_PORT` — ssh port (22 default)
- `REMOTE_APP_DIR` — path on VPS where `docker-compose.prod.yml` lives (e.g., `/home/deploy/apps/hk`)
Required repo secrets (Settings → Secrets):
- `GHCR_TOKEN` — Personal access token with `write:packages` (used to push images to ghcr.io)
- `SSH_PRIVATE_KEY` — private key for the `deploy` user on the VPS (add corresponding public key to `/home/deploy/.ssh/authorized_keys`)
- `VPS_HOST` — server IP or hostname
- `VPS_USER` — username (e.g., `deploy`)
- `VPS_PORT` — ssh port (22 default)
- `REMOTE_APP_DIR` — path on VPS where `docker-compose.prod.yml` lives (e.g., `/home/deploy/apps/hk`)
- `REMOTE_APP_DIR_STAGING` — path on VPS where staging compose lives (e.g., `/home/deploy/apps/hk-staging`)

Domains for this project:
- Production: https://marketpati.com
- Staging/dev: https://dev.marketpati.com

DNS records you should add (point both to VPS IP):
- `A` record: `marketpati.com` -> VPS_IP
- `A` record: `dev.marketpati.com` -> VPS_IP

ENV files on server (do NOT commit to repo):
- `/home/deploy/apps/hk/.env.production` — production variables including `HOSTNAME=marketpati.com`
- `/home/deploy/apps/hk-staging/.env.staging` — staging variables including `HOSTNAME=dev.marketpati.com`

When creating `.env.production` and `.env.staging` ensure they contain at minimum:
- `HOSTNAME` — domain for the compose labels (see above)
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DATABASE_URL`
- `JWT_SECRET`
- Any other application-specific env vars
- `GHCR_TOKEN` — Personal access token with `write:packages` (used to push images to ghcr.io)
- `SSH_PRIVATE_KEY` — private key for the `deploy` user on the VPS (add corresponding public key to `/home/deploy/.ssh/authorized_keys`)
- `VPS_HOST` — server IP or hostname
- `VPS_USER` — username (e.g., `deploy`)
- `VPS_PORT` — ssh port (22 default)
- `REMOTE_APP_DIR` — path on VPS where `docker-compose.prod.yml` lives (e.g., `/home/deploy/apps/hk`)

How it works
1. Push to `master` → workflow builds Docker image and pushes to `ghcr.io/${{ github.repository_owner }}/hk:latest`.
2. Workflow SSHs to VPS and runs `docker compose pull hk` + `docker compose up -d` inside `REMOTE_APP_DIR`.

Initial server setup (performed once)
1. Create `deploy` user and add your public key(s):
```bash
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
# paste public keys into /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
```
2. Install Docker and Compose (see DEPLOYMENT section below for commands)
3. Create application directory and place `docker-compose.prod.yml` and `.env.production` there:
```bash
sudo -u deploy mkdir -p /home/deploy/apps/hk
sudo -u deploy cp docker-compose.prod.yml /home/deploy/apps/hk/
# create /home/deploy/apps/hk/.env.production and fill real secrets (DB, JWT_SECRET...)
```

Notes & checklist before first deploy
- Add DNS A records pointing your domain and `hk.staging.example.com` to the VPS IP.
- Add the public key corresponding to `SSH_PRIVATE_KEY` into `/home/deploy/.ssh/authorized_keys`.
- Set GitHub secrets listed above.

Troubleshooting
- If `docker compose pull` fails, check `docker compose -f docker-compose.prod.yml config` and verify image tag.
- Check `docker logs <container>` for runtime errors.

Security
- Do not store `.env.production` in the repo. Keep it on the server and in vaults.
- Use `ufw` to restrict SSH to known IPs if possible.
