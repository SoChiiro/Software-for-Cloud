const express = require('express');
const { dbConnect, pool } = require('./db');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function getUsers() {
  try {
    console.log('Getting users...');
    const [tableExists] = await pool.query("SHOW TABLES LIKE 'Utilisateur'");
    console.log('tableExists:', tableExists);
    
    if (tableExists.length > 0) {
      const [rows] = await pool.query("SELECT * FROM Utilisateur");
      return rows;
    } else {
      throw new Error("Table Utilisateur does not exist");
    }
  } catch (error) {
    throw new Error("Error retrieving users");
  }
}

async function startServer() {
  try {
    await dbConnect();
    console.log(".... Server Connected to the database !");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

startServer();
