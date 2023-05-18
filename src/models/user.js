import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    required: true,
    enum: ["student", "teacher", "admin", "superadmin"],
  },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
