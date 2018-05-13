const fs = require('fs');
const outputFile = '../data/combined_crime_incidents.json';
// const crimeDatasets = ['Crime_Incidents_in_2010.geojson',
//                       'Crime_Incidents_in_2011.geojson',
//                       'Crime_Incidents_in_2012.geojson',
//                       'Crime_Incidents_in_2013.geojson',
//                       'Crime_Incidents_in_2014.geojson',
//                       'Crime_Incidents_in_2015.geojson',
//                       'Crime_Incidents_in_2016.geojson',
//                       'Crime_Incidents_in_2017.geojson']
const crimeDatasets = ['crime_2010.geojson',
                      'crime_2011.geojson',
                      'crime_2012.geojson',
                      'crime_2013.geojson',
                      'crime_2014.geojson',
                      'crime_2015.geojson',
                      'crime_2016.geojson',
                      'crime_2017.geojson']

var combinedCrimes = [];
crimeDatasets.forEach((dataFile) => {
  var data = fs.readFileSync('../data/new/' + dataFile, 'utf8')

  var obj = JSON.parse(data);
  var crimes = obj.features.reduce((acc, x) => {
    acc.push(x);
    return acc;
  }, []);

  combinedCrimes.push(crimes);
});

let dataString = JSON.stringify(combinedCrimes);
fs.writeFile(outputFile, dataString, 'utf8');