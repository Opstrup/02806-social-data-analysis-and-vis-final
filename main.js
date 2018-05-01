crimeConstants = {
  shift: {
    propName: 'SHIFT',
    values: {
      day: 'DAY',
      evening: 'EVENING',
      midnight: 'MIDNIGHT',
    }
  }
}

streetLightConstants = {
  roadTypeDesc: {
    propName: 'ROADTYPE_DESC',
    values: {
      street: 'Street',
      alley: 'Alley',
      highway: 'Highway',
      ramp: 'Ramp'
    }
  }
}

filterData = (data, prop, filterValue) => {
  return data.features.filter(x => x.properties[prop] == filterValue);
}

drawCrime = function (svg, projection) {
  d3.json('data/crime_2017_filtered.geojson', function(json){

    var ds = filterData(json, crimeConstants.shift.propName, crimeConstants.shift.values.midnight);

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
      .style('fill', 'red')
      .style('opacity', 0.75);
  })
}

drawStreetlights = function (svg, projection) {
  d3.json('data/street_lights_filtered.geojson', function(json){

    var ds = filterData(json, streetLightConstants.roadTypeDesc.propName, streetLightConstants.roadTypeDesc.values.alley);

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
  .callbackList(drawStreetlights)

map()