const mongoose = require('mongoose');

const listSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model('List', listSchema);

module.exports = List;