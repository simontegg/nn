var brain = require('brain');
var _ = require('lodash');
var csv = require('csv-parser');
var fs = require('fs');
var writeStream = fs.createWriteStream('./data/output.json')
var matrix = require('array-matrix');
var  JSONStream = require('JSONStream');
var es = require('event-stream');

//
// var net = new brain.NeuralNetwork();

// var mallard = require('mallard');
// var dnn = require('dnn');

var dataset = [];
var outputset = [];

var jsonToStrings = JSONStream.stringify()

var ws = fs.createWriteStream('./data/mar.json', {flags: 'a'})


// var output = matrix(20, 20);
// fs.createReadStream('./data/p4v2014.csv')

fs.createReadStream('./data/mar.csv')
  .pipe(csv())
  .pipe(es.map(function(data, cb) {
    console.log(parseInt(data.year))
    var d = {
      country: data.country,
      year: data.year
    }
    if (data.poldis === '4' || data.ecdis === '4') {
      d.stateDiscrimination = 1
    } else {
      d.stateDiscrimination = 0
    }
    cb(null, d)
  }))
  .pipe(jsonToStrings)
  .pipe(ws)
  .on('end', function () {

    console.log('done')

  });
