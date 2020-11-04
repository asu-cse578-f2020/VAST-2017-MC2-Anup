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
                          "translate(" + margin.left + "," + margin.top + ")");
    //y axis
    var y = d3.scaleLinear()
                .domain([minReading,maxReading])        
                .range([height, 0]);
    violinSvg.append("g").call(d3.axisLeft(y));

    //x-axis
    var x = d3.scaleBand()
                .range([ 0, width ])
                .domain(["April", "August", "December"])
                .padding(0.05)     
    violinSvg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    //making histogram
    var histogram = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))    
        .value(d => d)
}