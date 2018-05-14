const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

/**
 * Creates a file with the top five crimes in DC.
 * File format
 * {
 *  Total:
 *    [
 *     {
 *       'label': CrimeA,
 *       'value': 100
 *     },
 *     {
 *       'label': CrimeB,
 *       'value': 100
 *     },
 *     ....
 *    ],
 *  Day:
 *    [
 *     {
 *       'label': CrimeA,
 *       'value': 100
 *     },
 *     {
 *       'label': CrimeB,
 *       'value': 100
 *     },
 *     ....
 *    ],
 *  Evening:
 *    [
 *     {
 *       'label': CrimeA,
 *       'value': 100
 *     },
 *     {
 *       'label': CrimeB,
 *       'value': 100
 *     },
 *     ....
 *    ],
 *  Midnight:
 *    [
 *     {
 *       'label': CrimeA,
 *       'value': 100
 *     },
 *     {
 *       'label': CrimeB,
 *       'value': 100
 *     },
 *     ....
 *    ],
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

    const SHIFTS = ['DAY', 'EVENING', 'MIDNIGHT'];
    var totalCrimeList = [];

    obj = JSON.parse(data);

    obj.forEach((crimYear) => {
      counted = crimYear.reduce((acc, x) => {
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

      var res = { Total: [], DAY: [], EVENING: [], MIDNIGHT: [] };

      countedTopFive.forEach((crime) => {
        res.Total.push({'label': crime[0], 'value': crimYear.filter(x => x.properties['OFFENSE'] == crime[0]).length})
        SHIFTS.forEach((shift) => {
          res[shift].push(
            {
              'label': crime[0],
              'value': crimYear.filter(x => x.properties['OFFENSE'] == crime[0])
                          .filter(x => x.properties['SHIFT'] == shift).length
            })
        });
      });
      totalCrimeList.push(res);
    });

    let dataString = JSON.stringify(totalCrimeList);
    fs.writeFile(outputFile, dataString, 'utf8');
  })
});