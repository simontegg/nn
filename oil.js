var fs = require('fs');




var fn = './data/norway.json';

var arr = [];

var split = nor.split(' ').forEach(function(d) { arr.push(parseInt(d))});

arr = _.remove(arr, function(d) { return d });

var cumulative = 0;

data = arr.map(function(d, i) {
  var p = parseInt(d)*365/1000000
  cumulative += p;
  return {
    production: p,
    year: 1971+i,
    Q: cumulative
  };
})


console.log(arr);

fs.writeFile(fn, JSON.stringify(data, null, 4), function(err) {
  if (err) console.log(err);

  console.log("JSON save to " + fn)
})