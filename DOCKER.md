Docker & Compose notes

Why changes:
- This repository is the application source and is primarily built by CI. Running Docker locally from inside the repository can be confusing.
- A `dev/` folder now contains a purpose-built `docker-compose.yml` for local/dev reproduction.
- The original repo-level `docker-compose.yml` has been moved to `docker-compose.example.yml` as a reference.

What to use:
- CI/containers: keep the `Dockerfile` in the repo; CI systems should build images using the `Dockerfile` and pass secrets as build args or runtime envs.
- Local/dev: use `/home/hakan/dev/docker-compose.yml` which mounts uploads and runs Postgres locally for development.

Security notes:
- Do NOT bake secrets into images. Use build args only for non-secret build-time values and use runtime envs or secret managers for production secrets.
- `Dockerfile` currently accepts `ARG DATABASE_URL` and `ARG JWT_SECRET` for local builds; avoid committing real secrets.

Cleanup suggestions (optional):
- If you don't need the example compose, delete `docker-compose.example.yml`.
- If you want `promote.yml` to deploy to the `dev` host automatically, add `DEV_HOST` and related secrets to GitHub Actions secrets and modify `ci.yml` accordingly.
