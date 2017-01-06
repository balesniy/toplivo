const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  good:    String,
  sum:     Number,
  user:    {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'User'
  },
  pending: {
    default: true,
    type:    Boolean
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
