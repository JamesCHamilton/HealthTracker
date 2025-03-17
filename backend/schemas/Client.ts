import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: true
  },
  targetGoals: {
    calories: Number,
    macros: {
      protein: Number,
      carbs: Number,
      fats: Number
    }
  },
  workoutSchedule: [{
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      weight: Number
    }]
  }],
  logs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientProgress"
    }
  ]
});

const Client = mongoose.models?.Client || mongoose.model("Client", clientSchema);
export default Client;