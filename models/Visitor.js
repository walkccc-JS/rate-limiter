const mongoose = require('mongoose');
const { Schema } = mongoose;
const config = require('../config');

const visitorSchema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: config.ttl
  },
  ip: {
    type: String,
    required: true,
    trim: true
    // match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  },
  hits: {
    type: Number,
    default: 1,
    required: true,
    max: config.max, // 1000
    min: 0
  }
});

visitorSchema.index({ createdAt: 1 }, { expireAfterSeconds: config.ttl });
mongoose.model('visitors', visitorSchema);
