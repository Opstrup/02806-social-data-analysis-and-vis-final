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
    dsJson = '';

  var colorScheme;

  function chart() {
    d3.json(dsJson, function(data) {

      var testData = [
        {
          "label": "crime1",
          "value": 10
        },
        {
          "label": "crime2",
          "value": 9
        },
        {
          "label": "crime3",
          "value": 8
        },
        {
          "label": "crime4",
          "value": 7
        },
        {
          "label": "crime5",
          "value": 6
        }
      ];

      yScale.rangeRound([innerHeight, 0])
            .domain([0, d3.max(testData, (d) => d.value )])

      xScale.rangeRound([0, innerWidth])
            .domain(d3.range(5));

      var lblScale = d3.scaleBand().padding(0.1)
                       .rangeRound([0, innerWidth])
                       .domain(testData.reduce((acc, x) => {
                        acc.push(x.label);
                        return acc;
                       }, []))

      var xAxis = d3.axisBottom()
                    .scale(lblScale);

      var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10);

      var svg = d3.select(barChartSvg)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

      var g = svg.append('g')
                 .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      g.selectAll('rect')
         .data(testData)
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
       .call(xAxis);

      g.append('g')
         .attr('class', 'y axis')
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

  return chart;
}
