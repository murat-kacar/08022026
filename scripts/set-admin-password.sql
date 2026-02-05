-- Run this against the running Postgres to set the admin user's password hash
-- Usage (example):
-- docker compose exec hk-db-1 psql -U postgres -d hk -f /workspaces/HK/scripts/set-admin-password.sql

UPDATE users
SET password_hash = '$2b$10$SsU3rxUD3GAkirXXQplyLuBLsEdrXouUatMuWLAWQlRq7pplXMOM6'
WHERE username = 'admin';
