'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WodSchema = new Schema({
  date: { type: Date, default: Date.now },
  description: String
});

mongoose.model('Wod', WodSchema);