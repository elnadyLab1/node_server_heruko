const express = require("express");
const router = express.Router();
const UserModel = require("../models/user_model");

// Create New User
router.post("/createUser", async (req, res) => {
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });
  try {
    const newUser = await user.save();
    // res.status(201).json(newUser);
    res.json(newUser);
  } catch (error) {
    res.json({ mssssg: error });
  }
});

// getting all users
router.get("/getUsers", async (req, res) => {
  try {
    let users = await UserModel.find();
    res.json(users);
  } catch (e) {
    res.json({ msg: e });
  }
});

//updating user
router.patch("/updateUser/:id", async (req, res) => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: req.params.id }, //filter conditions
      { $set: { name: req.body.name } }, //update value of specific field
      { new: true } //to get new updated document back in the result
    );
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
});

//Delete user
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const result = await UserModel.findOneAndDelete(
      { _id: req.params.id }, //filter conditions
    );
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
});

module.exports = router;
