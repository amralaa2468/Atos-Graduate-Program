import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const notificationSchema = new Schema({
  message: { type: Object, required: true },
});

export const Notification = mongoose.model("Notification", notificationSchema);
