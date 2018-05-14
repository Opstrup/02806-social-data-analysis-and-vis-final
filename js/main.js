var selectedShift = crimeConstants.shift.values.midnight; // Init value for shift
var selectedCrimeType = [];
var storyProgress = 0;
var zoomLevel = 2; // Init zoom level for map (showing whole map).
var year = 0; // Init year for crime, 2010.

filterData = (data, prop, filterValue) => {
  return data.filter(x => x.properties[prop] == filterValue);
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

  redrawCircles('svg .crime', drawCrime);
}

selectBarChartData = (data) => {
  topFiveCrimesBarChart.data(barChartcrimeConstants[data]);
}

selectCrimeType = (type) => {
  selectedCrimeType = toggleSelectionList(selectedCrimeType, crimeConstants.crimeType.values[type]);
  redrawCircles('svg .crime', drawCrime);
}

resetMap = () => {
  d3.selectAll('.crime-type-selector').property("checked", false);
  selectedCrimeType = [];
  redrawCircles('svg .crime', drawCrime);
}

toggleSelectionList = (selectionList, element) => {
  var i = selectionList.indexOf(element);
  if (i === -1)
    selectionList.push(element);
  else
    selectionList.splice(i, 1);

  return selectionList;
}

selectCrimeYear = (selectedYear) => {
  year = selectedYear;
  d3.selectAll('.crime-type-year').classed('active', false);
  redrawCircles('svg .crime', drawCrime);
  updateCrimeYearHeader(selectedYear);
  topFiveCrimesBarChart.selectYear(selectedYear);
}

updateCrimeYearHeader = (year) => {
  switch (year) {
    case 0:
      populateUIElements('#crime-year-bar-chart', 2010);
      break;
    case 1:
      populateUIElements('#crime-year-bar-chart', 2011);
      break;
    case 2:
      populateUIElements('#crime-year-bar-chart', 2012);
      break;
    case 3:
      populateUIElements('#crime-year-bar-chart', 2013);
      break;
    case 4:
      populateUIElements('#crime-year-bar-chart', 2014);
      break;
    case 5:
      populateUIElements('#crime-year-bar-chart', 2015);
      break;
    case 6:
      populateUIElements('#crime-year-bar-chart', 2016);
      break;
    case 7:
      populateUIElements('#crime-year-bar-chart', 2017);
      break;
    default:
      break;
  }
}

redrawCircles = (cssClass, func) => {
  d3.selectAll(cssClass)
    .remove();
  map.redraw(func);
}

drawCrime = (svg, projection) => {
  d3.json('data/combined_crime_incidents.json', function(json){

    var ds = [];

    if (selectedCrimeType.length > 0) {
      selectedCrimeType.forEach((crimeType) => {
        ds = ds.concat(filterData(json[year], crimeConstants.crimeType.propName, crimeType))
      })
      ds = ds.filter(x => x.properties[crimeConstants.shift.propName] == selectedShift);
    }

    svg.selectAll('circle')
      .data(ds)
      .enter()
      .append('circle')
      .attr('cx', (d) => {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
      })
      .attr('cy', (d) => {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
      })
      .attr('r', zoomLevel)
      .attr('class', (d) => 'crime ' + d.properties[crimeConstants.crimeType.propName].replace('/', ''))
      .style('opacity', 0.75);
  });
}

drawStreetlights = (svg, projection) => {

  var hexbin = d3.hexbin()
              .radius(8)
              .extent([[0, 0], [650, 650]]);

  d3.json('data/street_lights_filtered.geojson', function(json){

    var ds = hexbin(json.features.reduce((acc, x) => {
      acc.push([projection([x.geometry.coordinates[0], x.geometry.coordinates[1]])[0],
                projection([x.geometry.coordinates[0], x.geometry.coordinates[1]])[1]]);
      return acc;
    }, []));

    var opacityScale = d3.scaleLinear()
      .domain([0, d3.max(ds, (d) => d.length)])
      .range([0, 0.75]);

    svg.append('g')
      .attr('class', 'hex')
      .selectAll('path')
      .data(ds)
      .enter()
      .append('path')
      .attr("d", hexbin.hexagon())
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
      .attr('fill', '#ffff33')
      .style('opacity', (d) => opacityScale(d.length));
  })
}

updateDataStory = (storyNumber) => {

  storyProgress = Math.min(Math.max(storyProgress + storyNumber, 0), story.length - 1);

  d3.select('.story-header')
    .html(story[storyProgress].header);
  d3.select('.story-description')
    .html(story[storyProgress].description);
  d3.select('.story-progress-start')
    .text(storyProgress + 1);
  d3.select('.story-progress-end')
    .text(story.length);

  switch (storyProgress) {
    case 0: // Introduction
      map.redraw(zoomOut);
      resetMap();
      break;
    case 1: // Do street lights matter?
      d3.select('#crime-theft-other').property("checked", true);
      selectCrimeType('theftOther');
      map.redraw(zoomCenter);
      break;
    case 2: // Rich vs. Poor 1
      // d3.select('#crime-theft-other').property("checked", true);
      // selectCrimeType('theftOther');
      break;
    case 3: // Rich
      map.redraw(zoomRich);
      break;
    case 4: // Poor
      map.redraw(zoomPoor);
      break;
    case 5: // Rich vs. Poor 2
      map.redraw(zoomOut);
      d3.selectAll('.data-story-1').classed('invis', false);
      d3.selectAll('.data-story-2').classed('invis', true);
      break;
    case 6: // Barchart
      d3.selectAll('.data-story-1').classed('invis', true);
      d3.selectAll('.data-story-2').classed('invis', false);
      d3.selectAll('.data-story-3').classed('invis', true);
      break;
    case 7: // References
      d3.selectAll('.data-story-1').classed('invis', true);
      d3.selectAll('.data-story-2').classed('invis', true);
      d3.selectAll('.data-story-3').classed('invis', false);
      break;
    default:
      break;
  }
}

zoomCenter = (svg, projection, path) => {
  svg.transition()
    .duration(750)
    .attr("transform", "translate(0, 0)scale(1.75)");

  svg.selectAll('circle')
    .transition()
    .duration(500)
    .attr('r', '1');

  zoomLevel = 1;
}

zoomRich = (svg, projection, path) => {
  svg.transition()
    .duration(750)
    .attr("transform", "translate(300, 330)scale(2.5)");

  svg.selectAll('circle')
    .transition()
    .duration(500)
    .attr('r', '1');

  zoomLevel = 1;
}

zoomPoor = (svg, projection, path) => {
  svg.transition()
    .duration(750)
    .attr("transform", "translate(-150, -200)scale(3)");

  svg.selectAll('circle')
    .transition()
    .duration(500)
    .attr('r', '1');

  zoomLevel = 1;
}

zoomOut = (svg, projection, path) => {
  svg.transition()
    .duration(750)
    .attr("transform", "translate(0, 0)scale(1)");

  svg.selectAll('circle')
    .transition()
    .duration(500)
    .attr('r', '2');

  zoomLevel = 2;
}

var map = washingtonMap()
  .mapSvg('#map')
  .height(650)
  .width(650)
  .geojson('data/dc.geojson')
  .callbackList(drawStreetlights)
  .callbackList(drawCrime);

var topFiveCrimesBarChart = barChart()
  .barChartSvg('#bar-chart')
  .dsJson('data/combined_crime_top_five.json')
  .setColorScheme(colorbrewer.YlGnBu[5])
  .height(600)
  .width(600)
  .data(barChartcrimeConstants.total);

map();
topFiveCrimesBarChart();
updateDataStory(storyProgress);
