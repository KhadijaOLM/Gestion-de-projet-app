//backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
  createTask, 
  getTasksByList, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  addComment,
  addAttachment 
} = require('../controllers/taskController');
const upload = require('../middlewares/uploadMiddleware');

router.route('/').post(protect, createTask);
router.route('/list/:listId').get(protect, getTasksByList);
router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.route('/:id/comments').post(protect, addComment);
router.route('/:id/attachments').post(protect, upload.single('file'), addAttachment);

module.exports = router;