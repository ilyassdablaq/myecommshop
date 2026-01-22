# Vercel Frontend Deployment Guide

Dieses Dokument beschreibt, wie Sie Ihr Next.js Frontend auf Vercel deployen und mit Ihrem Railway Backend verbinden.

## 🚀 Schnellstart

1. **Repository vorbereiten**
   ```bash
   git add .
   git commit -m "Add Vercel deployment config"
   git push origin main
   ```

2. **Vercel Connect**
   - Gehen Sie zu [vercel.com](https://vercel.com)
   - Importieren Sie Ihr GitHub Repository
   - Wählen Sie den `frontend` Ordner als Root Directory

3. **Environment Variables setzen**
   - Gehen Sie zu **Settings → Environment Variables**
   - Fügen Sie die unten aufgeführten Variablen hinzu

---

## 📋 Erforderliche Environment Variables

### Development & Production

| Variable | Beispiel | Beschreibung |
|----------|----------|-------------|
| `MEDUSA_BACKEND_URL` | `https://your-app.railway.app` | URL Ihres Medusa Backends auf Railway |
| `NEXT_PUBLIC_BASE_URL` | `https://your-store.vercel.app` | Öffentliche URL Ihres Storefronts |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | `pk_abc123...` | Publishable Key aus Medusa Admin |
| `NEXT_PUBLIC_DEFAULT_REGION` | `us` | Standard-Region (ISO-2 Code) |

### Payment Provider (Optional)

| Variable | Beispiel | Beschreibung |
|----------|----------|-------------|
| `NEXT_PUBLIC_STRIPE_KEY` | `pk_live_...` | Stripe Public Key (nur für Production!) |

---

## 🔧 Vercel Dashboard - Schritt für Schritt

### 1. **Projekt importieren**

```
Dashboard → Add New → Project → Import Git Repository
```

Wählen Sie Ihr E-Commerce Repository.

### 2. **Root Directory konfigurieren**

```
Framework Preset: Next.js
Root Directory: ./frontend
```

### 3. **Environment Variables hinzufügen**

Klicken Sie auf **Settings → Environment Variables** und fügen Sie hinzu:

**Production (alle Regionen):**
```
MEDUSA_BACKEND_URL = https://your-railway-backend.railway.app
NEXT_PUBLIC_BASE_URL = https://your-store.vercel.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = pk_your_key_from_medusa_admin
NEXT_PUBLIC_DEFAULT_REGION = us
```

**Nur Production:**
```
NEXT_PUBLIC_STRIPE_KEY = pk_live_your_stripe_key
NODE_ENV = production
```

**Nur Preview & Development:**
```
NEXT_PUBLIC_STRIPE_KEY = pk_test_your_stripe_test_key
NODE_ENV = development
```

---

## 🔐 Sichere Secrets Management

### Publishable Key generieren

1. Gehen Sie zu Ihrem **Medusa Admin Dashboard**
2. **Settings → Apps & Keys → Publishable Keys**
3. Erstellen Sie einen neuen Key mit Bereichen:
   - `Products`
   - `Carts`
   - `Orders`
   - `Customers`

---

## 📦 Vercel Build & Deployment

### Build Settings (automatisch erkannt)

```
Framework: Next.js
Build Command: next build
Start Command: next start
```

### Node.js Version

Vercel verwendet standardmäßig die aktuellste LTS-Version. Sie können dies unter **Settings → Functions → Node.js Version** anpassen.

---

## 🌐 Custom Domain & DNS

### Domain hinzufügen

1. **Settings → Domains**
2. Klicken Sie auf **Add Domain**
3. Folgen Sie den DNS-Konfigurationsanweisungen
4. Vercel aktualisiert SSL-Zertifikat automatisch

---

## 🔄 Automatic Deployments

Vercel bereitete automatisch durch:

- **Push zu Main Branch**: Production Deployment
- **Push zu anderen Branches**: Preview Deployment
- **Pull Requests**: Automatic Preview URLs

### Environment Variables für Branches

Sie können verschiedene Env-Variablen pro Branch setzen:

```
Settings → Environment Variables → Select Branch
```

---

## 🧪 Testing nach Deployment

```bash
# Überprüfen Sie die Live-URL
curl https://your-store.vercel.app

# Health Check
curl https://your-store.vercel.app/api/health

# Backend-Verbindung testen
curl https://your-store.vercel.app/store/products
```

---

## 📊 Monitoring & Logs

### Real-time Logs
```
Deployments → [Current Deployment] → Logs
```

### Error Tracking
```
Settings → Analytics & Monitoring
```

---

## 🚨 Häufige Probleme & Lösungen

### Problem: "CORS Error" oder "Backend nicht erreichbar"

**Lösung:**
1. Überprüfen Sie, dass `MEDUSA_BACKEND_URL` auf Railway-URL zeigt
2. Stellen Sie sicher, dass Railway `STORE_CORS` Ihre Vercel-Domain enthält:
   ```
   STORE_CORS=https://your-store.vercel.app,https://*.vercel.app
   ```

### Problem: "Publishable Key invalid"

**Lösung:**
1. Überprüfen Sie, dass der Key in Medusa Admin aktiviert ist
2. Stellen Sie sicher, dass die URL dem `NEXT_PUBLIC_BASE_URL` entspricht
3. Regenerieren Sie den Key bei Bedarf

### Problem: "Environment variable not found"

**Lösung:**
1. Überprüfen Sie die Schreibweise (Case-sensitive!)
2. Stellen Sie sicher, dass Variable auf die richtige Region (Production/Preview) angewendet wird
3. Redeploy nach Änderungen (Vercel cached sie)

---

## 🔄 Redeploy und Rollback

### Manuelles Redeploy

```
Deployments → [Any Deployment] → ... → Redeploy
```

### Rollback zur vorherigen Version

```
Deployments → [Previous Deployment] → ... → Promote to Production
```

---

## 💡 Performance Optimization

### Image Optimization

Next.js optimiert Bilder automatisch. Verwenden Sie die `<Image>` Komponente:

```tsx
import Image from 'next/image'

<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={500}
  priority // Für Above-the-fold Images
/>
```

### Cache Control

Vercel setzt automatisch optimal Cache-Header. Konfigurierbar in `next.config.js`:

```javascript
module.exports = {
  images: {
    domains: ['your-cdn.com'],
    minimumCacheTTL: 31536000, // 1 Jahr
  },
}
```

---

## 📚 Zusätzliche Ressourcen

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Medusa Admin Setup](https://docs.medusajs.com/resources/admin/setup)
- [Environment Variables Best Practices](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Bereit zum Deployen?** Beginnen Sie mit dem [Railway Backend Setup](../backend/RAILWAY_SETUP.md).
