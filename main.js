drawCrime = function (svg, projection) {
  d3.json('data/Crime_Incidents_in_2017.geojson', function(json){
    svg.selectAll('circle')
      .data(json.features)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
      })
      .attr('cy', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
      })
      .attr('r', '3')
      .style('fill', 'red')
      .style('opacity', 0.75);
  })
}

drawStreetlights = function (svg, projection) {
  d3.json('data/Street_Lights.geojson', function(json){
    svg.selectAll('circle')
      .data(json.features)
      .enter()
      .append('circle')
      .attr('cx', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0];
      })
      .attr('cy', function(d) {
        return projection([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1];
      })
      .attr('r', '3')
      .style('fill', 'green')
      .style('opacity', 0.75);
  })
}

var map = washingtonMap()
  .mapSvg('#map')
  .geojson('data/dc.geojson')
  .callbackList(drawStreetlights)

map()