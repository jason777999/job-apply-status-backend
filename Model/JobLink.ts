import { Schema, Types, model } from "mongoose";

const JobLink = new Schema({
  link: {
    type: String,
    required: true,
  },
  linker: [Object],
  applied: Boolean,
  date: {
    type: Date,
    default: Date.now(),
  },
});

JobLink.index({ "$**": "text" });
export default model("job-link", JobLink);
