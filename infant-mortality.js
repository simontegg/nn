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


var jsonToStrings = JSONStream.stringify();

var ws = fs.createWriteStream('./data/im.json', {flags: 'a'})

var countries = require('./node_modules/countries-list/countries.minimal.json')
var codes = Object.keys(countries)


var options = {
  urlFormat: "http://api.worldbank.org/countries/all/indicators/SP.DYN.IMRT.IN?date=1955:2014&format=json&page=%d",
  headers: {'user-agent': 'pug'},
  start: 0,
  end: 279,
  retries: 2
}

var world = [

  { "year":  1960 , "value":  121.3  },
  { "year":  1961 , "value":  119.4  },
  { "year":  1962 , "value":  119.9  },
  { "year":  1963 , "value":  117.8  },
  { "year":  1964 , "value":  116.2  },
  { "year":  1965 , "value":  114.5  },
  { "year":  1966 , "value":  113.2  },
  { "year":  1967 , "value":  113  },
  { "year":  1968 , "value":  109.6  },
  { "year":  1969 , "value":  101.8  },
  { "year":  1970 , "value":  98.7  },
  { "year":  1971 , "value":  96  },
  { "year":  1972 , "value":  93.8  },
  { "year":  1973 , "value":  91.5  },
  { "year":  1974 , "value":  89.3  },
  { "year":  1975 , "value":  87.6  },
  { "year":  1976 , "value":  85.9  },
  { "year":  1977 , "value":  84.5  },
  { "year":  1978 , "value":  83.2  },
  { "year":  1979 , "value":  81.8  },
  { "year":  1980 , "value":  80.2  },
  { "year":  1981 , "value":  77.7  },
  { "year":  1982 , "value":  75.3  },
  { "year":  1983 , "value":  72.8  },
  { "year":  1984 , "value":  70.4  },
  { "year":  1985 , "value":  68.3  },
  { "year":  1986 , "value":  66.7  },
  { "year":  1987 , "value":  65.4  },
  { "year":  1988 , "value":  64.3  },
  { "year":  1989 , "value":  63.4  },
  { "year":  1990 , "value":  62.7  },
  { "year":  1991 , "value":  62  },
  { "year":  1992 , "value":  61.5  },
  { "year":  1993 , "value":  61  },
  { "year":  1994 , "value":  60.5  },
  { "year":  1995 , "value":  59.7  },
  { "year":  1996 , "value":  58.7  },
  { "year":  1997 , "value":  57.5  },
  { "year":  1998 , "value":  56.1  },
  { "year":  1999 , "value":  54.6  },
  { "year":  2000 , "value":  53  },
  { "year":  2001 , "value":  51.2  },
  { "year":  2002 , "value":  49.4  },
  { "year":  2003 , "value":  47.7  },
  { "year":  2004 , "value":  45.9  },
  { "year":  2005 , "value":  44.2  },
  { "year":  2006 , "value":  42.6  },
  { "year":  2007 , "value":  41.1  },
  { "year":  2008 , "value":  39.6  },
  { "year":  2009 , "value":  38.3  },
  { "year":  2010 , "value":  37  },
  { "year":  2011 , "value":  35.7  },
  { "year":  2012 , "value":  34.6  },
  { "year":  2013 , "value":  33.6  },
  { "year":  2014 , "value":    33 }
 ]



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
    var w = _.find(world, { year: parseInt(data.date) })

    var newData = {
      country: data.country.value,
      code: data.country.id,
      value: parseFloat(data.value),
      score: Math.log(parseFloat(data.value)) / Math.log(w.value),
      year: parseInt(data.date)
    };
    cb(null, newData)
  }))
  .pipe(jsonToStrings)
  .pipe(ws)
