import { Schema, Types, model } from "mongoose";

const Note = new Schema({
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

export default model("note", Note);
