import chalk from 'chalk';
import mongoose from 'mongoose';

// ----------------------------------------------------
// Mongoose Configuration
// ----------------------------------------------------

// strictQuery true → schema-তে না থাকা field এ warning দেখাবে না
mongoose.set('strictQuery', true);

// ----------------------------------------------------
// Database Connection Function
// ----------------------------------------------------

const connectDB = async () => {
  try {
    const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_NAME}.5iblwc5.mongodb.net/${process.env.MONGO_DATABASE_NAME}?retryWrites=true&w=majority`;

    // 🔗 Connect to MongoDB & return conn
    const conn = await mongoose.connect(MONGODB_URI);

    // ✅ Successful Connection Logs
    console.log(`\n🍃 ${chalk.green.bold('MongoDB')} Connected Successfully!`);
    console.log(`🏷️ Cluster Host: ${chalk.yellow(conn.connection.host)}`);
    console.log(
      `🕒 Connected At: ${chalk.cyan(new Date().toLocaleString())}\n`,
    );

    return conn; // Important to return conn if needed in server.js
  } catch (error) {
    // ❌ Connection Failed Logs
    console.error(
      chalk.red.bold(`❌ MongoDB Connection Failed: ${error.message || error}`),
    );
    process.exit(1); // Stop server if DB fails
  }
};

// ----------------------------------------------------
// Export Database Connection
// ----------------------------------------------------

export default connectDB;
