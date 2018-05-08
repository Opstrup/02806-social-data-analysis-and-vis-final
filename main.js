var selectedShift = crimeConstants.shift.values.day;
var selectedStreetLightType = [];

filterData = (data, prop, filterValue) => {
  return data.features.filter(x => x.properties[prop] == filterValue);
}

selectCrimeShift = (shift) => {
  switch (shift) {
    case 'day':
      selectedShift = crimeConstants.shift.values.day;
      break;
    case 'evening':
      selectedShift = crimeConstants.shift.values.evening;
      break;
    case 'midnight':
      selectedShift = crimeConstants.shift.values.midnight;
      break;
    default:
      selectedShift = crimeConstants.shift.values.day;
      break;
  }

  redrawCircles('.crime', drawCrime);
}

selectBarChartData = (data) => {
  switch (data) {
    case 'total':
      topFiveCrimesBarChart.data(barChartcrimeConstants.total);
      break;
    case 'day':
      topFiveCrimesBarChart.data(barChartcrimeConstants.day);
      break;
    case 'evening':
      topFiveCrimesBarChart.data(barChartcrimeConstants.evening);
      break;
    case 'midnight':
      topFiveCrimesBarChart.data(barChartcrimeConstants.midnight);
      break;
    default:
      topFiveCrimesBarChart.data(barChartcrimeConstants.total);
      break;
  }
}

selectStreetLightType = (type) => {
  switch (type) {
    case 'street':
      selectedStreetLightType = toggleStreetLight(selectedStreetLightType, streetLightConstants.roadTypeDesc.values.street);
      break;
    case 'alley':
      selectedStreetLightType = toggleStreetLight(selectedStreetLightType, streetLightConstants.roadTypeDesc.values.alley);
      break;
    case 'highway':
      selectedStreetLightType = toggleStreetLight(selectedStreetLightType, streetLightConstants.roadTypeDesc.values.highway);
      break;
    case 'ramp':
      selectedStreetLightType = toggleStreetLight(selectedStreetLightType, streetLightConstants.roadTypeDesc.values.ramp);
      break;
    default:
      selectedStreetLightType = []
      break;
  }

  redrawCircles('.street-light', drawStreetlights);
}

toggleStreetLight = (streetLightList, streetLight) => {
  var i = streetLightList.indexOf(streetLight);
  if (i === -1)
    streetLightList.push(streetLight);
  else
    streetLightList.splice(i, 1);

  return streetLightList;
}

redrawCircles = (cssClass, func) => {
  d3.selectAll(cssClass)
      .remove();
  map.redraw(func);
}

drawCrime = (svg, projection) => {
  d3.json('data/crime_2017_filtered.geojson', function(json){

    var ds = filterData(json, crimeConstants.shift.propName, selectedShift);

    svg.selectAll('circle')
      .data(ds)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
      })
      .attr('cy', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
      })
      .attr('r', '2')
      .attr('class', 'crime')
      .style('fill', 'red')
      .style('opacity', 0.75);
  })
}

drawStreetlights = (svg, projection) => {
  d3.json('data/street_lights_filtered.geojson', function(json){

    var ds = [];

    selectedStreetLightType.forEach((streetLightType) => {
      ds = ds.concat(filterData(json, streetLightConstants.roadTypeDesc.propName, streetLightType));
    })

    svg.selectAll('circle')
      .data(ds)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
      })
      .attr('cy', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
      })
      .attr('r', '2')
      .attr('class', 'street-light')
      .style('fill', 'green')
      .style('opacity', 0.75);
  })
}

var map = washingtonMap()
  .mapSvg('#map')
  .height(650)
  .width(650)
  .geojson('data/dc.geojson')
  .callbackList(drawCrime)
  .callbackList(drawStreetlights);

map();

var topFiveCrimesBarChart = barChart()
  .barChartSvg('#bar-chart')
  .dsJson('data/crime_2017_top5_filtered.json')
  .setColorScheme(colorbrewer.YlGnBu[5])
  .height(600)
  .width(600)
  .data(barChartcrimeConstants.total);

topFiveCrimesBarChart();