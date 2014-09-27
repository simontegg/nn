var brain = require('brain');
var nor = require('./data/norway');
var _ = require('lodash');
// var csv = require('csv-parser');
var fs = require('fs');

var Transform = require('stream').Transform
  , csv = require('csv-streamify')
  , JSONStream = require('JSONStream');

var w = fs.createWriteStream('./data/ect.json');

var csvToJson = csv({objectMode: true, columns: true});

var parser = new Transform({objectMode: true});




parser._transform = function(data, encoding, done) {
  var data = _.forIn(data, function(v,k,o) {
    o[k] = k === "Year" ? v : +parseFloat(parseFloat(v/prev[k])-1).toFixed(3);
    prev[k] = parseFloat(v)
  })
  this.push(data);
  done();
};

var jsonToStrings = JSONStream.stringify();

process.stdin
.pipe(csvToJson)
.pipe(parser)
.pipe(jsonToStrings)
.pipe(w);


// var writable = fs.createWriteStream('./data/ect.json')

// var r = fs.createReadStream('./data/ect.csv')

// r
//   .pipe(csv())
//   .on('data', function(data) {

//     console.log('row ', data)
//   })


//  r.pipe(writable)

// var net = new brain.NeuralNetwork();

