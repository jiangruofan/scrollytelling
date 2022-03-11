/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 600;
  var height = 520;
  var margin = { top: 10, left: 40, bottom: 30, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // Sizing for the grid visualization
  var squareSize = 6;
  var squarePad = 2;
  var numPerRow = width / (squareSize + squarePad);

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // We will set the domain when the
  // data is processed.
  // @v4 using new scale names
  var xBarScale = d3.scaleLinear().range([0, width]);

  var yBarScale = d3
    .scaleBand()
    .paddingInner(0.08)
    .domain([1, 2, 3])
    .range([0, height - 50], 0.1, 0.1);

  // Color is determined just by the index of the bars
  var barColors = { 1: "#008080", 2: "#399785", 3: "#5AAF8C" };

  var xAxisBar = d3.axisBottom().scale(xBarScale);

  //11111111-------------------------------------------------

  var x = d3
    .scaleBand()
    .range([0, width])
    .padding(0.2);

  var y = d3
    .scaleLinear()
    .range([height, 0])

  var xBar = d3.axisBottom().scale(x);

  var yBar = d3.axisLeft().scale(y);

  //22222222222---------------------------------
  var x2 = d3
  .scaleBand()
  .range([0, width])
  .padding(0.2);

var y2 = d3
  .scaleLinear()
  .range([height, 0])

var xBar2 = d3.axisBottom().scale(x2);

var yBar2 = d3.axisLeft().scale(y2);

    


  var activateFunctions = [];

  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {
      console.log(rawData);
      // create svg and give it a width and height
      svg = d3.select(this).selectAll("svg").data([rawData]);
      var svgE = svg.enter().append("svg");
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

      svg.attr("width", width + margin.left + margin.right);
      svg.attr("height", height + margin.top + margin.bottom);

      svg.append("g");

      // this group element will be used to contain all
      // other elements.
      g = svg
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      xBarScale.domain([0, 22]);

      x.domain(rawData.map((val) => val["X"]));
      y.domain([0, d3.max(rawData.map((val) => parseInt(val["Y"])))]);

      x2.domain(rawData.map((val) => val["X2"]));
      y2.domain([0, d3.max(rawData.map((val) => parseInt(val["Y2"])))]);

      setupVis(rawData);

      setupSections();
    });
  };


  var setupVis = function (inputData) {
    let jrf = height - 40
    // axis
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + jrf + ")")
      .call(xAxisBar);
    g.select(".x.axis").style("opacity", 0);

    // new xBar
    g.append("g")
      .attr("class", "xBar")
      .attr("transform", "translate(0," + height + ")")
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .call(xBar);
    g.select("xBar").style("opacity", 0);

    // new YBar
    g.append("g")
      .attr("class", "yBar")
      .call(yBar);
    g.select("yBar").style("opacity", 0);
  
    //2222222----------------------
        // new xBar
        g.append("g")
        .attr("class", "xBar2")
        .attr("transform", "translate(0," + height + ")")
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .call(xBar2);
      g.select("xBar2").style("opacity", 0);
  
      // new YBar
      g.append("g")
        .attr("class", "yBar2")
        .call(yBar2);
      g.select("yBar2").style("opacity", 0);



    //new 1
    g.append("text")
    .attr("class", "infor")
    .attr("x", width / 3)
    .attr("y", height)
    .text("CO2 Removal Rate over 20 years");

    g.selectAll(".infor").attr("opacity", 0);

    // Water Run-Off
    g.append("text")
    .attr("class", "new1")
    .attr("x", width / 2)
    .attr("y", height / 3)
    .text("Water Run-Off");

    g.selectAll(".new1").attr("opacity", 0);

    // count openvis title
    g.append("text")
      .attr("class", "title openvis-title")
      .attr("x", width / 2)
      .attr("y", height / 3)
      .text("Benefits of Community Trees & Forests");


    g.selectAll(".openvis-title").attr("opacity", 0);

    // count filler word count title
    g.append("text")
      .attr("class", "title count-title highlight")
      .attr("x", width / 2)
      .attr("y", height / 3)
      .text(" Pollution Reduction");


    g.selectAll(".count-title").attr("opacity", 0);


    var bars = g.selectAll(".bar").data(inputData);
    var barsE = bars.enter().append("rect").attr("class", "bar");

    bars = bars
      .merge(barsE)
      .attr("x", 0)
      .attr("y", function (d, i) {
              //CHANGE REQUIRED
        console.log(yBarScale(parseInt(d.treeid)));
        return yBarScale(parseInt(d.treeid));
      })
      .attr("fill", function (d, i) {
              //CHANGE REQUIRED
        return barColors[parseInt(d.treeid)];
      })
      .attr("width", 0)
      .attr("height", yBarScale.bandwidth());

      var barText = g.selectAll(".bar-text").data(inputData);
      barText
        .enter()
        .append("text")
        .attr("class", "bar-text")
        .text(function (d) {
                //CHANGE REQUIRED
          return d.label
        })
        .attr("x", 0)
        .attr("dx", 15)
        .attr("y", function (d, i) {
                //CHANGE REQUIRED
          return yBarScale(parseInt(d.treeid));
        })
        .attr("dy", yBarScale.bandwidth() / 1.2)
        .style("font-size", "30px")
        .attr("fill", "white")
        .attr("opacity", 0);


    //new------------------------------
    var bars1 = g.selectAll(".bar1").data(inputData);
    var barsE1 = bars1.enter().append("rect").attr("class", "bar1");

    bars1 = bars1
      .merge(barsE1)
      .attr("x", d => x(d.X))
      .attr("y", d => y(d.Y))
      .attr("fill", "#69b3a2")
      .attr("width", x.bandwidth())
      .attr("height", 0);

    //new 222222-------------------
    var bars2 = g.selectAll(".bar2").data(inputData);
    var barsE2 = bars2.enter().append("rect").attr("class", "bar2");

    bars2 = bars2
      .merge(barsE2)
      .attr("x", d => x2(d.X2))
      .attr("y", d => y2(d.Y2))
      .attr("fill", "#69b3a2")
      .attr("width", x2.bandwidth())
      .attr("height", 0);

  };

  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showFillerTitle;
    activateFunctions[2] = showBar;
    activateFunctions[3] = showNew;
    activateFunctions[4] = showNew2;
    activateFunctions[5] = showNew3;

    for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
  };

  function showNew() {
    g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    g.selectAll(".bar").transition().duration(600).attr("width", 0);

    hideAxis(xAxisBar);
    hideXBar();
    hideYBar();
    g.selectAll(".infor").transition().duration(0).attr("opacity", 0);
    g.selectAll(".bar1").transition().duration(600).attr("height", 0);

    g.selectAll(".new1").transition().duration(0).attr("opacity", 1);

  }

  function showNew2() {
    g.selectAll(".new1").transition().duration(0).attr("opacity", 0);
    g.selectAll(".bar2").transition().duration(600).attr("height", 0);
    showXBar(xBar);
    showYBar(yBar);
    hideYBar2();
    hideXBar2();
    g.selectAll(".bar1")
    .transition()
    .delay(function (d, i) {
      return 300 * (i + 1);
    })
    .duration(600)
    .attr("height", d => height - y(d.Y));
  }

  function showNew3() {
    g.selectAll(".bar1").transition().duration(600).attr("height", 0);
    hideXBar();
    hideYBar();

    showYBar2(yBar2);
    showXBar2(xBar2);

    g.selectAll(".bar2")
    .transition()
    .delay(function (d, i) {
      return 300 * (i + 1);
    })
    .duration(600)
    .attr("height", d => {
      return height - y2(d.Y2)});

  }

  function showTitle() {
    g.selectAll(".count-title").transition().duration(0).attr("opacity", 0);
    hideYBar(yBar);

    g.selectAll(".openvis-title")
      .transition()
      .duration(600)
      .attr("opacity", 1.0);
  }


  function showFillerTitle() {
    g.selectAll(".infor").transition().duration(0).attr("opacity", 0);

    g.selectAll(".openvis-title").transition().duration(0).attr("opacity", 0);

    g.selectAll(".bar-text").transition().duration(0).attr("opacity", 0);

    g.selectAll(".bar").transition().duration(600).attr("width", 0);

    hideAxis(xAxisBar);

    g.selectAll(".count-title").transition().duration(600).attr("opacity", 1.0);
  }


  function showBar() {
    // ensure bar axis is set
    showAxis(xAxisBar);
    g.selectAll(".infor").transition().duration(0).attr("opacity", 1);
    g.selectAll(".new1").transition().duration(0).attr("opacity", 0);

    g.selectAll(".count-title").transition().duration(0).attr("opacity", 0);

    g.selectAll(".bar")
      .transition()
      .delay(function (d, i) {
        return 300 * (i + 1);
      })
      .duration(600)
      .attr("width", function (d) {
        return xBarScale(parseInt(d.score));
      });

    g.selectAll(".bar-text")
      .transition()
      .duration(600)
      .delay(1200)
      .attr("opacity", 1);
  }

  /**
   * showAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  function showAxis(axis) {
    g.select(".x.axis")
      .call(axis)
      .transition()
      .duration(500)
      .style("opacity", 1);
  }

  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
  function hideAxis() {
    g.select(".x.axis").transition().duration(500).style("opacity", 0);
  }

  function showXBar(xBar) {
    g.select(".xBar")
    .call(xBar)
    .transition()
    .duration(500)
    .style("opacity", 1);
  }

  function hideXBar() {
    g.select(".xBar").transition().duration(500).style("opacity", 0);
  }

  function showYBar(yBar) {
    g.select(".yBar")
    .call(yBar)
    .transition()
    .duration(500)
    .style("opacity", 1);
  }

  function hideYBar() {
    g.select(".yBar").transition().duration(500).style("opacity", 0);
  }

  function showXBar2(xBar2) {
    g.select(".xBar2")
    .call(xBar2)
    .transition()
    .duration(500)
    .style("opacity", 1);
  }

  function hideXBar2() {
    g.select(".xBar2").transition().duration(500).style("opacity", 0);
  }

  function showYBar2(yBar2) {
    g.select(".yBar2")
    .call(yBar2)
    .transition()
    .duration(500)
    .style("opacity", 1);
  }

  function hideYBar2() {
    g.select(".yBar2").transition().duration(500).style("opacity", 0);
  }


  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = activeIndex - lastIndex < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};

/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  //This calls the chart() method in the scrollVis()
  //Chart function contains the main rendering functions
  d3.select("#vis").datum(data).call(plot);

  // setup scroll functionality
  var scroll = scroller().container(d3.select("#graphic"));

  // pass in .step selection as the steps
  scroll(d3.selectAll(".step"));

  // setup event handling
  //This does not need any update
  scroll.on("active", function (index) {
    // highlight current step text
    d3.selectAll(".step").style("opacity", function (d, i) {
      return i === index ? 1 : 0.1;
    });

    // activate current section
    plot.activate(index);
  });

  scroll.on("progress", function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.csv("data/testdata 2.csv", display);
