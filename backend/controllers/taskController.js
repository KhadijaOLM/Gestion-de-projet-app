//backend/controllers/taskController.js
const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const List = require('../models/List');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, listId } = req.body;

  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error('List not found');
  }

  // Find position (end of list by default)
  const tasksInList = await Task.find({ list: listId }).sort({ position: -1 });
  const position = tasksInList.length > 0 ? tasksInList[0].position + 1 : 0;

  const task = await Task.create({
    title,
    description,
    list: listId,
    position,
  });

  res.status(201).json(task);
});

// @desc    Get all tasks for a list
// @route   GET /api/tasks/list/:listId
// @access  Private
const getTasksByList = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ list: req.params.listId })
    .sort({ position: 1 })
    .populate('assignedTo', 'name email');
  res.json(tasks);
});

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('comments.user', 'name email');

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, status, assignedTo, listId } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;
    
    if (listId && listId !== task.list.toString()) {
      const list = await List.findById(listId);
      if (!list) {
        res.status(404);
        throw new Error('List not found');
      }
      task.list = listId;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.remove();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    const comment = {
      text,
      user: req.user._id,
    };

    task.comments.push(comment);
    await task.save();
    res.status(201).json({ message: 'Comment added' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});
// In ../controllers/taskController.js
const addAttachment = async (req, res) => {
  try {
    // req.file will contain the uploaded file
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          attachments: {
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
          }
        }
      },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createTask,
  getTasksByList,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  addAttachment 
};