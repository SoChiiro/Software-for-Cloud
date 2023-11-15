import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// import notesRoutes from './routes/Routes.ts';

dotenv.config();

const app = express();

// Connexion à la DB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error(err));

// Middlewares
app.use(express.json());

// Routes
// app.use('/api/notes', notesRoutes);

// Serveur
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`); 
});