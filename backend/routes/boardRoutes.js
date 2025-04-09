//backend/routes/boardRoutes.js
const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const { protect } = require('../middlewares/authMiddleware');
const {
  createBoard,
  getBoards
} = require('../controllers/boardController');

// @route   GET /api/boards
// @desc    Get all boards for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/boards/:id
// @desc    Get board by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('lists');
    
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Make sure user owns the board
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(board);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/boards
// @desc    Create a board
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, background } = req.body;

    const newBoard = new Board({
      title,
      background,
      user: req.user.id
    });

    const board = await newBoard.save();
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/boards/:id
// @desc    Update a board
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Make sure user owns the board
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    board = await Board.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(board);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/boards/:id
// @desc    Delete a board
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Make sure user owns the board
    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await board.remove();
    res.json({ msg: 'Board removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Board not found' });
    }
    res.status(500).send('Server Error');
  }
});
module.exports = router;
