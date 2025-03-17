// schemas/ProgressLog.ts
import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  weight: {
    type: Number,
    min: 0,
    required: true
  },
  strengthProgress: [{
    exercise: {
      type: String,
      required: true
    },
    maxWeight: {
      type: Number,
      min: 0,
      required: true
    },
    reps: {
      type: Number,
      min: 0
    }
  }],
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

const ProgressLog = mongoose.models?.ProgressLog || mongoose.model("ProgressLog", progressLogSchema);
export default ProgressLog;