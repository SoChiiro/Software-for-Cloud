import { Router } from 'express';
import { 
  getNotes,
  createNote, 
} from '../controllers/Controllers';

const router = Router();

router.get('/note', getNotes); 

router.post('/note', createNote);

// router.get('/:id', getNote);

// router.put('/:id', updateNote);

// router.delete('/:id', deleteNote);

module.exports = router