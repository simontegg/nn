var request = require('request');
var Transform = require('stream').Transform;

var parser = new Transform({objectMode: true});

parser._transform = function(data, encoding, done) {
  console.log(data.toString());
  done();
};

var url = "http://api.worldbank.org/countries/all/indicators/SP.DYN.IMRT.IN?format=json&page=110"


request(url)
  .pipe(parser)