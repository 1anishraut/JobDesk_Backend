const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    taskDueDate: {
      type: Date,
      required: true,
    },
    companyName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    taskDescription: {
      type: String,
      trim: true,
      maxLength: 300,
    },
    taskPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    taskAdvencePaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    taskAmoutLeft: {
      type: Number,
      min: 0,
    },
    contact: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("Enter a valid contact number");
        }
      },
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email address");
        }
      },
    },
    taskStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Automatically calculate amount left before saving
taskSchema.pre("save", function (next) {
  this.taskAmoutLeft = this.taskPrice - this.taskAdvencePaid;
  next();
});

module.exports = mongoose.model("Task", taskSchema);
