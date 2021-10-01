const mongoose = require("npm-atom/db");

const reminderSchema = mongoose.Schema({
  newtitle: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ["low", "high"],
    default: "low",
  },
  daysgap: {
    type: Number,
  },
  customdays: [
    {
      type: String,
    },
  ],
  timegap: {
    hours: {
      type: Number,
    },
    minutes: {
      type: Number,
    },
  },
  customtime: [
    {
      hours: {
        type: Number,
      },
      minutes: {
        type: Number,
      },
    },
  ],
  nextreqdate: {
    type: String,
  },
  nextreqtime: {
    hours: {
      type: Number,
    },
    minutes: {
      type: Number,
    },
  },
  remtype: {
    type: String,
    enum: ["item", "reminderonly"],
    default: "reminderonly",
  },
  isDisplayed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Reminder = new mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
