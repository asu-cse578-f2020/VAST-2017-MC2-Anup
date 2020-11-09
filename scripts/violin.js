/*violin plot*/
export {drawViolinPlot}
var violinSvg;
var filteredData;
var months=["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
var margin = {top: 10, right: 30, bottom: 30, left: 40};
var width = 460 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
function drawViolinPlot(data,Chemical)
{
    //filtering out the data first
    filteredData= data.filter(function (d) { return d.Chemical==Chemical})
    filteredData.forEach(d => {
         d.Reading = +d.Reading;
         d.Month = new Date(d.DateTime);
         d.Month = months[d.Month.getMonth()];
    });
    
    filteredData= outliers(filteredData)
    console.log("vioilin data",filteredData)
    //now getting min and max of reading values
    var maxReading = d3.max(filteredData,function(d){return d.Reading})
    var minReading = d3.min(filteredData,function(d){return d.Reading})
    console.log("max and min", maxReading,minReading)
    //svg declaration
    violinSvg = d3.select("#violin")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                          "translate(" + (margin.left+margin.top) + "," + margin.top + ")");
    //y axis
    var y = d3.scaleLog()
    .domain([minReading,maxReading])
    .range([height, 0])
    violinSvg.append("g").call(d3.axisLeft(y).ticks(11,".1n"))

    //x-axis
    var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(["April", "August", "December"])
            .paddingInner(1)
            .paddingOuter(.5)
  violinSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
   
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Month;})
        .rollup(function(d) {
          var q1 = d3.quantile(d.map(function(g) { return g.Reading;}).sort(d3.ascending),.25)
          var median = d3.quantile(d.map(function(g) { return g.Reading;}).sort(d3.ascending),.5)
          var q3 = d3.quantile(d.map(function(g) { return g.Reading;}).sort(d3.ascending),.75)
          var interQuantileRange = q3 - q1
          var min = d3.min(d.map(function(g){return g.Reading}))
          var max = d3.max(d.map(function(g){return g.Reading}))
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(filteredData)
    console.log("sum stat",sumstat)
    violinSvg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.key))})
        .attr("x2", function(d){return(x(d.key))})
        .attr("y1", function(d){return(y(d.value.min))})
        .attr("y2", function(d){return(y(d.value.max))})
        .attr("stroke", "black")
        .style("width", 40)
        var boxWidth = 70
    violinSvg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
            .attr("x", function(d){return(x(d.key)-boxWidth/2)})
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
    violinSvg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
            .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
            .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
            .attr("y1", function(d){return(y(d.value.median))})
            .attr("y2", function(d){return(y(d.value.median))})
            .attr("stroke", "black")
            .style("width", 80)
    violinSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "8px")
        .style("font-weight", "700")
        .style("font-size", "12px")
        .attr("font-family","sans-serif")
        .style("text-anchor", "middle")
        .text("Chemical Reading Value");
    violinSvg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height - (margin.bottom -75)) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "700" )
        .style("font-size", "12px")
        .attr("font-family","sans-serif")
        .text("Months");

}
function outliers(filteredData)
{
    filteredData.sort(function(a,b){
        return a.Reading-b.Reading
    })
    //console.log("sorted",filteredData)
    var l = filteredData.length;
    var low = Math.round(l * 0.025);
    var high = l - low;
    var data2 = filteredData.slice(low,high);
    return data2
}