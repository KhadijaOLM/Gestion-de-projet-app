
//backend/routes/workspaceRoutes.js
const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  addWorkspaceMember,
  removeWorkspaceMember,
  deleteWorkspace
} = require('../controllers/workspaceController');
const { protect } = require('../middlewares/authMiddleware');
const { workspaceRole } = require('../middlewares/roleMiddleware');

// Route pour créer un nouveau workspace
router.post('/', protect, createWorkspace);

// Route pour obtenir tous les workspaces de l'utilisateur
router.get('/', protect, getWorkspaces);

// Route pour obtenir un workspace spécifique par son ID
router.get('/:id', protect, getWorkspaceById);

// Route pour mettre à jour un workspace existant
// Nécessite le middleware workspaceRole pour vérifier les permissions
router.put('/:id', protect, workspaceRole(['admin', 'owner']), updateWorkspace);

// Route pour ajouter un membre à un workspace
router.post('/:id/members', protect, workspaceRole(['admin', 'owner']), addWorkspaceMember);

// Route pour supprimer un membre d'un workspace
router.delete('/:id/members/:userId', protect, workspaceRole(['admin', 'owner']), removeWorkspaceMember);

// Route pour supprimer un workspace
// Généralement réservé au propriétaire du workspace
router.delete('/:id', protect, workspaceRole(['owner']), deleteWorkspace);

module.exports = router;
