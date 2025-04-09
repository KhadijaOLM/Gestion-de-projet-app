//backend/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const List = require('../models/List');
const Board = require('../models/Board');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/lists/board/:boardId
// @desc    Get all lists for a board
// @access  Private
router.get('/board/:boardId', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Make sure user owns the board
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const lists = await List.find({ board: req.params.boardId }).sort({ position: 1 }).populate('cards');
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/lists
// @desc    Create a list
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, boardId, position } = req.body;

    // Check if board exists and user owns it
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const newList = new List({
      title,
      board: boardId,
      position
    });

    const list = await newList.save();
    
    // Update board with the new list
    board.lists.push(list._id);
    await board.save();
    
    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/lists/:id
// @desc    Update a list
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    // Check if user owns the board
    const board = await Board.findById(list.board);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    list = await List.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(list);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'List not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/lists/:id
// @desc    Delete a list
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ msg: 'List not found' });
    }

    // Check if user owns the board
    const board = await Board.findById(list.board);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Remove list from board
    board.lists = board.lists.filter(listId => listId.toString() !== req.params.id);
    await board.save();

    await list.remove();
    res.json({ msg: 'List removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'List not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/lists/reorder
// @desc    Reorder lists
// @access  Private
router.put('/reorder', protect, async (req, res) => {
  try {
    const { lists, boardId } = req.body;
    
    // Check if board exists and user owns it
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update position for each list
    for (const item of lists) {
      await List.findByIdAndUpdate(item.id, { position: item.position });
    }

    const updatedLists = await List.find({ board: boardId }).sort({ position: 1 });
    res.json(updatedLists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;