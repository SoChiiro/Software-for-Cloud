import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/Routes.ts';

// import notesRoutes from './routes/Routes.ts';

dotenv.config();

const app = express();

// Connexion à la DB
const dbUrl = 'mongodb+srv://thomasnicolas:Rkb4IMXhD9E7dn8v@software-for-cloud.hrod9b5.mongodb.net/';

// Connexion à la base de données MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à la base de données MongoDB réussi');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données :', error);
  });

// Middlewares
app.use(express.json());

// Routes
// app.use('/api/notes', notesRoutes);

// Serveur
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`); 
});

app.use(router)