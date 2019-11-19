
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 3.9;
var margin = 20;
var labelArea = 110;


var tPadBot = 40;
var tPadLeft = 40;

// Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");


// set the radius
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


// X Y

// X (Bottom) Axis

//  group for x axis labels
svg.append("g").attr("class", "xText");

// selector for x axis group
var xText = d3.select(".xText");

// give xText a transform property
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

// xText appends three text SVG files 
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// Left Axis

// define variables
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// create group for x axis 
svg.append("g").attr("class", "yText");

// selector for x axis 
var yText = d3.select(".yText");


// give xText a transform property
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// append the text
// Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");





// import  CSV 
d3.csv("assets/data/data.csv").then(function(data) {
  // visualize the data
  visualize(data);
});

// create  visualization function
function visualize(theData) {

  // curX and curY will determine what data gets represented in each axis
  // designate defaults here
  var curX = "poverty";
  var curY = "obesity";

  // empty variables for the min and max values of x and y.
 var xMin;
  var xMax;
  var yMin;
  var yMax;

  // set up tool tip rules
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // x key
      var theX;
      // grab the state name
      var theState = "<div>" + d.state + "</div>";
      // get the y value's key and value
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
     
      if (curX === "poverty") {
        // grab the x key 
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
     
        // grab the x key 
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      return theState + theX + theY;
    });

  // call the toolTip function.
  svg.call(toolTip);


  // change the min and max for x
  function xMinMax() {
   
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  function yMinMax() {
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  function labelChange(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // switch the text just clicked to active
    clickedText.classed("inactive", false).classed("active", true);
  }



  xMinMax();
  yMinMax();

   // creating the scales
   var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

   // use the scales to create the axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // determine x and y tick counts
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

  // create grouping for dots and their labels
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // append the circles for each row of data
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // hover rules
    .on("mouseover", function(d) {
      // show the tooltip
      toolTip.show(d, this);
      // highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // remove the tooltip
      toolTip.hide(d);
      // remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

// add state abbreviations to circle markers 
  theCircles
    .append("text")
// return the abbreviation to .text
    .text(function(d) {
      return d.abbr;
    })
    // place the text using the scale
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // hover Rules
    .on("mouseover", function(d) {
      // show the tooltip
      toolTip.show(d);
      // highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // remove tooltip
      toolTip.hide(d);
      // remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });



  // select axes and add click event 
  d3.selectAll(".aText").on("click", function() {
    // save a selection of the clicked text
    var self = d3.select(this);

    // only run on inactive labels
    if (self.classed("inactive")) {
      // get the name and axis saved in label
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      if (axis === "x") {
        // make curX the same as the data name
        curX = name;

        // hange the min and max of the x-axis
        xMinMax();

        // update the domain of x
        xScale.domain([xMin, xMax]);

        // use transtion to update axis
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // update the location of the state circles
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // change the location of the state text
        d3.selectAll(".stateText").each(function() {
          // give each state text the same motion as the matching circle
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // change the classes of the last active label and the clicked label
        labelChange(axis, self);
      }
      else {
        // make curY the same as the data name
        curY = name;

        // change the min and max of the y-axis
        yMinMax();

        // update the domain of y
        yScale.domain([yMin, yMax]);

        // update y axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // update the location of the state circles
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // change the location of the state texts
        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });



  

  // mobile responsiveness

  d3.select(window).on("resize", resize);

  
  function resize() {
    // redefine the width, height and leftTextY (the three variables dependent on the width of the window)
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // apply the width and height to the svg canvas
    svg.attr("width", width).attr("height", height);

    // change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // update the ticks on each axis
    tickCount();

    // update the labels
    xTextRefresh();
    yTextRefresh();

    // update the radius of each dot
    crGet();

    // update the location and radius of the state circles
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    // change the location and size of the state text
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}