sizeOfStreetLightDs = () => {
  return new Promise((resolve, reject) => {
    d3.json('data/Street_Lights.geojson', (data) => {
      var resObj = {};
      resObj['total'] = data.features.length;
      resObj['props'] = data.features[0]['properties'];
      resolve(resObj);
    });
  });
};

sizeOfCrimes = () => {
  return new Promise((resolve, reject) => {
    d3.json('data/combined_crime_incidents.json', (data) => {
      var resObj = {};
      var totalSize = 0;
      data.forEach((d, key) => {
        resObj['201' + key] = d.length;
        totalSize += d.length;
      });
      resObj['total'] = totalSize;
      resObj['props'] = data[0][0]['properties'];
      console.log(data);
      resolve(resObj);
    });
  });
}

populateUIElements = (ele, data) => {
  d3.select(ele)
    .text(data);
};

init = () => {
  sizeOfStreetLightDs().then((result) => {
    populateUIElements('#streetlight-total-size', result.total);
    populateUIElements('#streetlight-props', Object.keys(result.props).length);
  });

  sizeOfCrimes().then((result) => {
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