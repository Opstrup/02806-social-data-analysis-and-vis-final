function washingtonMap() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 800,
    height = 800
    geojson = '',
    callbackList = [],
    onClick = function () { },
    mapSvg = '';
    var svg, projection, dcPath;

  function map() {

    projection = d3.geoAlbersUsa();

    //Define default path generator
    dcPath = d3.geoPath()
                    .projection(projection);

    svg = d3.select(mapSvg)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

    //Load in boroughs map data
    d3.json(geojson, function(dc) {

      var tracts = topojson.feature(dc, dc.objects.dctracts);
      projection
        .scale(1)
        .translate([0, 0]);

      var b = dcPath.bounds(tracts),
        s = 1.0 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    
      projection
          .scale(s)
          .translate(t);

      //Drawing dc
      svg.selectAll('path')
          .data(tracts.features)
          .enter()
          .append('path')
          .attr('d', dcPath)
          .on('click', onClick)
          .style('fill', '#b7b7b7')
          .style('stroke', 'white');

      // Callback handler
      callbackList.forEach(function(callback){
        callback(svg, projection);
      })
    })
  }

  map.width = function(svgWidth) {
    if (!arguments.length) return width;
    width = svgWidth;
    return map;
  };

  map.height = function(svgHeight) {
    if (!arguments.length) return height;
    height = svgHeight;
    return map;
  };

  map.geojson = function(geojsonPath) {
    if (!arguments.length) return this.geojson;
    geojson = geojsonPath;
    return map;
  }

  map.callbackList = function(callback) {
    if (!arguments.length) return callbackList;
    callbackList.push(callback);
    return map;
  }

  map.mapSvg = function(mapElement) {
    if (!arguments.length) return this.mapSvg;
    mapSvg = mapElement;
    return map;
  }

  map.onClick = function(_) {
    if (!arguments.length) return onClick;
    onClick = _;
    return map;
  };

  map.redraw = function(callback) {
    callback(svg, projection, dcPath);
    return map;
  }

  return map;
}