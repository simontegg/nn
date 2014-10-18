var request = require('request');
var Transform = require('stream').Transform;

var parser = new Transform({objectMode: true});
var es = require('event-stream');
var filter = require('stream-filter');
var fs = require('fs');
var  JSONStream = require('JSONStream');
var _ = require('lodash');
var paginationStream = require('pagination-stream');
var restCollection = require('rest-collection-stream')
var isArray = require('isarray');


var jsonToStrings = JSONStream.stringify(false);

var ws = fs.createWriteStream('test.json', {flags: 'a'})

var countries = require('./node_modules/countries-list/countries.minimal.json')
var codes = Object.keys(countries)


var options = {
  urlFormat: "http://api.worldbank.org/countries/all/indicators/SP.DYN.IMRT.IN?date=1955:2014&format=json&page=%d",
  headers: {'user-agent': 'pug'},
  start: 0,
  end: 279,
  retries: 2
}


paginationStream(options)
  .pipe(JSONStream.parse("*.*"))
  .pipe(filter(function(data) {
    if (data.country) {
      return _.contains(codes, data.country.id)
    } else {
      return false;
    }
  }))
  .pipe(es.map(function(data, cb) {
    var newData = {
      country: data.country.value,
      code: data.country.id,
      value: parseFloat(data.value),
      year: parseInt(data.date)
    };
    cb(null, newData)
  }))
  .pipe(jsonToStrings)
  .pipe(ws)




