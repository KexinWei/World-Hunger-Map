if (d3.charts === null || typeof(d3.charts) !== 'object') { d3.charts = {}; }
d3.charts.sparkline = function () {
  var my = d3.ext.base();

  my.accessor('color', 'steelblue')
    .accessor('height', 20)
    .accessor('width', 100)
    .accessor('xAxis', 'x')
    .accessor('yAxis', 'y');

  // Use d3 style setters for the following
  var margin = {top: 2, right: 2, bottom: 2, left: 2},
      chartData = void 0,
      lines = [];

  // Declare d3 variables that will need through out (Globals)
  var y = d3.scaleLinear(),
      x = d3.scaleLinear(),
      line = d3.line(),
      chart = void 0,
      svg = void 0;


  // todo seems like the lines are not updating
  my.setup = function(data) {
    lines = data.map(function(d) { return { x: d[my.xAxis()], y: d[my.yAxis()] }; } );
  };

  my.chart = function() {
    var xDomain = d3.extent(lines, function(d) { return d.x });
    var yDomain = d3.extent(lines, function(d) { return d.y });
    x.domain(xDomain).range([0,my.chartWidth(my.w(), margin)]);
    y.domain(yDomain).range([my.chartHeight(my.h(), margin), 0]);

    line.x(function(d) { return x(d.x) })
        .y(function(d) { return y(d.y) });

    var sparky = chart.selectAll('.sparkline').data([lines]);
    sparky.enter()
        .append('path')
        .attr('class', 'sparkline')
        .transition().duration(3000)
        .attr('fill', 'none')
        .attr('stroke', my.color())
        .attr('d', function(d) { return  line(d) } );
    sparky.exit().remove();

    var last = lines[lines.length - 1];

    var dot = chart.selectAll('.dot').data([last]);
    dot.enter()
        .append('circle')
        .attr('r', 2)
        .attr('fill', 'white')
        .attr('fill-opacity', 1)
        .attr('stroke', my.color())
        .attr('class', 'dot')
        .attr('cx', x(last.x))
        .attr('cy', y(last.y));
    dot.enter()
                .append('text')
                .attr('fill', 'white')
                .attr('x', x(last.x)-15)
                .attr('y', y(last.y)-20)
                .text(last.y);
    dot.exit().remove();
  };

  my.draw = function(selection) {
    selection.each(function(data) {
      my.setup(data);
      svg = my.setupSVG(this, my.width(), my.height());
      chart = my.setupChart(svg, margin);
      my.chart();
    });
  };

  return my;
}
