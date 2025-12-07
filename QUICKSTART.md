# Quick Start Guide

## Setup Instructions

### 1. Ensure PostgreSQL is installed and running

```bash
# Check if PostgreSQL is installed
psql --version

# If not installed on Ubuntu/WSL:
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create the database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE azbs_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE azbs_db TO postgres;
\q
```

### 3. Update .env file (if needed)

The `.env` file is already configured with default values. Update if your PostgreSQL setup differs:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=azbs_db
```

### 4. Start the server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The server will:
- Automatically create all necessary tables
- Start on http://localhost:3000
- Display all available API endpoints

### 5. Test the API

```bash
# Test root endpoint
curl http://localhost:3000

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","role":"user"}'

# Get all users
curl http://localhost:3000/api/users
```

## Common Issues

### PostgreSQL connection error
- Make sure PostgreSQL is running: `sudo service postgresql status`
- Check credentials in `.env` file
- Verify database exists: `sudo -u postgres psql -l`

### Port already in use
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

### Permission denied
- Make sure you have proper permissions: `sudo chmod -R 755 /home/vmuser/personal/azbs_backend`

## Next Steps

1. Review the API documentation in README.md
2. Test all endpoints using curl or Postman
3. Build your frontend application
4. Add authentication/authorization as needed

## Support

For issues or questions, check the logs when running `npm run dev` for detailed error messages.

