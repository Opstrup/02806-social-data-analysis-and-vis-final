const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

if (argv.o === undefined || argv.f === undefined) {
  throw 'Please select a input file and output file. Use -f for input and -o for output';
}

const dataFile = argv.f;
const outputFile = argv.o;

var obj;

const getProps = (x) => {
  if (argv._.length == 0) return {};

  var props = {};
  argv._.forEach((prop) => { 
    props[prop] = x[prop];
  })

  return props;
}

fs.exists(dataFile, (exists) => {
  if (!exists) throw 'The input file does not exists!';

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) throw err;
  
    obj = JSON.parse(data);
    filteredFeatures = obj.features.reduce((acc, x) => {
      let props = getProps(x.properties);
      acc.push({ type: 'Feature',
                 properties: props,
                 geometry: x.geometry });
      return acc;
    }, []);
  
    let filteredObj = {
      'type': 'FeatureCollection',
      'features': filteredFeatures
    }
  
    let dataString = JSON.stringify(filteredObj);
    fs.writeFile(outputFile, dataString, 'utf8');
  })
});
