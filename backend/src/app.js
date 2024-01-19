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

    // const users = await getUsers();
    // console.log('Users:', users);

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

startServer();

// const express = require('express');
// const app = express()
// const router = express.Router();
// const mongoose = require('mongoose');

// // const port = 3001;
// app.use(express.json());

// const port = process.env.PORT || 3006
// const dbUrl = 'mongodb+srv://nolyuks:0hYGP4JOWCGWqkxO@vote.zwr4n6b.mongodb.net/';

// // Connexion à la base de données MongoDB
// mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connecté à la base de données MongoDB réussi');
//   })
//   .catch((error) => {
//     console.error('Erreur de connexion à la base de données :', error);
//   });

// app.listen(port, () => {
//   console.log(`Serveur démarré (http://localhost:${port}/) !`);
// });

// module.exports = router;
