# ⚠️ Security Notice: Password Storage

## Current Implementation

The User model currently stores passwords as **plain text** in the database. 

**⚠️ THIS IS NOT SECURE FOR PRODUCTION USE!**

---

## 🔒 Recommended: Implement Password Hashing

For production deployment, passwords should be **hashed** before storage using bcrypt.

### Quick Implementation Guide:

#### 1. Install bcrypt

```bash
npm install bcrypt
```

#### 2. Update User Model (`models/User.js`)

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// In create method:
static async create(userData) {
  const { email, name, password, role } = userData;
  
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  const result = await pool.query(
    `INSERT INTO users (email, name, password, role) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [email, name, hashedPassword, role]
  );
  return result.rows[0];
}

// In update method (only if password is being changed):
static async update(email, userData) {
  const { name, password, role } = userData;
  
  // Hash password if provided
  const hashedPassword = password 
    ? await bcrypt.hash(password, SALT_ROUNDS) 
    : null;
  
  const result = await pool.query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         password = COALESCE($2, password),
         role = COALESCE($3, role),
         updated_at = CURRENT_TIMESTAMP
     WHERE email = $4 
     RETURNING *`,
    [name, hashedPassword, role, email]
  );
  return result.rows[0];
}
```

#### 3. Add Login/Authentication Method

```javascript
// Add to User model
static async authenticate(email, password) {
  const user = await this.findByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return null;
  }
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
```

#### 4. Create Login Endpoint (`controllers/userController.js`)

```javascript
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const user = await User.authenticate(email, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while logging in'
    });
  }
};

// Don't forget to export it
module.exports = {
  getAllUsers,
  getUser,
  getUserWithGuests,
  createUser,
  updateUser,
  deleteUser,
  loginUser  // Add this
};
```

#### 5. Add Login Route (`routes/userRoutes.js`)

```javascript
router.post('/login', loginUser);
```

---

## 🛡️ Additional Security Best Practices

### 1. **Never Return Passwords in API Responses**

Modify queries to exclude password:

```javascript
// In findAll and findByEmail
'SELECT email, name, role, created_at, updated_at FROM users ...'
// Note: password column excluded
```

### 2. **Implement JWT Authentication**

```bash
npm install jsonwebtoken
```

Use JWT for session management instead of sending passwords repeatedly.

### 3. **Add Password Validation**

```javascript
// Minimum requirements
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};
```

### 4. **Rate Limiting**

```bash
npm install express-rate-limit
```

Prevent brute force attacks on login endpoint.

### 5. **HTTPS Only**

Always use HTTPS in production to encrypt data in transit.

---

## 📝 Current Status

- ✅ Password field added to User model
- ✅ Password required on user creation
- ⚠️ Passwords stored in **plain text** (not secure!)
- ❌ No password hashing implemented
- ❌ No login/authentication endpoint
- ❌ Passwords returned in API responses

---

## 🎯 Recommended Action Plan

**For Development/Testing:**
- Current implementation is fine for local testing
- Useful for quick prototyping

**Before Production:**
1. ✅ Install bcrypt
2. ✅ Implement password hashing
3. ✅ Create login endpoint
4. ✅ Exclude passwords from responses
5. ✅ Add JWT authentication
6. ✅ Implement password validation
7. ✅ Add rate limiting

---

## 📚 Resources

- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

**⚠️ Remember: Never deploy to production with plain text passwords!**

