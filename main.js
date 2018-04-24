drawStreetLights = function (svg) {
  console.log('The svg be like', svg)
  
  svg.append('circle')
    .attr('cx', '100')
    .attr('cy', '100')
    .attr('r', '10')
    .style('fill', 'red');
}

var map = washingtonMap()
  .mapSvg('#map')
  .geojson('data/dc.geojson')
  .callbackList(drawStreetLights)

map()