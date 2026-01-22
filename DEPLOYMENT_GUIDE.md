# E-Commerce Deployment Guide (Railway + Vercel)

Vollständige Anleitung zum Deployen Ihres Medusa E-Commerce auf **Railway (Backend)** und **Vercel (Frontend)**.

---

## 📋 Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Next.js)      Backend (Medusa)                   │
│  ────────────────────    ─────────────────                  │
│  vercel.app ←─────────→  railway.app                        │
│                 CORS                                         │
│                 HTTP                                         │
│                 WebSockets                                   │
│                          │                                   │
│                          ├─ PostgreSQL (Railway Plugin)     │
│                          ├─ Redis (Railway oder Upstash)    │
│                          └─ Sendgrid/Email (Optional)       │
│                                                              │
│  Empfohlen für globale Performance:                         │
│  ─────────────────────────────────                          │
│                          └─ Upstash Redis (CDN-like)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Checkliste

### ✅ Pre-Deployment (Lokal)

- [ ] `npm install` in Backend und Frontend
- [ ] `npm run build` erfolgreich
- [ ] `.env` Dateien mit Production Values bereit
- [ ] JWT_SECRET und COOKIE_SECRET generiert
- [ ] Database Migrations getestet
- [ ] Tests bestanden (`npm test`)

### ✅ Railway (Backend)

- [ ] Railway Account erstellt
- [ ] GitHub Repository verbunden
- [ ] PostgreSQL Plugin hinzugefügt
- [ ] **Redis Option wählen:**
  - [ ] Railway Redis Plugin, ODER
  - [ ] Upstash Redis (empfohlen)
- [ ] Environment Variables gesetzt (siehe [RAILWAY_SETUP.md](./backend/RAILWAY_SETUP.md))
- [ ] Deployment erfolgreich
- [ ] Health-Check bestanden: `curl /health`

### ✅ Vercel (Frontend)

- [ ] Vercel Account erstellt
- [ ] GitHub Repository importiert
- [ ] Root Directory auf `./frontend` gesetzt
- [ ] Environment Variables konfiguriert (siehe [VERCEL_SETUP.md](./frontend/VERCEL_SETUP.md))
- [ ] Deployment erfolgreich
- [ ] Backend-Verbindung getestet

---

## 📝 Schnellstart Kommando-Übersicht

### Lokal entwickeln

```bash
# Backend Terminal
cd backend
npm install
npm run dev

# Frontend Terminal (in neuem Terminal)
cd frontend
npm install
npm run dev
```

Backend läuft unter `http://localhost:9000`, Frontend unter `http://localhost:8000`.

### Production Secrets generieren

```bash
# JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# COOKIE_SECRET
node -e "console.log('COOKIE_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### Railway Deploy

```bash
# Über GitHub (automatisch bei Push zu main)
git add .
git commit -m "Production ready"
git push origin main

# Manuell via Railway CLI
railway up
```

### Vercel Deploy

```bash
# Über GitHub (automatisch bei Push zu main)
git add .
git commit -m "Production ready"
git push origin main

# Manuell via Vercel CLI
npm install -g vercel
cd frontend
vercel deploy --prod
```

---

## 🔧 Konfigurationsdateien

### Backend

| Datei | Zweck |
|-------|--------|
| `medusa-config.ts` | Medusa Core Config (DB, Redis, Modules) |
| `railway.json` | Railway Build & Start Konfiguration |
| `.env.template` | Environment Variable Vorlagen |
| `RAILWAY_SETUP.md` | Railway Deployment Anleitung |

### Frontend

| Datei | Zweck |
|-------|--------|
| `next.config.js` | Next.js Build Konfiguration |
| `.env.example` | Environment Variable Vorlagen |
| `VERCEL_SETUP.md` | Vercel Deployment Anleitung |

---

## 🔐 Security Best Practices

### 1. **Secrets Management**

✅ **DO:**
```bash
# Sichere Secrets generieren
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# In Railway/Vercel Dashboard eingeben (nicht in Code)
# Git ignore für .env Dateien nutzen
```

❌ **DON'T:**
```bash
# Secrets in Code schreiben
JWT_SECRET="hardcoded-secret" // BAD!

# Secrets in Git committen
git add .env.production // BAD!

# Development Secrets in Production verwenden
JWT_SECRET="supersecret" // BAD!
```

### 2. **CORS Konfiguration**

```env
# Development (localhost erlaubt)
STORE_CORS=http://localhost:8000

# Production (nur Ihre Domain)
STORE_CORS=https://shop.example.com
```

### 3. **Environment Variables Trennung**

```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

---

## 🧪 Testing & Validierung

### Health Checks

```bash
# Backend Health
curl https://your-backend.railway.app/health

# Frontend Health
curl https://your-store.vercel.app/

# API Test
curl https://your-backend.railway.app/store/products
```

### End-to-End Test

```bash
# 1. Frontend laden
https://your-store.vercel.app

# 2. In Backend anmelden
POST https://your-backend.railway.app/auth/token

# 3. Produkte laden
GET https://your-backend.railway.app/store/products

# 4. Cart erstellen
POST https://your-backend.railway.app/store/carts
```

---

## 📊 Monitoring & Logging

### Railway Logs

```bash
# Real-time Logs
railway logs -f

# Nur Errors
railway logs --error
```

Dashboard: `Settings → Deployments → Logs`

### Vercel Logs

Dashboard: `Deployments → [Deployment] → Logs`

### Metriken

- **Railway**: CPU, Memory, Disk Usage
- **Vercel**: Build Times, Response Times, Error Rates

---

## 🔄 CI/CD Pipeline

### Automatische Migrationen

```json
// Backend package.json
"predeploy": "medusa db:migrate"  // Vor Deploy
"postinstall": "medusa db:migrate" // Nach npm install
```

Diese Scripts werden automatisch bei jedem Deploy ausgeführt.

### Automatische Deployments

1. **Code pushen**: `git push origin main`
2. **CI Checks**: GitHub Actions/Railway/Vercel führen Tests aus
3. **Build**: `npm run build` wird automatisch ausgeführt
4. **Deploy**: Wenn erfolgreich, wird automatisch deployed

---

## 🆘 Troubleshooting

### Backend startet nicht

```bash
# Log prüfen
railway logs

# Häufige Fehler:
# 1. DATABASE_URL nicht gesetzt
#    Lösung: PostgreSQL Plugin zu Railway hinzufügen

# 2. REDIS_URL nicht gesetzt
#    Lösung: Redis Plugin zu Railway hinzufügen

# 3. JWT_SECRET/COOKIE_SECRET zu kurz
#    Lösung: Mindestens 32 Zeichen (siehe node -e Command oben)
```

### Frontend lädt Backend nicht

```bash
# 1. CORS Error?
#    Lösung: STORE_CORS in Railway entsprechend setzen
#    STORE_CORS=https://your-store.vercel.app

# 2. Publishable Key invalid?
#    Lösung: Key in Medusa Admin regenerieren und neu setzen

# 3. MEDUSA_BACKEND_URL falsch?
#    Lösung: Vercel Environment Variable überprüfen
#    Sollte auf Railway URL zeigen (mit https://)
```

### Datenbank Connection Error

```bash
# 1. CONNECTION_REFUSED?
#    Railway PostgreSQL lädt? Dashboard → Deployments → Logs

# 2. ROLE doesn't exist?
#    Lösung: Railway PostgreSQL neu starten

# 3. CONNECT_TIMEOUT?
#    Lösung: DATABASE_URL Format überprüfen (muss postgresql:// sein)
```

---

## 📚 Dokumentation

### Detaillierte Setup Guides

- [Railway Backend Setup](./backend/RAILWAY_SETUP.md)
- [Upstash Redis Setup](./backend/UPSTASH_SETUP.md) ← Für optimale Performance!
- [Vercel Frontend Setup](./frontend/VERCEL_SETUP.md)

### Offizielle Dokumentation

- [Medusa Deployment](https://docs.medusajs.com/deployments)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 📞 Support

- **Medusa Community**: https://discord.gg/medusajs
- **Railway Support**: https://help.railway.app
- **Vercel Support**: https://vercel.com/help

---

## 🎯 Next Steps

1. **Backend Deploy**: Folgen Sie [RAILWAY_SETUP.md](./backend/RAILWAY_SETUP.md)
2. **Frontend Deploy**: Folgen Sie [VERCEL_SETUP.md](./frontend/VERCEL_SETUP.md)
3. **Testen**: Beide Anwendungen verbinden und testen
4. **Monitoring**: Logs & Metriken in Dashboards überwachen
5. **Optimieren**: Performance & Security optimieren

---

**Viel Erfolg beim Deployen!** 🚀
