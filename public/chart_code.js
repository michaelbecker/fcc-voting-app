/*
dataset is really our poll options array.
dataset = [{
    name: { type: String, required: true },
    votes: { type: Number, default: 0 }
    _id: { ... }
  }]
*/
var dataset = [];

const chartWidth = 600;
const chartHeight = 300;

const marginTop = 10;
const marginBottom = 40;
const marginLeft = 50;
const marginRight =10;

// Make glitch syntax highlighter happy :-)
var d3;

function createChart() {
  
  // Need to massage the data a bit for d3...
  var nameIntervals = [];
  var nameRangeWidth = chartWidth - marginRight - marginLeft;
  var barWidth = Math.ceil(nameRangeWidth / dataset.length);
  var nameData = [];
  for (var i = 0; i < dataset.length; i++) {
    nameData.push(dataset[i].name);
    nameIntervals.push(marginLeft + (barWidth * i));
  }
  
  var xScale = d3.scaleOrdinal()
                .domain(nameData)
                .range(nameIntervals);

  var yScale = d3.scaleLinear()
                .domain([0, 
                         d3.max(dataset, function(d) {return d.votes})])
                .range([chartHeight - marginBottom, marginTop]);
  
  var svg = d3.select("#chart")
              .append("svg")
              .attr("width", chartWidth)
              .attr("height", chartHeight);
  
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")               
    .style("opacity", 0);
  
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return xScale(d.name) + 5; })
    .attr("y", function(d, i) { return yScale(d.votes); })
    .attr("width", barWidth - 10)
    .attr("height", function(d) {return chartHeight - marginBottom - yScale(d.votes) + marginTop;})
    .style("stroke", "cornflowerblue")
    .style("fill", "cornflowerblue")
    .on("mouseover", function(d) {
        d3.select(this)
          .style("stroke", "lightblue")
          .style("fill", "lightblue");
    
        div.transition()
          .duration(300)
          .style("opacity", .9);
        
        var popupMsg = "<b>" + d.name + "<br>" + d3.format(".0f")(d.votes) + " Votes</b>";

        /*
        var position = d3.mouse(svg.node());
        div.html( popupMsg )  
          .style("left", (position[0] - marginLeft) + "px")
          .style("top", (position[1] + marginTop + marginBottom) + "px"); 
        */
  
        div.html( popupMsg )  
          .style("left", (window.event.clientX) + "px")
          .style("top", (window.event.clientY) + "px"); 

    })
    .on("mouseout", function() {
        d3.select(this)
          .style("stroke", "cornflowerblue")
          .style("fill", "cornflowerblue");
        div.transition()
          .duration(300)
          .style("opacity", 0);
      });
  
  
  var xAxis = d3.axisBottom()
              .scale(xScale);

  svg.append("g")
    .attr("transform", "translate(" + marginLeft + "," + (chartHeight - marginBottom + marginTop) + ")")
    .call(xAxis);

  svg.append("text")             
      .attr("transform",
            "translate(" + chartWidth / 2 + " ," + 
                           (chartHeight - marginBottom + marginTop + 30) + ")")
      .style("text-anchor", "middle")
      .text("Options");
  
  
  var maxNumVotes = d3.max(dataset, function(d) {return d.votes});
  
  if (maxNumVotes > 10)
    var numYTicks = 10;
  else
    var numYTicks = maxNumVotes;
  
  var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(numYTicks);
  
  
  svg.append("g")
    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
    .call(yAxis);
  
  svg.append("text")
      .attr("y", 0)
      .attr("x", -chartHeight/2)
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of votes");
}


//  Function to query the data.
function getVotingData() {

  var currentUrl = window.location.href;
  var url = currentUrl.replace("poll", "polldata");
  
  $.getJSON(url,
    function(obj, status) {

      dataset = obj.pollOptions;
    
      createChart();
    
      //d3.select("#footer").text(obj.description);
    }
  ).fail(function(d, textStatus, error) {
    console.log("Failed getting data from " + url);
  });
}


$(document).ready(function() {
  getVotingData();
});
