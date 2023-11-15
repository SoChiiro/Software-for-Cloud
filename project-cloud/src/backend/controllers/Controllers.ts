import Note from '../models/Models';
import { Request, Response, } from 'express';

export async function getNotes(req: Request, res: Response) {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'error' });
  }
}

export async function createNote(req: Request, res: Response) {
  console.log('req', req)
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: 'error' });  
  }
}

export async function getNote(req: Request, res: Response) {
  // Récupérer une note par son id
}

export async function updateNote(req: Request, res: Response) {
  // Mettre à jour une note par son id  
}

export async function deleteNote(req: Request, res: Response) {
  // Supprimer une note par son id
}