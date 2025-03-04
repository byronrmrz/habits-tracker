var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/habits', async (req,res) => {
  try{
    const habits = await Habit.find();
    res.json(habits);
  }catch{
    res.status(500).json({message: 'Error fetching habits'});
  }
});

router.post('/habits',async (req,res) => {
try{
  const {title, description} = req.body;
  const habit = new Habit({title, description});
  await habit.save();
  res.json(habit);
}catch{
  res.status(400).json({message: 'Invalid request'});
}
});

router.delete( '/habits/:id', async (req, res) => {
  try{
    await Habit.findByIdAndRemove(req.params.id);
    res.json({message: 'Habit deleted successfully'});
  }catch{
    res.status(500).json({message: 'Habit not found'});
  }
});

module.exports = router;
