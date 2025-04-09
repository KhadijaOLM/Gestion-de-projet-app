//backend/controllers/listController.js
const List = require('../models/List');
const Board = require('../models/Board');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new list
 * @route   POST /api/boards/:boardId/lists
 * @access  Private
 */
const createList = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { name, position } = req.body;

  // Check if user has access to the board
  const board = await Board.findById(boardId);
  
  if (!board) {
    res.status(404);
    throw new Error('Board non trouvé');
  }

  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(403);
    throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
  }

  const list = await List.create({
    name,
    position: position || 0,
    board: boardId,
    createdBy: req.user._id,
  });

  if (list) {
    // Update board with the new list
    board.lists.push(list._id);
    await board.save();
    
    res.status(201).json(list);
  } else {
    res.status(400);
    throw new Error('Données de liste invalides');
  }
});

/**
 * @desc    Get all lists in a board
 * @route   GET /api/boards/:boardId/lists
 * @access  Private
 */
const getLists = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  
  // Check if user has access to the board
  const board = await Board.findById(boardId);
  
  if (!board) {
    res.status(404);
    throw new Error('Board non trouvé');
  }

  const isMember = board.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(403);
    throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
  }

  const lists = await List.find({ board: boardId })
    .populate('createdBy', 'name email')
    .populate('cards');
  
  res.json(lists);
});

/**
 * @desc    Get list by ID
 * @route   GET /api/lists/:id
 * @access  Private
 */
const getListById = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('cards');

  if (list) {
    // Check if user is a member of the board that contains this list
    const board = await Board.findById(list.board);
    
    const isMember = board.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      res.json(list);
    } else {
      res.status(403);
      throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
    }
  } else {
    res.status(404);
    throw new Error('Liste non trouvée');
  }
});

/**
 * @desc    Update list
 * @route   PUT /api/lists/:id
 * @access  Private
 */
const updateList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);

  if (list) {
    // Check if user is a member of the board that contains this list
    const board = await Board.findById(list.board);
    
    const isMember = board.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      res.status(403);
      throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
    }

    list.name = req.body.name || list.name;
    
    if (req.body.position !== undefined) {
      list.position = req.body.position;
    }

    const updatedList = await list.save();
    res.json(updatedList);
  } else {
    res.status(404);
    throw new Error('Liste non trouvée');
  }
});

/**
 * @desc    Delete list
 * @route   DELETE /api/lists/:id
 * @access  Private
 */
const deleteList = asyncHandler(async (req, res) => {
  const list = await List.findById(req.params.id);

  if (list) {
    // Check if user is a member of the board that contains this list
    const board = await Board.findById(list.board);
    
    const memberInfo = board.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!memberInfo) {
      res.status(403);
      throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
    }

    // Remove the list reference from the board
    board.lists = board.lists.filter(
      (listId) => listId.toString() !== list._id.toString()
    );
    await board.save();

    await list.remove();
    res.json({ message: 'Liste supprimée' });
  } else {
    res.status(404);
    throw new Error('Liste non trouvée');
  }
});

module.exports = {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList,
};