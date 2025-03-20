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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  verificationToken: String,

  verificationExpires: Date,
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