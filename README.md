# AZBS Backend API

A Node.js/Express REST API backend with PostgreSQL database for managing Users, Guests, and Items.

## Features

- ✅ Full REST API for Users, Guests, and Items
- ✅ PostgreSQL database with automatic table creation
- ✅ Relational data modeling (User -> Guest -> Item)
- ✅ CORS enabled
- ✅ Error handling and validation
- ✅ Request logging

## Database Schema

### User Table
- `email` (PK) - User's email address
- `name` - User's name
- `role` - User's role
- `photo` - User's photo URL

### Guest Table
- `name` (PK) - Guest's name
- `number` (PK) - Guest's number
- `user_email` (FK) - Reference to User
- `claimed_item` - Item claimed by guest

### Item Table
- `item_name` (PK) - Item name
- `item_photo` - Item photo URL
- `item_link` - Item link
- `claimed` - Boolean flag
- `item_count` - Item count
- `guest_name` (FK) - Reference to Guest
- `guest_number` (FK) - Reference to Guest

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (local or hosted)
- npm or yarn

## Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd azbs_backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:
```env
# Environment Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
```

See `.env.example` for reference.

**Note:** The database tables will be created automatically on first run!

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Root Endpoint
- `GET /` - API information and available endpoints

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:email` - Get user by email
- `GET /api/users/:email/guests` - Get user with their guests
- `POST /api/users` - Create new user
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "photo": "https://example.com/photo.jpg"
  }
  ```
- `PUT /api/users/:email` - Update user
- `DELETE /api/users/:email` - Delete user

### Guest Endpoints
- `GET /api/guests` - Get all guests
- `GET /api/guests/:name/:number` - Get guest by name and number
- `GET /api/guests/:name/:number/items` - Get guest with their items
- `GET /api/guests/user/:userEmail` - Get all guests for a user
- `POST /api/guests` - Create new guest
  ```json
  {
    "name": "Guest Name",
    "number": "123",
    "user_email": "user@example.com",
    "claimed_item": "Item Name"
  }
  ```
- `PUT /api/guests/:name/:number` - Update guest
- `DELETE /api/guests/:name/:number` - Delete guest

### Item Endpoints
- `GET /api/items` - Get all items
- `GET /api/items/claimed` - Get all claimed items
- `GET /api/items/unclaimed` - Get all unclaimed items
- `GET /api/items/:itemName` - Get item by name
- `GET /api/items/guest/:guestName/:guestNumber` - Get items for a guest
- `POST /api/items` - Create new item
  ```json
  {
    "item_name": "Item Name",
    "item_photo": "https://example.com/item.jpg",
    "item_link": "https://example.com/product",
    "claimed": false,
    "item_count": 1,
    "guest_name": "Guest Name",
    "guest_number": "123"
  }
  ```
- `PUT /api/items/:itemName` - Update item
- `POST /api/items/:itemName/claim` - Claim an item
  ```json
  {
    "guest_name": "Guest Name",
    "guest_number": "123"
  }
  ```
- `POST /api/items/:itemName/unclaim` - Unclaim an item
- `DELETE /api/items/:itemName` - Delete item

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing with cURL

### Create a user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","name":"John Doe","role":"admin"}'
```

### Get all users:
```bash
curl http://localhost:3000/api/users
```

### Create a guest:
```bash
curl -X POST http://localhost:3000/api/guests \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","number":"001","user_email":"john@example.com"}'
```

### Create an item:
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"item_name":"Gift Item","item_photo":"https://example.com/photo.jpg","claimed":false,"item_count":1}'
```

## Project Structure

```
azbs_backend/
├── config/
│   ├── database.js       # PostgreSQL connection pool
│   └── initDb.js         # Database initialization & table creation
├── models/
│   ├── User.js           # User model
│   ├── Guest.js          # Guest model
│   └── Item.js           # Item model
├── controllers/
│   ├── userController.js # User CRUD operations
│   ├── guestController.js# Guest CRUD operations
│   └── itemController.js # Item CRUD operations
├── routes/
│   ├── userRoutes.js     # User API routes
│   ├── guestRoutes.js    # Guest API routes
│   └── itemRoutes.js     # Item API routes
├── server.js             # Main application entry point
├── package.json          # Dependencies
├── .env                  # Environment variables (not in git)
├── .env.example          # Example environment variables
└── README.md             # This file
```

## Database Relationships

- **User → Guest**: One-to-Many (One user can have multiple guests)
- **Guest → Item**: One-to-Many (One guest can claim multiple items)

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields (400 Bad Request)
- Duplicate entries (409 Conflict)
- Foreign key violations (400 Bad Request)
- Not found resources (404 Not Found)
- Server errors (500 Internal Server Error)

## Deployment

This application is configured to work with **Render PostgreSQL** for production deployment.

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Quick Deploy to Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Set environment variable: `DATABASE_URL` (your PostgreSQL connection string)
5. Deploy!

The application will automatically:
- Install dependencies
- Connect to the database
- Create all required tables
- Start the server

## License

ISC

