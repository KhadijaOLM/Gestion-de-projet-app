const mongoose = require('mongoose');

const attachmentSchema = mongoose.Schema({
  fileName: String,
  filePath: String,
  fileType: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const commentSchema = mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    list: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'List',
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    position: {
      type: Number,
      default: 0,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    attachments: [attachmentSchema],
    codeSnippet: {
      code: String,
      language: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;