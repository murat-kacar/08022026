Deployment and CI Setup
=======================

Genel Bakış
-----------
3 aşamalı deployment pipeline: **repo → dev → prod**

| Ortam | Domain | Dizin | Açıklama |
|-------|--------|-------|----------|
| repo  | `prod.hakankarsakakademi.com` | `/home/hakan/repo/` | Geliştirme — kaynak koddan build |
| dev   | `dev.hakankarsakakademi.com`  | `/home/hakan/dev/`  | Staging — önceden build edilmiş image |
| prod  | `hakankarsakakademi.com`      | `/home/hakan/prod/` | Production — onaylanmış image |

Akış: `repo → [ONAY] → dev → [KRİTİK ONAY] → prod`

Ön Gereksinimler
-----------------
- Docker & Docker Compose
- Sunucuda 80/443 portları açık
- DNS kayıtları: `hakankarsakakademi.com`, `dev.hakankarsakakademi.com`, `prod.hakankarsakakademi.com` → sunucu IP

İlk Kurulum (Sıfırdan)
-----------------------

### 1. .env dosyalarını oluşturun

```bash
# repo
cp /home/hakan/repo/.env.example /home/hakan/repo/.env
nano /home/hakan/repo/.env

# dev
cp /home/hakan/dev/.env.example /home/hakan/dev/.env
nano /home/hakan/dev/.env

# prod
cp /home/hakan/prod/.env.example /home/hakan/prod/.env
nano /home/hakan/prod/.env
```

### 2. Docker ağını oluşturun

```bash
docker network create hk-proxy
```

### 3. SSL sertifikalarını alın

```bash
cd /home/hakan/nginx-proxy
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```

### 4. Deployment Manager'ı başlatın

```bash
chmod +x /home/hakan/deploy.sh
/home/hakan/deploy.sh
```

Menüden:
1. **Build & Start (repo)** — repo'yu derleyip çalıştırır → `prod.hakankarsakakademi.com`
2. **Promote → DEV** — onay ile dev'e taşır → `dev.hakankarsakakademi.com`
3. **Promote → PRODUCTION** — kritik onay ile prod'a taşır → `hakankarsakakademi.com`

Dizin Yapısı
------------

```
/home/hakan/
├── repo/                     ← Kaynak kod (git repo)
│   ├── docker-compose.yml    ← Build from source
│   ├── Dockerfile
│   └── .env
│
├── dev/                      ← Minimum Docker
│   ├── docker-compose.yml    ← Pre-built image kullanır
│   └── .env
│
├── prod/                     ← Minimum Docker
│   ├── docker-compose.yml    ← Pre-built image kullanır
│   └── .env
│
├── nginx-proxy/              ← Master reverse proxy
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── init-letsencrypt.sh
│
├── deploy.sh                 ← Onay mekanizmalı deployment manager
├── deploy.log                ← Deploy logları
└── .deploy-state             ← Versiyon takibi
```

Onay Mekanizması
----------------
- **Dev promote:** Interactive onay (e/H sorusu)
- **Prod promote:** "DEPLOY" yazarak kritik onay
- Her işlem `deploy.log` dosyasına loglanır
- Rollback desteği: önceki versiyona geri dönülebilir

Port Dağılımı (internal)
-------------------------
| Ortam | App | PostgreSQL |
|-------|-----|------------|
| repo  | 3000 (internal) | 5433 (localhost) |
| dev   | 3000 (internal) | 5434 (localhost) |
| prod  | 3000 (internal) | 5435 (localhost) |

Dışarıya sadece 80/443 açık (Nginx proxy üzerinden).

Komutlar
--------

```bash
# Deployment Manager (interaktif menü)
./deploy.sh

# Manuel ortam kontrolü
cd /home/hakan/repo && docker compose up -d      # repo başlat
cd /home/hakan/dev && docker compose up -d        # dev başlat
cd /home/hakan/prod && docker compose up -d       # prod başlat
cd /home/hakan/nginx-proxy && docker compose up -d # proxy başlat

# Logları izle
docker logs -f hk-repo-app
docker logs -f hk-dev-app
docker logs -f hk-prod-app
```

GitHub Actions (Opsiyonel)
--------------------------
Mevcut `.github/workflows/ci.yml` ve `promote.yml` dosyaları GHCR tabanlı CI/CD için kullanılabilir.
Local deploy.sh bu workflow'lardan bağımsız çalışır.
