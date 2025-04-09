
//backend/controllers/boardController.js
const Board = require('../models/Board');
const Workspace = require('../models/Workspace');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new board
 * @route   POST /api/workspaces/:workspaceId/boards
 * @access  Private
 */
const createBoard = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description, backgroundColor } = req.body;

  // Check if user has access to the workspace
  const workspace = await Workspace.findById(workspaceId);
  
  if (!workspace) {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(403);
    throw new Error('Non autorisé: vous n\'êtes pas membre de ce workspace');
  }

  const board = await Board.create({
    name,
    description,
    backgroundColor: backgroundColor || '#FFFFFF',
    workspace: workspaceId,
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: 'admin' }],
  });

  if (board) {
    res.status(201).json(board);
  } else {
    res.status(400);
    throw new Error('Données de board invalides');
  }
});

/**
 * @desc    Get all boards in a workspace
 * @route   GET /api/workspaces/:workspaceId/boards
 * @access  Private
 */
const getBoards = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  
  // Check if user has access to the workspace
  const workspace = await Workspace.findById(workspaceId);
  
  if (!workspace) {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }

  const isMember = workspace.members.some(
    (member) => member.user.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(403);
    throw new Error('Non autorisé: vous n\'êtes pas membre de ce workspace');
  }

  const boards = await Board.find({ workspace: workspaceId })
    .populate('createdBy', 'name email');
  
  res.json(boards);
});

/**
 * @desc    Get board by ID
 * @route   GET /api/boards/:id
 * @access  Private
 */
const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('members.user', 'name email')
    .populate({
      path: 'lists',
      populate: {
        path: 'cards',
        model: 'Card',
      },
    });

  if (board) {
    // Check if user is a member of this board
    const isMember = board.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (isMember) {
      res.json(board);
    } else {
      res.status(403);
      throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
    }
  } else {
    res.status(404);
    throw new Error('Board non trouvé');
  }
});

/**
 * @desc    Update board
 * @route   PUT /api/boards/:id
 * @access  Private
 */
const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (board) {
    // Check if user is admin in this board
    const memberInfo = board.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!memberInfo || memberInfo.role !== 'admin') {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    board.name = req.body.name || board.name;
    board.description = req.body.description || board.description;
    board.backgroundColor = req.body.backgroundColor || board.backgroundColor;

    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } else {
    res.status(404);
    throw new Error('Board non trouvé');
  }
});

/**
 * @desc    Add member to board
 * @route   POST /api/boards/:id/members
 * @access  Private
 */
const addBoardMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const board = await Board.findById(req.params.id);

  if (board) {
    // Check if user is admin in this board
    const isAdmin = board.members.some(
      (member) => 
        member.user.toString() === req.user._id.toString() && 
        member.role === 'admin'
    );

    if (!isAdmin) {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    // Check if the user to add is a member of the workspace
    const workspace = await Workspace.findById(board.workspace);
    
    const isWorkspaceMember = workspace.members.some(
      (member) => member.user.toString() === userId
    );

    if (!isWorkspaceMember) {
      res.status(400);
      throw new Error('L\'utilisateur doit d\'abord être membre du workspace');
    }

    // Check if user is already a member
    const alreadyMember = board.members.some(
      (member) => member.user.toString() === userId
    );

    if (alreadyMember) {
      res.status(400);
      throw new Error('L\'utilisateur est déjà membre de ce board');
    }

    board.members.push({ user: userId, role: role || 'member' });
    
    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } else {
    res.status(404);
    throw new Error('Board non trouvé');
  }
});

/**
 * @desc    Remove member from board
 * @route   DELETE /api/boards/:id/members/:userId
 * @access  Private
 */
const removeBoardMember = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (board) {
    // Check if user is admin in this board
    const isAdmin = board.members.some(
      (member) => 
        member.user.toString() === req.user._id.toString() && 
        member.role === 'admin'
    );

    if (!isAdmin) {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    board.members = board.members.filter(
      (member) => member.user.toString() !== req.params.userId
    );
    
    const updatedBoard = await board.save();
    res.json(updatedBoard);
  } else {
    res.status(404);
    throw new Error('Board non trouvé');
  }
});

/**
 * @desc    Delete board
 * @route   DELETE /api/boards/:id
 * @access  Private
 */
const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (board) {
    // Check if user is admin in this board
    const isAdmin = board.members.some(
      (member) => 
        member.user.toString() === req.user._id.toString() && 
        member.role === 'admin'
    );

    if (!isAdmin) {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    await board.remove();
    res.json({ message: 'Board supprimé' });
  } else {
    res.status(404);
    throw new Error('Board non trouvé');
  }
});

module.exports = {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  addBoardMember,
  removeBoardMember,
  deleteBoard,
};
