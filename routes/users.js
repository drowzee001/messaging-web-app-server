const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

require("dotenv").config();

const User = require("../models/User");

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) throw Error("User does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 3600,
    });
    if (!token) throw Error("Couldn't sign the token");

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw Error("Please enter all fields");
    const user = await User.findOne({ email });
    if (user) throw Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
      expiresIn: 3600,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.receiver_email }).select("id name");
    if (!user) throw Error("User does not exist");
    res.json({ user: user });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "id name email"
    );
    if (!user) throw Error("User does not exist");
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: e.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("id name email");
    if (!user) throw Error("User does not exist");
    res.json({ user: user });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
