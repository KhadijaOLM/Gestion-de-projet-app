
//backend/models/Board.js
const mongoose = require('mongoose');

const boardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Workspace',
    },
    background: {
      type: String,
      default: '#0079bf',
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
