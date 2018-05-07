const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

/**
 * Creates a file with the top five crimes in DC.
 * File format
 * {
 *  Total: {
 *    CrimeA: 100,
 *    CrimeB: 200,
 *    ....
 *  },
 *  Day: {
 *    CrimeA: 100,
 *    CrimeB: 200,
 *    ....
 *  },
 *  Evening: {
 *    CrimeA: 100,
 *    CrimeB: 200,
 *    ....
 *  },
 *  Midnight: {
 *    CrimeA: 100,
 *    CrimeB: 200,
 *    ....
 *  }
 * }
 */

if (argv.o === undefined || argv.f === undefined) {
  throw 'Please select a input file and output file. Use -f for input and -o for output';
}

const dataFile = argv.f;
const outputFile = argv.o;

fs.exists(dataFile, (exists) => {
  if (!exists) throw 'The input file does not exists!';

  fs.readFile(dataFile, 'utf8', (err, data) => {
    if (err) throw err;

    var res = { Total: {}, DAY: {}, EVENING: {}, MIDNIGHT: {} };
    const SHIFTS = ['DAY', 'EVENING', 'MIDNIGHT'];

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
      .slice(0, 5);

    countedTopFive.forEach((crime) => {
      res.Total[crime[0]] = obj.features.filter(x => x.properties['OFFENSE'] == crime[0]).length
      SHIFTS.forEach((shift) => {
        res[shift][crime[0]] = obj.features.filter(x => x.properties['OFFENSE'] == crime[0])
          .filter(x => x.properties['SHIFT'] == shift).length
      })
    });

    let dataString = JSON.stringify(res);
    fs.writeFile(outputFile, dataString, 'utf8');
  })
});