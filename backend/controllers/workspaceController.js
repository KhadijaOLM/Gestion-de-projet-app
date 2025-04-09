
//backend/controllers/workspaceController.js
const Workspace = require('../models/Workspace');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new workspace
 * @route   POST /api/workspaces
 * @access  Private
 */
const createWorkspace = async (req, res) => {
  try {
    // Debug: Vérifier l'utilisateur
    console.log('User object:', req.user);
    
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const { name, description } = req.body;
    
    // Validation simple
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    res.status(201).json({
      success: true,
      data: {
        id: workspace._id,
        name: workspace.name,
        owner: workspace.owner
      }
    });
  } catch (error) {
    console.error('Erreur création workspace:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * @desc    Get all workspaces for a user
 * @route   GET /api/workspaces
 * @access  Private
 */
const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    'members.user': req.user._id,
  }).populate('owner', 'name email');
  
  res.json({success: true, data:{workspaces}});
});

/**
 * @desc    Get workspace by ID
 * @route   GET /api/workspaces/:id
 * @access  Private
 */
const getWorkspaceById = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members.user', 'name email');

  if (workspace) {
    // Check if user is a member of this workspace
    const isMember = workspace.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (isMember) {
      res.json({success: true, data:{workspace}});
    } else {
      res.status(403);
      throw new Error('Non autorisé: vous n\'êtes pas membre de ce workspace');
    }
  } else {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }
});

/**
 * @desc    Update workspace
 * @route   PUT /api/workspaces/:id
 * @access  Private
 */
const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (workspace) {
    // Check if user is admin in this workspace
    const memberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!memberInfo || memberInfo.role !== 'admin') {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    workspace.name = req.body.name || workspace.name;
    workspace.description = req.body.description || workspace.description;

    const updatedWorkspace = await workspace.save();
    res.json({success: true, data:{updatedWorkspace}});
  } else {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }
});

/**
 * @desc    Add member to workspace
 * @route   POST /api/workspaces/:id/members
 * @access  Private
 */
const addWorkspaceMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const workspace = await Workspace.findById(req.params.id);

  if (workspace) {
    // Check if user is admin in this workspace
    const isAdmin = workspace.members.some(
      (member) => 
        member.user.toString() === req.user._id.toString() && 
        member.role === 'admin'
    );

    if (!isAdmin) {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    // Check if user is already a member
    const alreadyMember = workspace.members.some(
      (member) => member.user.toString() === userId
    );

    if (alreadyMember) {
      res.status(400);
      throw new Error('L\'utilisateur est déjà membre de ce workspace');
    }

    workspace.members.push({ user: userId, role: role || 'member' });
    
    const updatedWorkspace = await workspace.save();
    res.json({success: true, data:{updatedWorkspace}});
  } else {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }
});

/**
 * @desc    Remove member from workspace
 * @route   DELETE /api/workspaces/:id/members/:userId
 * @access  Private
 */
const removeWorkspaceMember = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (workspace) {
    // Check if user is admin in this workspace
    const isAdmin = workspace.members.some(
      (member) => 
        member.user.toString() === req.user._id.toString() && 
        member.role === 'admin'
    );

    if (!isAdmin) {
      res.status(403);
      throw new Error('Non autorisé: nécessite les droits d\'administrateur');
    }

    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== req.params.userId
    );
    
    const updatedWorkspace = await workspace.save();
    res.json({success: true, data:{updatedWorkspace}});
  } else {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }
});

/**
 * @desc    Delete workspace
 * @route   DELETE /api/workspaces/:id
 * @access  Private
 */
const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);

  if (workspace) {
    // Check if user is the owner
    if (workspace.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Non autorisé: seul le propriétaire peut supprimer le workspace');
    }

    await workspace.remove();
    res.json({ message: 'Workspace supprimé' });
  } else {
    res.status(404);
    throw new Error('Workspace non trouvé');
  }
});

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  deleteWorkspace,
};
