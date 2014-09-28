var brain = require('brain');
var nor = require('./data/norway');
var _ = require('lodash');
var csv = require('csv-parser');
var fs = require('fs');
var writeStream = fs.createWriteStream('./data/output.json')
var matrix = require('array-matrix');


var net = new brain.NeuralNetwork();

var mallard = require('mallard');
var dnn = require('dnn');

var dataset = [];
var outputset = [];

var output = matrix(20, 20);

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

    var category = data["State-discrimination"] === 1 ? "State-discrimination" : "no";

    // var row = [data["Group-greivance"], data["Uneven-development"]];
    // var output = [data['PolDis–4']];
    var row = {
      category: category, 
      datapoints: [
        data["Group-greivance"],
        data["Uneven-development"]
      ]
    };

    dataset.push(row);
    // outputset.push(output);
    console.log(row)

  })
  .on('end', function () {
    // var output = net.run({"Group-greivance": 0, "Uneven-development": 0});
    // var trainedDataset = mallard.bayes.train(dataset);


    for (var i = 0; i < output.length; i++) {
      for (var j = 0; j < output.length; j++) {
        var gg = i*0.05;
        var ud = j*0.05;

        output[i][j] = mallard.kNN.classify([gg, ud], dataset, 7) +': gg-'+gg+' ud-'+ud;
      }
    };


    

    console.log('output', output)
    console.log(mallard.kNN.classify([0.8,0.9], dataset, 7))


  });


  /// Threshold group grievance: 8.0, Uneven-development: 8.8