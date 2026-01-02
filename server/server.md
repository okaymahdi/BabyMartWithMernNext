# Server যেভাবে কাজ করে

```txt
Client (Postman / Frontend)
   ↓
server.js
   ↓
routes/index.js
   ↓
routes/authRoutes.js
   ↓
controllers/authControllers.js
   ↓
Response back to Client

```

# index.js Configuration

```js
import dotenv from 'dotenv';
import express from 'express';

// Load env Server
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database

// CORS Configuration

// Increase Body Size Limit for JSON and URL-Encoded Payload
app.use(express.json());

// Routes

// API Documentation

// Home Route
app.get('/', (req, res) => {
  res.send('Hello From Baby Mart Full Stack !');
});

// Error Handler

// Start Server Setup
app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
  console.log(`Admin is Running on ${process.env.ADMIN_URL}`);
  console.log(`Client is Running on ${process.env.CLIENT_URL}`);
});
```

#
