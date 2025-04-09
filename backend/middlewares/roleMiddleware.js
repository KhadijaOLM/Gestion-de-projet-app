/**
 * Middleware to check if user is admin
 */
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401);
      throw new Error('Non autorisé en tant qu\'administrateur');
    }
  };
  
  /**
   * Middleware to check workspace roles
   */
  const workspaceRole = (role) => async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId || req.params.id;
      const workspace = await require('../models/workspaceModel').findById(workspaceId);
      
      if (!workspace) {
        res.status(404);
        throw new Error('Workspace non trouvé');
      }
  
      const memberInfo = workspace.members.find(
        (member) => member.user.toString() === req.user._id.toString()
      );
  
      if (!memberInfo) {
        res.status(403);
        throw new Error('Non autorisé: vous n\'êtes pas membre de ce workspace');
      }
  
      if (role && memberInfo.role !== role) {
        res.status(403);
        throw new Error(`Non autorisé: nécessite le rôle '${role}'`);
      }
  
      next();
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Middleware to check board roles
   */
  const boardRole = (role) => async (req, res, next) => {
    try {
      const boardId = req.params.boardId || req.params.id;
      const board = await require('../models/boardModel').findById(boardId);
      
      if (!board) {
        res.status(404);
        throw new Error('Board non trouvé');
      }
  
      const memberInfo = board.members.find(
        (member) => member.user.toString() === req.user._id.toString()
      );
  
      if (!memberInfo) {
        res.status(403);
        throw new Error('Non autorisé: vous n\'êtes pas membre de ce board');
      }
  
      if (role && memberInfo.role !== role) {
        res.status(403);
        throw new Error(`Non autorisé: nécessite le rôle '${role}'`);
      }
  
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = { admin, workspaceRole, boardRole };