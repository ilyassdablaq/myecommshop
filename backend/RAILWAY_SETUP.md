# Railway Deployment Setup Guide

Dieses Dokument enthält alle Umgebungsvariablen, die Sie im Railway Dashboard für Ihr Medusa Backend manuell konfigurieren müssen.

## 🚀 Schnellstart

1. Erstellen Sie ein neues **Railway Projekt**
2. Verbinden Sie Ihr **GitHub Repository**
3. Fügen Sie eine neue **PostgreSQL** und **Redis** Service hinzu
4. Konfigurieren Sie die unten aufgeführten Umgebungsvariablen

---

## 📋 Erforderliche Umgebungsvariablen

### Database & Redis (Automatisch durch Railway Services - ODER Upstash)

#### Option A: Railway Services (Auto-generated)

| Variable | Beispiel | Beschreibung |
|----------|----------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL Connection String (wird von Railway auto-generiert) |
| `REDIS_URL` | `redis://user:pass@host:6379` | Redis Connection String (wird von Railway auto-generiert) |

#### Option B: Upstash Redis (empfohlen für Serverless)

| Variable | Beispiel | Beschreibung |
|----------|----------|-------------|
| `REDIS_URL` | `https://default:token@host.upstash.io` | Upstash Redis REST API URL (von [Upstash Dashboard](https://console.upstash.com) kopiert) |

**Hinweis:** 
- Für **DATABASE_URL**: Nutzen Sie Railway PostgreSQL Plugin oder externe Datenbank
- Für **REDIS_URL**: Sie haben die Wahl:
  - ✅ **Upstash Redis** (Empfohlen für Serverless/Railway) - Globale Performance, Pay-per-Request
  - ✅ **Railway Redis Plugin** - Einfach, aber weniger skalierbar
  - ⚠️ **Localhost Redis** - Nur für Development

---

### JWT & Cookie Secrets (MANUELL KONFIGURIEREN)

| Variable | Beispiel | Beschreibung | Erforderlich | Production |
|----------|----------|-------------|--------------|------------|
| `JWT_SECRET` | `your-super-secret-jwt-key-min-32-chars` | Secret für JWT-Token-Signierung. **ÄNDERN SIE DIES!** | ✅ Ja | ✅ Ja |
| `COOKIE_SECRET` | `your-super-secret-cookie-key-min-32-chars` | Secret für Cookie-Verschlüsselung. **ÄNDERN SIE DIES!** | ✅ Ja | ✅ Ja |

**Wichtig:** Verwenden Sie sichere, zufällige Strings mit mindestens 32 Zeichen!

Generieren Sie diese mit:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### CORS & API Konfiguration

| Variable | Beispiel | Beschreibung | Standard |
|----------|----------|-------------|----------|
| `STORE_CORS` | `https://shop.example.com,https://docs.medusajs.com` | Allowed Origins für Store API (komma-separiert) | `http://localhost:8000` |
| `ADMIN_CORS` | `https://admin.example.com` | Allowed Origins für Admin API (komma-separiert) | `http://localhost:9000` |
| `AUTH_CORS` | `https://admin.example.com` | Allowed Origins für Auth Endpoints (komma-separiert) | `http://localhost:9000` |

**Beispiel für Production:**
```
STORE_CORS=https://shop.example.com
ADMIN_CORS=https://admin.example.com
AUTH_CORS=https://admin.example.com
```

---

### Backend URL Konfiguration

| Variable | Beispiel | Beschreibung |
|----------|----------|-------------|
| `MEDUSA_BACKEND_URL` | `https://api.example.com` | Öffentliche URL Ihres Medusa Backends (für Admin-Panel) |
| `NODE_ENV` | `production` | Node.js Environment (`development` oder `production`) |

---

### Worker & Prozessierung (Optional)

| Variable | Wert | Beschreibung | Standard |
|----------|------|-------------|----------|
| `WORKER_MODE` | `shared` oder `worker` | `shared`: Events in Main-Prozess. `worker`: Separate Worker-Prozesse | `shared` |

**Hinweis:** Für kleine bis mittlere Load `shared` verwenden. Bei hohem Traffic `worker` erwägen.

---

### Admin Dashboard (Optional)

| Variable | Beispiel | Beschreibung |
|----------|----------|-------------|
| `ADMIN_BACKEND_URL` | `https://api.example.com` | Backend URL für Admin Dashboard |

---

## 🔧 Railway Dashboard Konfiguration - Schritt für Schritt

### 1. **Neue Secrets / Variables hinzufügen**

Gehen Sie in Ihrem Railway Projekt zu:
```
Settings → Environment → Add Variable
```

### 2. **Paste folgende Variables (mit Ihren Werten):**

```env
# SECRETS (verwenden Sie sichere Werte!)
JWT_SECRET=<GENERIERT_MIT_NODE_COMMAND_OBEN>
COOKIE_SECRET=<GENERIERT_MIT_NODE_COMMAND_OBEN>

# API URLs
MEDUSA_BACKEND_URL=https://your-railway-app.railway.app
STORE_CORS=https://your-frontend.vercel.app
ADMIN_CORS=https://admin.your-frontend.vercel.app
AUTH_CORS=https://admin.your-frontend.vercel.app

# Environment
NODE_ENV=production
WORKER_MODE=shared
```

### 2. **Services verbinden**

#### Variante A: Mit Railway Services (Standard)
- Fügen Sie **PostgreSQL Plugin** hinzu → generiert `DATABASE_URL`
- Fügen Sie **Redis Plugin** hinzu → generiert `REDIS_URL`

Diese werden automatisch gesetzt!

#### Variante B: Mit Upstash Redis (Empfohlen)

**Schritt 1: Upstash Account & Redis Datenbank erstellen**
1. Gehen Sie zu [upstash.com](https://upstash.com)
2. Melden Sie sich an (kostenlos möglich)
3. Erstellen Sie eine neue **Redis Database**
4. Wählen Sie die Region (z.B. eu-west-1 für Europa)

**Schritt 2: Connection String kopieren**
1. In Upstash Dashboard → Ihre Database
2. Klicken Sie auf **Connect**
3. Wählen Sie **Language: Node.js**
4. Kopieren Sie die REST API URL

Beispiel:
```
https://default:ATWqAAIncDE1OTczOWMyYTc1YTA0OTBlYmY5YjRhYTM4MGEyOGFlNHAxMTM3Mzg@creative-eagle-13738.upstash.io
```

**Schritt 3: In Railway Dashboard eintragen**
```
Settings → Environment → Add Variable
REDIS_URL=https://default:YOUR_TOKEN@YOUR_HOST.upstash.io
```

**Vorteile von Upstash:**
- ✅ Kostenlos bis zu 10.000 Befehle/Tag
- ✅ Global verteilt (bessere Performance)
- ✅ Automatische Backups
- ✅ REST API + Redis Protocol
- ✅ Pay-per-Request Pricing

---

## 🧪 Testing nach Deployment

Nach dem Deployment testen Sie:

```bash
# 1. Health Check
curl https://your-railway-app.railway.app/health

# 2. Store API
curl https://your-railway-app.railway.app/store/products

# 3. Admin Login
curl -X POST https://your-railway-app.railway.app/auth/token \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## 📚 Zusätzliche Ressourcen

- [Medusa Configuration Docs](https://docs.medusajs.com/resources/references/medusa_config)
- [Railway Environment Variables](https://docs.railway.app/guides/variables)
- [PostgreSQL on Railway](https://docs.railway.app/plugins/postgres)
- [Redis on Railway](https://docs.railway.app/plugins/redis)

---

## 🚨 Security Checklist

- [ ] JWT_SECRET und COOKIE_SECRET sind eindeutig und sicher
- [ ] NODE_ENV ist auf `production` gesetzt
- [ ] DATABASE_URL und REDIS_URL sind nicht im Code hartcodiert
- [ ] CORS Origins sind auf Ihre tatsächlichen Domains beschränkt
- [ ] Railway Projekt ist auf Private gesetzt (falls GitHub Public ist)
- [ ] SSL/TLS ist aktiviert (Railway macht das automatisch)

---

## 🔄 CI/CD & Automatisierte Migrationen

Railway führt automatisch folgende Scripts aus:

```json
"predeploy": "medusa db:migrate"   // Vor jedem Deploy
"postinstall": "medusa db:migrate" // Nach npm install
```

Dies stellt sicher, dass Datenbankmigrationen automatisch ausgeführt werden.

---

**Fragen?** Überprüfen Sie die [Railway Dokumentation](https://docs.railway.app/) oder die [Medusa Community](https://discord.gg/medusajs).
