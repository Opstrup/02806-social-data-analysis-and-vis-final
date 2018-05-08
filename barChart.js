function barChart() {

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400,
    height = 400,
    innerWidth = width - margin.left - margin.right,
    innerHeight = height - margin.top - margin.bottom,
    xScale = d3.scaleBand().padding(0.1),
    yScale = d3.scaleLinear(),
    onMouseOver = function () { },
    onMouseOut = function () { },
    barChartSvg = '',
    dsJson = '',
    yAxis = d3.axisLeft(),
    dataMargin = 300;
    var selectedData;

  var colorScheme;

  function chart() {
    d3.json(dsJson, function(data) {

      yScale.rangeRound([innerHeight, 0])
            .domain([0, d3.max(data[selectedData], (d) => d.value ) + dataMargin])

      xScale.rangeRound([0, innerWidth])
            .domain(d3.range(5));

      var lblScale = d3.scaleBand().padding(0.1)
                       .rangeRound([0, innerWidth])
                       .domain(data[selectedData].reduce((acc, x) => {
                        acc.push(x.label);
                        return acc;
                       }, []))

      var xAxis = d3.axisBottom()
                    .scale(lblScale);

      yAxis.scale(yScale)
           .ticks(10);

      var svg = d3.select(barChartSvg)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

      var g = svg.append('g')
                 .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      g.selectAll('rect')
         .data(data[selectedData])
         .enter()
         .append('rect')
         .attr('x', (d, i) => xScale(i))
         .attr('y', (d) => yScale(d.value))
         .attr('width', xScale.bandwidth())
         .attr('height', (d) => innerHeight - yScale(d.value))
         .attr('fill', (d, i) => colorScheme[i])
         .attr('class', 'top-five-crimes-bar')
         .on("mouseover", onMouseOver)
         .on("mouseout", onMouseOut);

      g.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(0,' + innerHeight + ')')
       .call(xAxis)
       .selectAll('text')
       .attr('y', 0)
       .attr('x', 9)
       .attr('transform', 'rotate(45)')
       .style('text-anchor', 'start');

      g.append('g')
         .attr('class', 'y axis')
         .transition()
         .duration(500)
         .call(yAxis);
    })
  }

  var updateChart = (selectedData) => {
    d3.json(dsJson, function(data) {
      var datapoint = d3.select(barChartSvg)
                        .selectAll('rect')
                        .data(data[selectedData]);

      yScale.rangeRound([innerHeight, 0])
            .domain([0, d3.max(data[selectedData], (d) => d.value ) + dataMargin])

      xScale.rangeRound([0, innerWidth])
            .domain(d3.range(5));

      datapoint.enter()
        .append('rect')
        .merge(datapoint)
        .transition()
        .duration(1000)
        .attr('x', (d, i) => xScale(i))
        .attr('width', xScale.bandwidth())
        .attr('y', (d) => yScale(d.value))
        .attr('height', (d) => innerHeight - yScale(d.value))
        .attr('fill', (d, i) => colorScheme[i]);
      
      datapoint
        .exit().remove();

      d3.select('.y')
        .transition()
        .duration(500)
        .call(yAxis);
    })
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.onMouseOver = function(_) {
    if (!arguments.length) return onMouseOver;
    onMouseOver = _;
    return chart;
  };

  chart.onMouseOut = function(_) {
    if (!arguments.length) return onMouseOut;
    onMouseOut = _;
    return chart;
  };

  chart.barChartSvg = function(barChartElement) {
    if (!arguments.length) return barChartSvg;
    barChartSvg = barChartElement;
    return chart;
  }

  chart.dsJson = function(dsJsonPath) {
    if (!arguments.length) return dsJsonPath;
    dsJson = dsJsonPath;
    return chart;
  }

  chart.setColorScheme = function(colorS) {
    if (!arguments.length) return colorS;
    colorScheme = colorS;
    return chart;
  }

  chart.data = function(data) {
    if (!arguments.length) return data;
    if (!(data === selectedData) && selectedData !== undefined) updateChart(data);
    selectedData = data;
    return chart;
  }

  return chart;
}
