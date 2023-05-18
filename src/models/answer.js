import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const answerSchema = new Schema({
  answer: { type: String, required: true },
  description: { type: String },
});

export const Answer = mongoose.model("Answer", answerSchema);
