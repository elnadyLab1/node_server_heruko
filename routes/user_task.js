const express = require("express");
const router = express.Router();
const UserTask = require("../models/user_task_model");
router.post("/createUserTask", async (req, res) => {
  const userTask = new UserTask({
    taskTitle: req.body.taskTitle,
    taskDescription: req.body.taskDescription,
  });
  try {
    const newUserTask = await userTask.save();
    // res.status(201).json(newUserTask);
    res.json(newUserTask);
  } catch (error) {
    res.json({ mssssg: error });
  }
});

//getting all userTasks
router.get("/getUserTask", async (req, res) => {
  try {
    let userTask = await UserTask.find();
    res.json(userTask);
  } catch (e) {
    res.json({ msg: e });
  }
});

//updating userTask based on task id
router.patch("/updateTask/:id", async (req, res) => {
  try {
    const result = await UserTask.findOneAndUpdate(
      { _id: req.params.id }, //filter conditions
      { $set: { taskTitle: req.body.taskTitle } }, //update value of specific field
      { new: true } //to get new updated document back in the result
    );
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
});

module.exports = router;
