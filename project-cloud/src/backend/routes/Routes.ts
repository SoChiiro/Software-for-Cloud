import { Router } from 'express';
import { 
  getNotes,
  createNote, 
} from '../controllers/Controllers';

const router = Router();

router.get('/', getNotes); 

router.post('/', createNote);

// router.get('/:id', getNote);

// router.put('/:id', updateNote);

// router.delete('/:id', deleteNote);

export default router;