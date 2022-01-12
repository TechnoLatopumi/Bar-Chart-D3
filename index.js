//url for gdp array
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();
//will be used to take values to draw later
let data;
let values;
//variables which will be used later for scaling based on canvas dimension using the base data from github freecodeacamp
let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;
//dimension for canvas
let width = 800;
let height = 600;
let padding = 40;
//use this variables to shorthen d3 selection
let svg = d3.select("svg");
//making canvas using declared dimension
let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};
//scalling data based on canvas range, will be using domain and range method later
let generateScales = () => {
  heightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      }),
    ])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  let datesArray = values.map((item) => {
    return new Date(item[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      }),
    ])
    .range([height - padding, padding]);
};

let drawBars = () => {
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto");
  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - 2 * padding) / values.length)
    .attr("data-date", (item) => {
      return item[0];
    })
    .attr("data-gdp", (item) => {
      return item[1];
    })
    .attr("height", (item) => {
      return heightScale(item[1]);
    })
    .attr("x", (item, index) => {
      return xScale(index);
    })
    .attr("y", (item) => {
      return height - padding - heightScale(item[1]);
    })
    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");

      tooltip.text(item[0] + ": $" + item[1] + "BILLION");

      document.querySelector("#tooltip").setAttribute("data-date", item[0]);
    })
    .on("mouseout", (item) => {
      tooltip.transition().style("visibility", "hidden");

      tooltip.text(item[0]);
    });
};

let generateAxes = () => {
  //we use d3.axisbottom to create our x-axis provide scale
  let xAxis = d3.axisBottom(xAxisScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)");
};
//data request
req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  console.log(values);
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
};
req.send();
