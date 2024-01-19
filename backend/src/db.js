const dotenv = require('dotenv');
dotenv.config();

const { createPool } = require('mysql2/promise');

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

async function dbConnect() {
  try {
    await pool.getConnection();
    console.log("Database connected to the server....");
  } catch (err) {
    console.log("Error connecting to database", err);
  }
}

module.exports = { pool, dbConnect };
