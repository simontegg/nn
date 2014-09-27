var brain = require('brain');
var nor = require('./data/norway');
var _ = require('lodash');
var csv = require('csv-parser');
var fs = require('fs');

var net = new brain.NeuralNetwork();

fs.createReadStream('./data/fsi-2006.csv')
  .pipe(csv())
  .on('data', function(data) {
    var data = _.forIn(data, function(v,k,o) {
      switch (k) {
        case "Country":
          o[k] = v;
          break;
        case "Group-greivance":
          o[k] = parseFloat(v/10);
          break;
        case "Uneven-development":
          o[k] = parseFloat(v/10);
          break;
        default:
          o[k] = parseFloat(v);
          break
      };
    });

    console.log('row', data)
    net.train([
      {
        input: {
          "Group-greivance": data["Group-greivance"],
          "Uneven-development": data["Uneven-development"]
        },
        output: {"EcDis–4": data["EcDis–4"]}
      }
    ]);
  })
  .on('end', function () {
    var output = net.run({"Group-greivance": 1, "Uneven-development": 1})
    console.log('output', output)
  });