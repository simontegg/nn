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

var jsonToStrings = JSONStream.stringify(false);

var ws = fs.createWriteStream('regime.json', {flags: 'a'})

function catergorise (d) {
  var x = {}
  if (d.exrec === '8' && d.parcomp === '5') {
    x.cat = 'full-democracy'
  } else if (d.parcomp === '3' && parseInt(d.exrec) > 5) {
    x.cat = 'partial-democracy-factionalism'
  } else if (parseInt(d.exrec) > 5 && parseInt(d.parcomp) > 1) {
    x.cat = 'partial-democracy'
  } else if (parseInt(d.exrec) > 5 || parseInt(d.parcomp) > 1) {
    x.cat = 'partial-autocracy'
  } else {
    x.cat = 'full-autocracy'
  }

  x.country = d.country
  x.code = d.scode
  x.year = parseInt(d.year)

  return x
}

// var output = matrix(20, 20);
// fs.createReadStream('./data/p4v2014.csv')

fs.createReadStream('../nn-2/infant-mortality.csv')
  .pipe(csv())
  .pipe(es.map(function(data, cb) {
    if (data['Country Code'] === 'WLD') {
      for (x in data) {
        console.log('{ "year": ', x, ', "value": ', data[x], ' },')
      }
    }

    // console.log(data)
    // cb(null, catergorise(data))
  }))
  // .pipe(jsonToStrings)
  // .pipe(ws)
  // .on('end', function () {
  //
  //   console.log('done')
  //
  // });
