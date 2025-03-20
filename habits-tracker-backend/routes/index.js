var express = require("express");
var router = express.Router();
const Habit = require("../models/Habit");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch {
    res.status(500).json({ message: "Error fetching habits" });
  }
});

router.post("/habits", async (req, res) => {
  try {
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    await habit.save();
    res.json(habit);
  } catch (error) {
    console.log("[DEBUG]error", error);
    res.status(400).json({ message: "Invalid request" });
  }
});

router.delete("/habits/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error de delete: ", error);
    res.status(500).json({ message: "Habit not found" });
  }
});

router.patch("/habits/markasdone/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    habit.lastDone = new Date();
    if (timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24) {
      habit.days += timeDifferenceInDays(habit.lastDone, habit.startedAt)  ;
      habit.lastUpdate = new Date();
      habit.save();
      res.status(200).json({ message: "Habit marked as done" });
    } else {
      habit.days = 1;
      habit.lastUpdate = new Date();
      habit.save();
      res.status(200).json({ message: "Habit restarted" });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "Habit not found" });
  }
});

const timeDifferenceInHours = (date1, date2) => {
  const timeDifferenceMs = Math.abs(date1 - date2);
  return timeDifferenceMs / (1000 * 60 * 60);
};

const timeDifferenceInDays = (date1, date2) => {
  const diifferenceMs = Math.abs(date1 - date2);
  return Math.floor( diifferenceMs / (1000 * 60 * 60 * 24));
  };

module.exports = router;
