import chalk from 'chalk';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import app from './app.js';

// 📦 Load Env
dotenv.config();

// 🗄 Connect MongoDB
connectDB()
  .then((conn) => {
    // 🔌 Start Server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(
        `🚀 ${chalk.green.bold(
          'BabyShop API Server',
        )} running on ${chalk.yellow(PORT)}`,
      );
      console.log(
        `🛠️ Admin Panel → ${process.env.ADMIN_URL || 'http://localhost:5173'}`,
      );
      console.log(
        `🌐 Client App → ${process.env.CLIENT_URL || 'http://localhost:3000'}`,
      );
      console.log(`❤️ Health Check → GET /health`);
      console.log(`🏠 Home Route → GET /`);
      console.log(`📖 API Documentation → http://localhost:${PORT}/api-docs`);
      console.log(`⚡ Environment → ${process.env.NODE_ENV || 'development'}`);
      console.log('\n🛠️ Ready to start building your e-commerce API!');
    });
  })
  .catch((err) => {
    console.error(
      chalk.red.bold(`❌ MongoDB Connection Failed: ${err.message}`),
    );
    process.exit(1);
  });
