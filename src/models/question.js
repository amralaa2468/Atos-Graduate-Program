import mongoose from "mongoose";

import { answerSchema } from "./answer.js";

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    question: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    mark: { type: Number, required: true },
    expectedTime: { type: Number, required: true },
    correctAnswers: [
      { type: mongoose.Types.ObjectId, required: true, ref: "Answer" },
    ],
    createdBy: {
      type: String,
      required: true,
    },
    answers: [{ type: mongoose.Types.ObjectId, required: true, ref: "Answer" }],
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
