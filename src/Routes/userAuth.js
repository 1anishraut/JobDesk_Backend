const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const {
  validateSignupData,
  validatePasswordOnly,
} = require("../utils/Validation");
const User = require("../Model/user");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../Middleware/auth");

// Signup API
authRouter.post("/signUp", async (req, res) => {
  try {
    // Validation of the data
    validateSignupData(req);

    // Encrypy the Password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrpt.hash(password, 10);
    // console.log(passwordHash);

    // Creating new intance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    // Create JWT Token for auto login after signup
    const token = await user.getJWT();

    // Add token to cookie and send back to user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added Succefully", data: savedUser });
  } catch (error) {
    res;
    res.status(400).json(error.message);
    // res.status(400).send("ERROR in signup: Enter valid details" );
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // Create JWT Token
      const token = await user.getJWT();

      // Add token to cookie and send back to user
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// LogOut API
authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("Logout Successful");
  } catch (error) {
    res.status(400).send("ERROR in logout: " + error.message);
  }
});

// Forgot password API
authRouter.post("/forgotPassword", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Both email and new password are required");
    }

    // ✅ Reuse your custom validator
    validatePasswordOnly(password);

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User with this email does not exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.send("Password has been reset successfully");
  } catch (error) {
    res.status(400).send("ERROR in forgot password: " + error.message);
  }
});
                                                                            // update my profile 


authRouter.patch("/updateProfile/:id", userAuth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



                                                                                    // DELETE
authRouter.delete("/deleteProfile/:id", userAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({  message: "Deletion failed", error });
  }
});
module.exports = authRouter;
