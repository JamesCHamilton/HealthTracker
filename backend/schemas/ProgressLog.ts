import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  weight: Number,
  strengthProgress: [{
    exercise: String,
    maxWeight: Number
  }]
});

const ProgressLog = mongoose.models?.progressLog || mongoose.model("ProgressLog", progressLogSchema);
export default ProgressLog;