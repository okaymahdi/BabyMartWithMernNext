// =============================
// 📚 Swagger Configuration for BabyShop API
// =============================

// 🔧 swagger-jsdoc import করা হচ্ছে, যা OpenAPI specs generate করে
import swaggerJSDoc from 'swagger-jsdoc';

// =============================
// ⚙️ Swagger Options
// =============================
const options = {
  definition: {
    // 📝 OpenAPI version
    openapi: '3.0.0',

    // ℹ️ API meta তথ্য
    info: {
      title: 'BabyShop E-commerce API', // 🏷 API এর নাম
      version: '1.0.0', // 🔢 Version
      description:
        'A comprehensive e-commerce API for managing products, orders, users, and analytics', // 📝 API description
      contact: {
        name: 'API Support', // 📧 Support contact
        email: 'support@babyshop.com',
      },
    },

    // 🌐 Servers section: কোন URL থেকে API access করা যাবে
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://your-domain.com' // 🌟 Production server
            : 'http://localhost:8000', // 🛠 Development server
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],

    // =============================
    // 🧩 Components: reusable schemas & security
    // =============================
    components: {
      // 🔐 Security schemes
      securitySchemes: {
        bearerAuth: {
          type: 'http', // HTTP authentication
          scheme: 'bearer', // Bearer token
          bearerFormat: 'JWT', // JWT token format
          description: 'Enter JWT token 🔑', // API consumer guidance
        },
      },

      // 📦 Schemas: API data models
      schemas: {
        // -----------------------------
        // 👤 User schema
        // -----------------------------
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            avatar: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // -----------------------------
        // 🛍 Product schema
        // -----------------------------
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
            images: {
              type: 'array',
              items: { type: 'string' },
              nullable: true,
            },
            featured: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // -----------------------------
        // 🛒 Cart schema
        // -----------------------------
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

        // -----------------------------
        // 🏷 Category schema
        // -----------------------------
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // -----------------------------
        // 🏢 Brand schema
        // -----------------------------
        Brand: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // -----------------------------
        // 🖼 Banner schema
        // -----------------------------
        Banner: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string', nullable: true },
            image: { type: 'string' },
            buttonText: { type: 'string', nullable: true },
            buttonLink: { type: 'string', nullable: true },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // -----------------------------
        // 📦 Order schema (merged)
        // -----------------------------
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            orderItems: {
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
            paymentMethod: {
              type: 'string',
              enum: ['PayPal', 'Stripe', 'CashOnDelivery'],
            },
            paymentResult: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                status: { type: 'string' },
                update_time: { type: 'string' },
                email_address: { type: 'string' },
              },
            },
            itemsPrice: { type: 'number' },
            taxPrice: { type: 'number' },
            shippingPrice: { type: 'number' },
            totalPrice: { type: 'number' },
            isPaid: { type: 'boolean' },
            paidAt: { type: 'string', format: 'date-time', nullable: true },
            isDelivered: { type: 'boolean' },
            deliveredAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
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
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // -----------------------------
        // 📊 Analytics schema
        // -----------------------------
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
            sales: {
              type: 'object',
              properties: {
                bestSellingProducts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      productName: { type: 'string' },
                      totalSold: { type: 'number' },
                      totalRevenue: { type: 'number' },
                    },
                  },
                },
                recentOrders: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Order' },
                },
              },
            },
          },
        },

        // -----------------------------
        // ❌ Error response schema
        // -----------------------------
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            stack: { type: 'string', nullable: true },
          },
        },

        // -----------------------------
        // ✅ Success response schema
        // -----------------------------
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object', nullable: true },
          },
        },
      },
    },

    // =============================
    // 🔐 Global security
    // =============================
    security: [
      {
        bearerAuth: [], // প্রতিটি endpoint JWT token check করবে
      },
    ],
  },

  // =============================
  // 📂 API files containing Swagger comments
  // =============================
  apis: ['./routes/*.js', './controllers/*.js'],
};

// =============================
// 🛠 Generate Swagger specification
// =============================
const specs = swaggerJSDoc(options);

// =============================
// 🚀 Export
// =============================
export { specs }; // named export
