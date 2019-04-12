const mongoose = require('mongoose');
const Visitor = mongoose.model('visitors');
const rateLimiter = require('../middleware');

module.exports = app => {
  app.get('/api/visitors', async (req, res) => {
    const visitors = await Visitor.find().sort([['createdAt', -1]]);

    res.send(visitors);
  });

  app.get('/api/rateLimiter', rateLimiter, (req, res) => {
    res.send('Hello world!');
  });
};
