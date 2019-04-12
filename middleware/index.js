const mongoose = require('mongoose');
require('../models/Visitor');
const Visitor = mongoose.model('visitors');
const config = require('../config');

module.exports = async (req, res, next) => {
  'use strict';
  let ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // this check is necessary for some clients that set an array of IP addresses
  ip = (ip || '').split(',')[0];

  await Visitor.findOneAndUpdate(
    { ip },
    { $inc: { hits: 1 } },
    { upsert: false }
  ).exec((err, visitor) => {
    if (err) {
      res.statusCode = 500;
      return next(err);
    } else if (!visitor) {
      const visitor = new Visitor({ createdAt: new Date(), ip });

      visitor.save((err, visitor) => {
        if (err) {
          res.statusCode = 500;
          return next(err);
        } else if (!visitor) {
          res.statusCode = 500;
          return res.json({
            errs: [{ message: 'err checking rate limit' }]
          });
        }
      });
      helper(req, res, next, visitor);
    } else {
      helper(req, res, next, visitor);
    }
  });

  const helper = (req, res, next, visitor) => {
    const reset =
      config.ttl * 1000 - (new Date().getTime() - visitor.createdAt.getTime());
    const remaining = Math.max(0, config.max - visitor.hits);

    res.set('X-RateLimit-Remaining', remaining);
    res.set('X-RateLimit-Reset', reset);
    res.set('ip', ip);
    req.visitor = visitor;

    if (visitor.hits < config.max) {
      return next();
    } else {
      res.statusCode = 429; // Too Many Requests
      return res.json({
        errs: 'Rate Limit reached. Please wait and try again!.'
      });
    }
  };
};
