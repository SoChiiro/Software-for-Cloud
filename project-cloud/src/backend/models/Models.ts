import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
  user: { 
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Models = model('Note', noteSchema);

export default Models;