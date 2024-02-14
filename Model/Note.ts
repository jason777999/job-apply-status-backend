import { Schema, Types, model } from "mongoose";

const NoteSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  writer: Object,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Note = model('note', NoteSchema);

export default Note;