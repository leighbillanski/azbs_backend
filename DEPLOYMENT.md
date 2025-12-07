# AZBS Backend - Deployment Guide

## 🚀 Production Deployment

### Database Configuration

Your application uses PostgreSQL hosted on Render. The connection details are:

**Connection String:**
```
postgresql://abs_a8wt_user:S2IZHYUN2Q5M13hZtPdCUCSAbX36unJ7@dpg-d4os8k6r433s73d5ij40-a.frankfurt-postgres.render.com/abs_a8wt
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Environment Configuration
NODE_ENV=production
PORT=3000

# Database Configuration (Render PostgreSQL)
DATABASE_URL=postgresql://abs_a8wt_user:S2IZHYUN2Q5M13hZtPdCUCSAbX36unJ7@dpg-d4os8k6r433s73d5ij40-a.frankfurt-postgres.render.com/abs_a8wt
```

### Deployment Platforms

#### Option 1: Render (Recommended)

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Configure the service:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add `DATABASE_URL` in the Render dashboard

4. **Environment Variables to set in Render:**
   ```
   DATABASE_URL=postgresql://abs_a8wt_user:S2IZHYUN2Q5M13hZtPdCUCSAbX36unJ7@dpg-d4os8k6r433s73d5ij40-a.frankfurt-postgres.render.com/abs_a8wt
   NODE_ENV=production
   PORT=3000
   ```

#### Option 2: Heroku

1. **Create a new Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set DATABASE_URL=postgresql://abs_a8wt_user:S2IZHYUN2Q5M13hZtPdCUCSAbX36unJ7@dpg-d4os8k6r433s73d5ij40-a.frankfurt-postgres.render.com/abs_a8wt
   heroku config:set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

#### Option 3: Railway

1. **Create a new project** on Railway
2. **Deploy from GitHub**
3. **Add environment variables:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: production

#### Option 4: DigitalOcean App Platform

1. **Create a new app** from your repository
2. **Configure environment variables** in the app settings
3. **Deploy**

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd azbs_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   # Copy .env.example and fill in your values
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Initialization

The application automatically creates all required tables on startup:
- ✅ `users` table
- ✅ `guests` table  
- ✅ `items` table
- ✅ Indexes for performance

No manual database setup is required!

### API Endpoints

Once deployed, your API will be available at:

```
GET/POST   /api/users
GET/POST   /api/guests
GET/POST   /api/items
```

### Health Check

Test your deployment:
```bash
curl https://your-app-url.com/
```

Expected response:
```json
{
  "message": "AZBS Backend API",
  "version": "1.0.0",
  "endpoints": {
    "users": "/api/users",
    "guests": "/api/guests",
    "items": "/api/items"
  }
}
```

### Security Notes

⚠️ **Important:**
- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- Use environment variables for all sensitive data
- For production, consider using secrets management services

### Troubleshooting

**Connection Timeout:**
- Render free tier databases may spin down after inactivity
- First connection after sleep can take 30-60 seconds
- Subsequent connections will be fast

**Port Issues:**
- The app uses `PORT` environment variable (defaults to 3000)
- Most platforms (Render, Heroku) automatically set this

**SSL Errors:**
- The app is configured with `ssl: { rejectUnauthorized: false }`
- This is required for Render PostgreSQL connections

### Support

For issues or questions, check:
- Application logs in your deployment platform
- Database connection status in Render dashboard
- Network/firewall settings if running locally

