# BabyShop Backend Full Setup – File-wise Guide

এই নোটটি তোমাকে পুরো **BabyShop / ZoomZoom backend setup** একবারে বুঝতে এবং পুনরায় recreate করতে সাহায্য করবে।

---

## 📁 1️⃣ config/db.js – MongoDB Connection

**Purpose:** MongoDB Atlas / Local MongoDB connect করা।

```js
import mongoose from 'mongoose';
import chalk from 'chalk';

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`;
    const conn = await mongoose.connect(MONGODB_URI);

    console.log(`🍃 ${chalk.green.bold('MongoDB')} Connected Successfully!`);
    console.log(`🏷️ Cluster Host: ${chalk.yellow(conn.connection.host)}`);
    console.log(
      `🕒 Connected At: ${chalk.cyan(new Date().toLocaleString())}\n`,
    );

    return conn;
  } catch (error) {
    console.error(
      chalk.red.bold(`❌ MongoDB Connection Failed: ${error.message}`),
    );
    process.exit(1);
  }
};

export default connectDB;
```

> **Order:** প্রথমে DB connect করতে হবে, তারপর server start করতে হবে।

---

## 📁 2️⃣ middleware/errorMiddleware.js – Centralized Error Handler

**Purpose:** সমস্ত uncaught errors / rejected promises handle করা।

```js
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
```

> **Usage:** app.js এ routes এর পরে `app.use(errorHandler)`।

---

## 📁 3️⃣ controllers/auth.controller.js – Auth Logic

**Purpose:** Register/Login users, JWT token generate।

```js
import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = asyncHandler(async (req, res) => {
  /* ... */
});
export const loginUser = asyncHandler(async (req, res) => {
  /* ... */
});
```

> **Note:** asyncHandler ব্যবহার করে Nodemon crash free করা।

---

## 📁 4️⃣ routes/auth.routes.js – Auth Routes

```js
import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
```

> **Order:** এই route app.js এ `/api/auth` path এ use হবে।

---

## 📁 5️⃣ routes/index.routes.js – Home & Health

```js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  /* Project info JSON */
});
router.get('/health', (req, res) => {
  /* Health check JSON */
});

export default router;
```

> **Order:** app.js এ `/` path এ use হবে।

---

## 📁 6️⃣ app.js – Express App Setup

**Purpose:** Middleware, routes, CORS, body-parser, errorHandler।

```js
import express from 'express';
import cors from 'cors';
import indexRouter from './routes/index.routes.js';
import authRouter from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      /* ... */
    },
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);

// Error Handler (last middleware)
app.use(errorHandler);

export default app;
```

> **Order:** Routes -> Error handler -> export app।

---

## 📁 7️⃣ server.js – Server Startup

**Purpose:** MongoDB connect + server listen + console logs।

```js
import dotenv from 'dotenv';
import chalk from 'chalk';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 BabyShop API Server running on ${chalk.yellow(PORT)}`);
    console.log(`🛠️ Admin Panel → ${process.env.ADMIN_URL}`);
    console.log(`🌐 Client App → ${process.env.CLIENT_URL}`);
    console.log(`❤️ Health Check → GET /health`);
    console.log(`🏠 Home Route → GET /`);
    console.log(`📖 API Documentation → http://localhost:${PORT}/api-docs`);
  });
});
```

> **Order:** MongoDB connect first, then server listen।

---

## 📁 8️⃣ models/User.model.js – User Schema

**Purpose:** MongoDB User schema with password hashing and role।

```js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  /* hash password */
});
export default mongoose.model('User', userSchema);
```

---

## 🔹 Workflow / Order of Work

1. Create `.env` → DB credentials, JWT secret, URLs, PORT।
2. Setup `config/db.js` → MongoDB connect।
3. Setup `models/` → User.model.js।
4. Setup `controllers/` → auth.controller.js (asyncHandler)।
5. Setup `routes/` → index.routes.js, auth.routes.js।
6. Setup `middleware/` → errorMiddleware.js।
7. Setup `app.js` → middleware + routes + errorHandler।
8. Setup `server.js` → connectDB().then(app.listen) + console logs।
9. Run `npm run dev` → Nodemon, check logs।
10. Add more features → products, orders, RBAC, JWT middleware।

---

💡 **Tip:**

- সব async controller `asyncHandler` ব্যবহার করবে।
- Error middleware সবশেষে রাখবে।
- MongoDB connect **server start আগে**।
- Nodemon crash-free এবং clean console logs নিশ্চিত।

# 📝 Node.js / Express Authentication Notes (JWT + RBAC)

---

## 1️⃣ Project Structure (Relevant Files)

```
src/
│
├── app.js                  # Base app setup (Express, middleware, routes)
├── server.js               # Server start
│
├── routes/
│   └── auth.routes.js      # Auth routes (register/login)
│
├── controllers/
│   └── auth.controller.js  # Register & Login logic
│
├── models/
│   └── User.model.js       # User schema + pre-save hooks
│
├── utils/
│   └── generateToken.js    # JWT token generation
│
└── middleware/
    └── auth.middleware.js # JWT verification + RBAC
```

---

## 2️⃣ User Model (`User.model.js`)

- **Fields:**

  - name, email, password, avatar, role
  - addresses array (only 1 default)

- **Features:**

  - Password hash (pre-save hook, async)
  - Password compare method
  - Only 1 default address enforced

- **Security:**

  - `password: { select: false }` → never sent in API responses
  - Email lowercase & trim → consistent unique key

### Example Hook:

```js
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

---

## 3️⃣ JWT Token (`generateToken.js`)

- **Purpose:** Generate JWT token for user authentication
- **Payload:** `{ id: userId }`
- **Secret:** `process.env.JWT_SECRET`
- **Expiry:** 7 days (configurable)

```js
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export default generateToken;
```

---

## 4️⃣ Auth Controllers (`auth.controller.js`)

### 4.1 Register Controller

**Steps:**

1. Get `name`, `email`, `password` from `req.body`
2. Check if user exists: `User.findOne({ email })`
3. Create user with default role `user`
4. Return safe response (no password)
5. Log safe info for debugging

```js
const registerController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
    addresses: [],
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    addresses: user.addresses,
  });

  console.log(`✅ User Registered: ${user.email}`);
});
```

### 4.2 Login Controller

**Steps:**

1. Get `email` & `password` from `req.body`
2. Find user with `.select('+password')`
3. Compare password using `user.comparePassword`
4. Generate JWT token
5. Return safe response + token
6. Log safe info

```js
const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    addresses: user.addresses || [],
    token,
  });

  console.log(`✅ User Logged In: ${user.email}`);
});
```

---

## 5️⃣ Auth Routes (`auth.routes.js`)

```js
import express from 'express';
import {
  registerController,
  loginController,
} from '../controllers/auth.controller.js';

const router = express.Router();

// @route POST /api/auth/register
router.post('/register', registerController);

// @route POST /api/auth/login
router.post('/login', loginController);

export default router;
```

---

## 6️⃣ Auth Middleware (`auth.middleware.js`)

**Purpose:** Protect routes using JWT & optionally check roles

```js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export default protect;
```

### Optional: Role Guard

```js
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access only');
  }
};

export { admin };
```

---

## 7️⃣ Notes / Best Practices

1. **Never return password in API responses**
2. **Always hash passwords** using pre-save hook
3. **Force default role** during registration
4. **JWT token** stored client-side, sent in Authorization header `Bearer <token>`
5. **Async pre hooks** → do not use `next()`, Mongoose waits automatically
6. **Logging** → only email/id/role; never log password or token
7. **Default address logic** → ensure only 1 default address

---

This `.md` file can now be used as a clean reference for **Node.js Express JWT Authentication with RBAC, registration & login**.

# BabyShop API Documentation & Swagger Setup 📝

---

## 1️⃣ Swagger Configuration (swaggerConfig.js)

```js
// =============================
// 🚀 Swagger Configuration for BabyShop API
// =============================

import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'BabyShop E-commerce API',
      version: '1.0.0',
      description:
        'A comprehensive e-commerce API for managing products, orders, users, and analytics',
      contact: { name: 'API Support', email: 'support@babyshop.com' },
    },
    // =============================
    // Servers section
    // =============================
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://your-domain.com' // Production server
            : 'http://localhost:8000', // Development server
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    // =============================
    // Components: schemas & security
    // =============================
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            avatar: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            category: { type: 'string' },
            brand: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            featured: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'number' },
                  image: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
            status: {
              type: 'string',
              enum: [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
              ],
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { $ref: '#/components/schemas/Product' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                },
              },
            },
            totalPrice: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Brand: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Banner: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            image: { type: 'string' },
            buttonText: { type: 'string' },
            buttonLink: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Analytics: {
          type: 'object',
          properties: {
            overview: {
              type: 'object',
              properties: {
                totalProducts: { type: 'number' },
                totalOrders: { type: 'number' },
                totalUsers: { type: 'number' },
                totalRevenue: { type: 'number' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            stack: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Swagger comment path
};

const specs = swaggerJSDoc(options);

export { specs }; // named export
export default specs; // default export (optional)
```

> 💡 Comment: এই ফাইলটি তোমার Swagger UI এর জন্য OpenAPI specs generate করবে।

---

## 2️⃣ CORS Setup (app.js)

```js
import cors from 'cors';
import express from 'express';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / curl
      if (process.env.NODE_ENV === 'development') return callback(null, true);
      const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('❌ Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
```

> 💡 Comment: এই CORS setup Swagger UI, Postman, এবং mobile apps থেকে request allow করবে।

---

## 3️⃣ Login Route Swagger Comment (auth.routes.js / auth.controller.js)

```js
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: "Login user 🔑"
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: h@h.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password
 */
```

> 💡 Comment: এখন Swagger UI তে login route visible হবে এবং Try it out কাজ করবে।

---

## 4️⃣ Swagger UI Endpoint (app.js)

```js
import swaggerUi from 'swagger-ui-express';
import { specs } from './swaggerConfig.js';

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BabyShop API Documentation',
  }),
);
```

> 💡 Comment: এই route এ গিয়ে তোমার Swagger UI দেখতে পারবে। `http://localhost:8000/api/docs`

---

## 5️⃣ Important Notes

- **CORS Error Fix:** Postman / curl OK, browser fetch blocked → নিশ্চিত করতে হবে Swagger + server same origin।
- **Servers Section:** Development / Production URL অনুযায়ী set করা।
- **Example Values:** Swagger শুধু placeholder দেখায়, real DB data response তে আসে।
- **JWT Protected routes:** `securitySchemes` + `security` configure করা।
- **Try it out:** Swagger UI থেকে request পাঠিয়ে response দেখতে পারবে।

---

## 6️⃣ Summary

- Swagger হলো **API documentation + interactive testing tool**।
- OpenAPI Specification অনুযায়ী schema, endpoints, responses define করা যায়।
- CORS + JWT + Swagger UI একসাথে ব্যবহার করলে development ও production উভয় environment এ API test করা সহজ হয়।
