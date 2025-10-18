const express = require("express");
const Task = require("../Model/taskSchema");
const { userAuth } = require("../Middleware/auth");

const taskRouter = express.Router();

                                                                                                    // CREATE a new task
taskRouter.post("/task", userAuth, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(200).json({ message: "Task created successfully", task });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating task", error: error.message });
  }
});

                                                                                      // EDIT  task
taskRouter.patch("/task/:id", userAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task", error: error.message });
  }
});

                                                                                          // DELETE task
taskRouter.delete("/task/:id", userAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting task", error: error.message });
  }
});

                                                                                          //  CHANGE task status 
taskRouter.patch("/task/:id/status", userAuth, async (req, res) => {
  try {
    const { taskStatus } = req.body;

    if (!["Pending", "Completed"].includes(taskStatus)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { taskStatus },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task status updated successfully", task });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating status", error: error.message });
  }
});

taskRouter.get("/tasks", userAuth, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error fetching tasks", error: err.message });
  }
});

// GET a task by ID
taskRouter.get("/task/:id", userAuth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(400).json({ message: "Error fetching task", error: error.message });
  }
});

module.exports = taskRouter;
