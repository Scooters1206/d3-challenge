// Instructor Provided Solution, some syntax may be similar


var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var margin = 20;
var labelArea = 110;
var tPadBot = 40;
var tPadLeft = 40;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();


//Axis Labels
//X Axis label
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

//poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
//age
  xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
//income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

//y axis
//transform based on scale
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

//Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obesity (%)");

//Smoker
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smoker (%)");

//No Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("No Healthcare (%)");

//CSV Import
d3.csv("assets/data/data.csv").then(function(data) 
{ visualize(data)
});

// create function to create graphs
function visualize(theData) {
  var currentX = "poverty";
  var currentY = "obesity";

//create scaleable variables based on data
  var Minx;
  var Maxx;
  var Miny;
  var Maxy;

//tooltips
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      var theX;
      var theState = "<div>" + d.state + "</div>";
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      if (curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theState + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);


//adjust values for different plots
  function MinxMax() {
    Minx = d3.min(theData, function(d) {
      return parseFloat(d[currentX]) * 0.90;
    });

    Maxx = d3.max(theData, function(d) {
      return parseFloat(d[currentX]) * 1.10;
    });
  }

  function MinyMax() {
    Miny = d3.min(theData, function(d) {
      return parseFloat(d[currentY]) * 0.90;
    });

    Maxy = d3.max(theData, function(d) {
      return parseFloat(d[currentY]) * 1.10;
    });
  }

//adjust label on click
  function adjustlabel(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    clickedText.classed("inactive", false).classed("active", true);
  }

//establish x and y values and corresponding scales
  MinxMax();
  MinyMax();

  var xScale = d3
    .scaleLinear()
    .domain([Minx, Maxx])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([Miny, Maxy])
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

// create increments on the axises
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

//append and group axes
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

//append circles
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[currentX]);
    })
    .attr("cy", function(d) {
      return yScale(d[currentY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

//label circles with tooltip
  theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xScale(d[currentX]);
    })
    .attr("dy", function(d) {
      return yScale(d[currentY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

//adjust data per label
  d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);

    if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

//when the label is on the x axis
      if (axis === "x") {
        currentX = name;
        MinxMax();
        xScale.domain([Minx, Maxx]);
        svg.select(".xAxis").transition().duration(300).call(xAxis);

//update plots
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[currentX]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[currentX]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {
//when label is on the y axis
        currentY = name;
        MinyMax();
        yScale.domain([Miny, Maxy]);
        svg.select(".yAxis").transition().duration(300).call(yAxis);

// update plots
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[currentY]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[currentY]) + circRadius / 3;
            })
            .duration(300);
        });

// update classes
        adjustlabel(axis, self);
      }
    }
  });
}