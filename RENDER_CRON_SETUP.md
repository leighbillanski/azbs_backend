# 🔄 Render Cron Job Setup - Keep Your API Alive

## ✅ Health Endpoint Ready!

Your API now has a `/health` endpoint that returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-12-07T...",
  "uptime": 12345.67,
  "environment": "production"
}
```

---

## 📋 Step-by-Step: Create Render Cron Job

### Step 1: Deploy Your Web Service First

1. Go to: https://dashboard.render.com
2. Click: **New +** → **Web Service**
3. Connect your repository: `leighbillanski/azbs_backend`
4. Configure:
   ```
   Name:           azbs-backend
   Region:         Frankfurt (EU Central)
   Branch:         main
   Root Directory: (leave blank)
   Build Command:  npm install
   Start Command:  npm start
   ```
5. Add Environment Variable:
   ```
   Key:    DATABASE_URL
   Value:  postgresql://abs_a8wt_user:S2IZHYUN2Q5M13hZtPdCUCSAbX36unJ7@dpg-d4os8k6r433s73d5ij40-a.frankfurt-postgres.render.com/abs_a8wt
   ```
6. Click: **Create Web Service**
7. Wait for deployment (3-5 minutes)
8. **Copy your app URL** (e.g., `https://azbs-backend.onrender.com`)

---

### Step 2: Create the Cron Job

1. Go to: https://dashboard.render.com
2. Click: **New +** → **Cron Job**
3. Configure:

```
Name:           azbs-keepalive
Command:        curl https://YOUR-APP-URL.onrender.com/health
Schedule:       */14 * * * *
Region:         Frankfurt (EU Central)
Instance Type:  Free
```

**Important:** Replace `YOUR-APP-URL` with your actual deployed URL!

Example:
```bash
curl https://azbs-backend.onrender.com/health
```

4. Click: **Create Cron Job**

---

## ⏰ Schedule Options

Choose one of these schedules:

| Schedule | Description | Recommended |
|----------|-------------|-------------|
| `*/14 * * * *` | Every 14 minutes | ⭐ Best (stays just under 15-min limit) |
| `*/10 * * * *` | Every 10 minutes | Good (more frequent) |
| `*/5 * * * *` | Every 5 minutes | OK (might be excessive) |

**Recommendation:** Use `*/14 * * * *` - keeps your app alive without overusing Render's resources.

---

## 🧪 Testing

### Test the Health Endpoint

Once deployed, test it:

```bash
# Replace with your actual URL
curl https://azbs-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-07T15:30:00.000Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

### Verify Cron Job

1. Go to your Cron Job in Render dashboard
2. Click on **Logs**
3. You should see successful pings every 14 minutes
4. Look for HTTP 200 responses

---

## 📊 Complete Architecture

```
┌─────────────────────────┐
│  Render Cron Job        │
│  (Free Tier)            │
│  Runs: */14 * * * *     │
└────────┬────────────────┘
         │ Pings every 14 min
         ▼
┌─────────────────────────────────────┐
│  Your Web Service (Free Tier)      │
│  https://azbs-backend.onrender.com  │
│  Endpoints:                         │
│    GET  /                           │
│    GET  /health ← Cron hits this    │
│    GET  /api/users                  │
│    GET  /api/guests                 │
│    GET  /api/items                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database (Render)       │
│  abs_a8wt                           │
└─────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Web Service | Free | $0 |
| Cron Job | Free | $0 |
| PostgreSQL | Free | $0 |
| **Total** | | **$0** ✅ |

---

## ✅ Benefits

- ✅ **Zero Cold Starts** - API always ready
- ✅ **Instant Response** - No 30-60 second delays
- ✅ **100% Free** - All services on free tier
- ✅ **45 Users** - Perfect performance
- ✅ **24/7 Uptime** - Always available
- ✅ **Easy Management** - One platform

---

## 🔍 Monitoring

### Check Cron Job Status:
1. Go to: https://dashboard.render.com
2. Click your Cron Job: `azbs-keepalive`
3. View **Logs** to see pings
4. Check **Events** for schedule runs

### Check Web Service Status:
1. Click your Web Service: `azbs-backend`
2. View **Logs** to see incoming requests
3. Check **Metrics** for uptime and performance

---

## 🚨 Troubleshooting

### Cron Job Not Running?
- Check the schedule syntax: `*/14 * * * *`
- Verify the URL in the curl command
- Check Cron Job logs for errors

### Health Endpoint Not Responding?
- Verify Web Service is deployed
- Test manually: `curl https://your-url.onrender.com/health`
- Check Web Service logs

### API Still Spinning Down?
- Verify Cron Job is running (check logs)
- Ensure schedule is correct (every 14 min or less)
- Try changing schedule to `*/10 * * * *`

---

## 📝 Summary

1. ✅ Health endpoint added to your code
2. ✅ Code pushed to GitHub
3. 📋 Deploy Web Service on Render
4. 📋 Create Cron Job on Render
5. ✅ Your API stays alive 24/7 for free!

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Your GitHub Repo:** https://github.com/leighbillanski/azbs_backend
- **Cron Schedule Help:** https://crontab.guru

---

**Your API is now ready for 45 users with zero downtime!** 🚀

