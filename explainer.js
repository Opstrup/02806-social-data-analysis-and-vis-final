readDataFile = (file) => {
  return new Promise((resolve, reject) => {
    d3.json(file, (data) => {
      resolve(data);
    });
  });
}

sizeOfStreetLightDs = (data) => {
  var resObj = {};
  resObj['total'] = data.features.length;
  resObj['props'] = data.features[0]['properties'];
  return resObj;
};

sizeOfCrimes = (data) => {
  var resObj = {};
  var totalSize = 0;
  data.forEach((d, key) => {
    resObj['201' + key] = d.length;
    totalSize += d.length;
  });
  resObj['total'] = totalSize;
  resObj['props'] = data[0][0]['properties'];
  return resObj;
}

populateUIElements = (ele, data) => {
  d3.select(ele)
    .text(data);
};

init = () => {
  readDataFile('data/Street_Lights.geojson').then((data) => {
    var result = sizeOfStreetLightDs(data);
    populateUIElements('#streetlight-total-size', result.total);
    populateUIElements('#streetlight-props', Object.keys(result.props).length);

    var countedStreetLight = data.features.reduce((acc, x) => {
      if (acc.get(x.properties[streetLightConstants.roadTypeDesc.propName]) == undefined)
          acc.set(x.properties[streetLightConstants.roadTypeDesc.propName], 1)
        else
          acc.set(x.properties[streetLightConstants.roadTypeDesc.propName], acc.get(x.properties[streetLightConstants.roadTypeDesc.propName]) + 1)
        return acc;
    }, new Map())

    var countedDs = [
      {
        value: 53561,
        label: "Street"
      },
      {
        value: 14799,
        label: "Alley"
      },
      {
        value: 880,
        label: "Ramp"
      },
      {
        value: 673,
        label: "Highway"
      },
      {
        value: 253,
        label: "Trail/Walkway"
      },
      {
        value: 48,
        label: "Service Road"
      },
      {
        value: 1,
        label: "Driveway"
      }
    ]

    var streetLightBarChart = barChart()
                          .barChartSvg('#street-light-bar-chart')
                          .setColorScheme(colorbrewer.YlGnBu[7])
                          .height(450)
                          .width(450)
                          .onMouseOver((d) => {
                            d3.select('#street-light-bar-chart-tooltip')
                              .classed('invis', false)
                              .select('#desc')
                              .text(d.label);
                            d3.select('#street-light-bar-chart-tooltip')
                              .select('#value')
                              .text(d.value);
                          })
                          .onMouseOut(() => d3.select('#street-light-bar-chart-tooltip').classed('invis', true))
                          .ds(countedDs);
    streetLightBarChart();
  });

  readDataFile('data/combined_crime_incidents.json').then((data) => {
    var result = sizeOfCrimes(data);

    var totalCrime = [];
    data.forEach((ds) => {
      var countedCrimes = ds.reduce((acc, x) => {
        if (acc.get(x.properties[crimeConstants.crimeType.propName]) == undefined)
            acc.set(x.properties[crimeConstants.crimeType.propName], 1)
          else
            acc.set(x.properties[crimeConstants.crimeType.propName], acc.get(x.properties[crimeConstants.crimeType.propName]) + 1)
          return acc;
      }, new Map())
      totalCrime.push(countedCrimes);
    });

    var crime = [
      {
        value: 2334 + 2362 + 2392 + 2464 + 2387 + 2270 + 1853,
        label: "ASSAULT W/DANGEROUS WEAPON"
      },
      {
        value: 126 + 89 + 104 + 105 + 160 + 136 + 115,
        label: "HOMICIDE"
      },
      {
        value: 9267 + 12099 + 12852 + 14592 + 14244 + 14517 + 14445,
        label: "THEFT/OTHER"
      },
      {
        value: 3762 + 2834 + 2665 + 3119 + 2906 + 2692 + 2406,
        label: "MOTOR VEHICLE THEFT"
      },
      {
        value: 3674 + 4202 + 3986 + 3277 + 3347 + 2972 + 2166,
        label: "ROBBERY"
      },
      {
        value: 8157 + 9767 + 10169 + 11332 + 11352 + 12138 + 10257,
        label: "THEFT F/AUTO"
      },
      {
        value: 4060 + 3616 + 3354 + 3178 + 2536 + 2124 + 1527,
        label: "BURGLARY"
      },
      {
        value: 47 + 34 + 35 + 26 + 18 + 6 + 5,
        label: "ARSON"
      },
      {
        value: 156 + 272 + 298 + 317 + 331 + 346 + 292,
        label: "SEX ABUSE"
      }
    ];

    var crimeBarChart = barChart()
                          .barChartSvg('#crime-bar-chart')
                          .setColorScheme(colorbrewer.YlGnBu[9])
                          .height(530)
                          .width(450)
                          .onMouseOver((d) => {
                            d3.select('#crime-bar-chart-tooltip')
                              .classed('invis', false)
                              .select('#desc')
                              .text(d.label);
                            d3.select('#crime-bar-chart-tooltip')
                              .select('#value')
                              .text(d.value);
                          })
                          .onMouseOut(() => d3.select('#crime-bar-chart-tooltip').classed('invis', true))
                          .ds(crime);
    crimeBarChart();

    populateUIElements('#crime-props', Object.keys(result.props).length);
    populateUIElements('#crime-2010', result['2010']);
    populateUIElements('#crime-2011', result['2011']);
    populateUIElements('#crime-2012', result['2012']);
    populateUIElements('#crime-2013', result['2013']);
    populateUIElements('#crime-2014', result['2014']);
    populateUIElements('#crime-2015', result['2015']);
    populateUIElements('#crime-2016', result['2016']);
    populateUIElements('#crime-2017', result['2017']);
    populateUIElements('#crime-total-size', result.total);
  });

};

init();