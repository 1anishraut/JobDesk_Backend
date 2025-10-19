const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrpt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
      // required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter valid email Id: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      default:"male",
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not valid gender type`,
      },
    },
    profession: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
userSchema.index({ firstName: 1, lastName: 1 });

// JWT method
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

// Password validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  return await bcrpt.compare(passwordInputByUser, passwordHash);
};

module.exports = mongoose.model("User", userSchema);
