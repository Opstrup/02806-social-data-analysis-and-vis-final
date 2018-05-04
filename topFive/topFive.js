const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

if (argv.o === undefined || argv.f === undefined) {
  throw 'Please select a input file and output file. Use -f for input and -o for output';
}

const dataFile = argv.f;
const outputFile = argv.o;

fs.exists(dataFile, (exists) => {
  if (!exists) throw 'The input file does not exists!';

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) throw err;

    obj = JSON.parse(data);
    counted = obj.features.reduce((acc, x) => {
        if (acc.get(x.properties['OFFENSE']) == undefined)
          acc.set(x.properties['OFFENSE'], 1)
        else
          acc.set(x.properties['OFFENSE'], acc.get(x.properties['OFFENSE']) + 1)
        return acc;
      }, new Map())
      .entries();

    countedTopFive = Array.from(counted)
      .sort((a, b) => { return b[1] - a[1] })
      .slice(0, 5)
      .reduce((acc, x) => {
        var jsObj = {}
        jsObj[x[0]] = x[1];
        acc.push(jsObj)
        return acc;
      }, [])

    topFive = obj.features.filter(x => {
      return (x.properties['OFFENSE'] == 'THEFT/OTHER' ||
        x.properties['OFFENSE'] == 'THEFT F/AUTO' ||
        x.properties['OFFENSE'] == 'MOTOR VEHICLE THEFT' ||
        x.properties['OFFENSE'] == 'ROBBERY' ||
        x.properties['OFFENSE'] == 'ASSAULT W/DANGEROUS WEAPON')
    })

    let dataString = JSON.stringify(topFive);
    fs.writeFile(outputFile, dataString, 'utf8');
  })
});