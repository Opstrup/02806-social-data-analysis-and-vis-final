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

init = () => {
  var streetLightData = {
    total: 70215,
    numProps: 95,
    barChartData: [
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
  };
  populateUIElements('#streetlight-total-size', streetLightData.total);
  populateUIElements('#streetlight-props', streetLightData.numProps);

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
                        .ds(streetLightData.barChartData);
  streetLightBarChart();

  var crimeData = {
    numProps: 22,
    numOfRows: {
      2010: 31583,
      2011: 33213,
      2012: 35275,
      2013: 35855,
      2014: 38410,
      2015: 37281,
      2016: 37201,
      2017: 33066,
      total: 281884
    },
    barChartData: [
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
    ]
  };

  populateUIElements('#crime-props', crimeData.numProps);

  populateUIElements('#crime-2010', crimeData.numOfRows['2010']);
  populateUIElements('#crime-2011', crimeData.numOfRows['2011']);
  populateUIElements('#crime-2012', crimeData.numOfRows['2012']);
  populateUIElements('#crime-2013', crimeData.numOfRows['2013']);
  populateUIElements('#crime-2014', crimeData.numOfRows['2014']);
  populateUIElements('#crime-2015', crimeData.numOfRows['2015']);
  populateUIElements('#crime-2016', crimeData.numOfRows['2016']);
  populateUIElements('#crime-2017', crimeData.numOfRows['2017']);
  populateUIElements('#crime-total-size', crimeData.numOfRows.total);

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
                          .ds(crimeData.barChartData);
  crimeBarChart();
};

init();