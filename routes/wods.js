'use strict';

var mongoose = require('mongoose'),
    Wod = mongoose.model('Wod');

exports.findAll = function(req, res) {
  Wod.find().sort({ date: 'desc' }).exec(function(err, lifts) {
    if (err) return res.json(500, err);
    res.json(lifts);
  });
};

exports.findById = function(req, res, next, id) {
  Wod.findById(id, function(err, lift) {
    if (err) return next(err);
    if (!lift) return next(new Error('Failed to load wod ' + id));
    req.lift = lift;
    next();
  });
};