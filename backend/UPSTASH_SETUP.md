# Upstash Redis Integration Guide

Detaillierte Anleitung zur Integration von **Upstash Redis** in Ihr Medusa Backend auf Railway.

---

## 🚀 Was ist Upstash?

**Upstash** ist ein **Serverless Redis Provider**, der perfekt für moderne Deployments optimiert ist:

| Feature | Upstash | Railway Redis | Local Redis |
|---------|---------|---------------|-------------|
| **Setup Zeit** | 2 Minuten | 1 Minute | Sofort |
| **Cost** | Pay-per-Request | Monthly | Kostenlos |
| **Global Performance** | ✅ CDN-like | ⚠️ Regional | ❌ N/A |
| **Automatic Scaling** | ✅ Auto | ⚠️ Manual | ❌ Nein |
| **Backups** | ✅ Automatisch | ✅ Ja | ❌ Nein |
| **REST API** | ✅ Ja | ❌ Nein | ❌ Nein |

---

## 📝 Schritt-für-Schritt Setup

### 1. Upstash Account erstellen

**Option A: Kostenlos registrieren**
1. Gehen Sie zu https://upstash.com
2. Klicken Sie auf **Sign Up** → **Email**
3. Bestätigen Sie Ihre E-Mail
4. Akzeptieren Sie die Terms

**Option B: Mit GitHub/Google**
```
Upstash.com → Sign Up → GitHub/Google
```

### 2. Redis Database erstellen

1. **Dashboard öffnen**: https://console.upstash.com
2. **Create Database** klicken
3. **Name eingeben**: z.B. `medusa-production`
4. **Region wählen**: (Z.B. **eu-west-1** für Europa)
5. **Type**: Redis (Standard)
6. **Pricing**: Ggf. **Pay as you go** oder **Free Tier**
7. **Create** klicken

**Verfügbare Regionen:**
```
us-east-1     (USA Ost)
eu-west-1     (Europa Irland)
us-central-1  (USA Zentral)
ap-southeast-1 (Singapur)
```

### 3. Connection String abrufen

Nach der Erstellung:

1. **Klicken Sie auf Ihre Database**
2. **Oben sehen Sie einen Tab "Connect"**
3. **Wählen Sie die Verbindungsmethode:**

**Option A: Redis CLI (Standard)**
```
redis-cli -u rediss://default:AUTH@host:port
```

**Option B: Node.js SDK**
```typescript
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: 'https://creative-eagle-13738.upstash.io',
  token: 'ATWqAAIncDE1OTczOWMyYTc1YTA0OTBlYmY5YjRhYTM4MGEyOGFlNHAxMTM3Mzg',
})

// Test
await redis.set("foo", "bar")
console.log(await redis.get("foo")) // "bar"
```

**Option C: REST API (für Medusa - empfohlen)**
```
Basis URL: https://creative-eagle-13738.upstash.io
Token: ATWqAAIncDE1OTczOWMyYTc1YTA0OTBlYmY5YjRhYTM4MGEyOGFlNHAxMTM3Mzg
```

**Vollständige URL zum Kopieren:**
```
https://default:ATWqAAIncDE1OTczOWMyYTc1YTA0OTBlYmY5YjRhYTM4MGEyOGFlNHAxMTM3Mzg@creative-eagle-13738.upstash.io
```

---

## 🔧 Medusa Konfiguration

### 1. Environment Variable setzen

**In `.env.local` (Development):**
```env
REDIS_URL=https://default:YOUR_TOKEN@YOUR_HOST.upstash.io
```

**In Railway Dashboard (Production):**
```
Settings → Environment → Add Variable
REDIS_URL=https://default:YOUR_TOKEN@YOUR_HOST.upstash.io
```

### 2. medusa-config.ts überprüfen

Ihre Konfiguration unterstützt bereits Upstash:

```typescript
const redisUrl = process.env.REDIS_URL

module.exports = defineConfig({
  projectConfig: {
    redisUrl: redisUrl,
    // ... rest of config
  },
  modules: [
    ...(redisUrl
      ? [
          {
            resolve: "@medusajs/event-bus-redis",
            options: { redisUrl: redisUrl },
          },
          {
            resolve: "@medusajs/cache-redis",
            options: { redisUrl: redisUrl },
          },
        ]
      : []),
  ],
})
```

✅ **Keine Änderungen notwendig!** Das Upstash URL-Format wird automatisch erkannt.

### 3. Lokal testen

```bash
# .env.local mit Upstash URL setzen
REDIS_URL=https://default:token@host.upstash.io

# Backend starten
npm run dev

# Logs sollten zeigen: "Redis connected successfully"
```

---

## 🧪 Testing & Validation

### Test 1: Redis Verbindung testen

```bash
# Lokal via Node.js
node -e "
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.REDIS_URL
});
redis.set('test', 'hello').then(() => redis.get('test')).then(console.log);
"
```

### Test 2: Medusa Events testen

Nach dem Start des Backends:

```bash
# POST Request an Medusa API
curl -X POST http://localhost:9000/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'

# Upstash sollte Events cachen
```

### Test 3: Upstash Dashboard überprüfen

1. Gehen Sie zu [console.upstash.com](https://console.upstash.com)
2. **Klicken Sie auf Ihre Database**
3. **Gehen Sie zum Tab "Statistics"**
4. Sie sollten Requests sehen:
   - Read Calls
   - Write Calls
   - Network Usage

---

## 💰 Pricing & Kosten

### Free Tier (Kostenlos)

- 10.000 Befehle / Tag (unbegrenzte Tage)
- 1 Database
- 256 MB Storage
- Perfekt für Development & kleine Projekte

### Pay as You Go

| Metrik | Preis |
|--------|-------|
| Read | $0.2 pro 100.000 Operationen |
| Write | $1 pro 100.000 Operationen |
| Storage | $0.25 pro GB / Monat |

**Beispiel Monatskosten (mittlerer Store):**
```
100.000 Reads/Tag × 30 = 3M Reads → $6
50.000 Writes/Tag × 30 = 1,5M Writes → $15
Gesamt: ~$21/Monat
```

### Upstash Dashboard Alerts

Sie können Alerts setzen, wenn Sie ein Budget überschreiten:

```
Settings → Billing → Set Alert at $50
```

---

## 🚨 Sicherheit & Best Practices

### 1. Token Sicherheit

❌ **Niemals** in Git committen:
```bash
git add .env  # Falsch!
```

✅ **Token in Railway Secrets speichern:**
```
Settings → Environment → REDIS_URL
```

### 2. Token Rotation

Wenn Token kompromittiert:

1. **Upstash Dashboard** → Ihre Database
2. **Security** Tab
3. **Regenerate Token**
4. **Update Railway Variable**

### 3. Netzwerksicherheit

Upstash bietet:
- ✅ TLS/SSL Verschlüsselung
- ✅ Zertifikatvalidierung
- ✅ IP Whitelisting (Pro Plan)

---

## 🔄 Migration von lokalem Redis zu Upstash

### Daten exportieren (wenn nötig)

```bash
# Lokales Redis exportieren
redis-cli BGSAVE
cp dump.rdb backup.rdb

# Zu Upstash importieren (via CLI)
redis-cli -u rediss://default:TOKEN@HOST:PORT < dump.rdf
```

### Umweltsvariablen updaten

```bash
# Development
cp .env.local .env.local.bak  # Backup
# Dann REDIS_URL in .env.local ändern

# Production (Railway)
# Dashboard → Environment → REDIS_URL
```

### Deployment

```bash
git add .env.template medusa-config.ts
git commit -m "Add Upstash Redis configuration"
git push origin main

# Railway deployed automatisch neu
```

---

## 📊 Monitoring & Debugging

### Logs in Upstash Dashboard

```
Dashboard → [Database] → Logs
```

Zeigt alle Operationen:
- Commands
- Responses
- Latenz
- Errors

### Metriken überprüfen

```
Statistics Tab:
- Command Count
- Error Rate
- P50, P99 Latency
- Network Usage
```

### Problembehebung

**Problem: "Connection refused"**
```
Lösung: URL Format überprüfen
https://default:TOKEN@HOST:PORT
```

**Problem: "Timeout"**
```
Lösung: 
1. Netzwerk-Verbindung testen: ping upstash.io
2. Upstash Status überprüfen: status.upstash.com
3. Railway Logs prüfen
```

**Problem: "High latency"**
```
Lösung:
1. Region zu Ihrer näher wählen
2. Batch Operationen zusammenfassen
3. Pipelining nutzen
```

---

## 🎯 Recommended Setup für Production

```mermaid
graph LR
    A[Vercel Frontend] -->|HTTP| B[Railway Backend]
    B -->|Redis| C[Upstash Redis]
    B -->|PostgreSQL| D[Railway PostgreSQL]
    
    C -->|Global CDN| C
    D -->|Backups| D
```

**Komponenten:**
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Medusa)
- **Cache/Events**: Upstash Redis (Serverless)
- **Database**: Railway PostgreSQL (oder externe DB)

---

## 📚 Dokumentation

- [Upstash Docs](https://upstash.com/docs)
- [Upstash Redis CLI](https://upstash.com/docs/redis/features/cli)
- [Upstash Pricing](https://upstash.com/pricing)
- [Medusa Redis Config](https://docs.medusajs.com/resources/references/medusa_config#redis)

---

## 🆘 Support

- **Upstash Support**: https://upstash.com/support
- **Upstash Discord**: https://discord.gg/upstash
- **Medusa Discord**: https://discord.gg/medusajs

---

**Viel Erfolg mit Upstash Redis!** 🚀
