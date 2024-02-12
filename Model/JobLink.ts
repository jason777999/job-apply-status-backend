import { Schema, Types, model } from "mongoose";

const JobLink = new Schema({
  link: {
    type: String,
    required: true,
  },
  linker: [Object],
  date: {
    type: Date,
    default: Date.now(),
  },
});

export default model("job-link", JobLink);
