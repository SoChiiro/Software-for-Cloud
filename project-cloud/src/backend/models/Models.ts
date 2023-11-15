import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
});

const Models = model('Note', noteSchema);

export default Models;