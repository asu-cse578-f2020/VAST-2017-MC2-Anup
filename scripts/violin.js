/*violin plot*/
export {drawViolinPlot}
var violinSvg;
var filteredData;
var margin = {top: 10, right: 30, bottom: 30, left: 40},
var width = 460 - margin.left - margin.right,
var height = 400 - margin.top - margin.bottom;
function drawViolinPlot(data,Chemical)
{
    //filtering out the data first
    filteredData= data.filter(function (d) { return d.Chemical==Chemical})
    filteredData.forEach(d => {
         d.Reading = +d.Reading
    });
    //now getting min and max of reading values
    var maxReading = d3.max(filteredData,function(d){return d.Reading})
    var minReading = d3.min(filteredData,function(d){return d.Reading})
    console.log("max and min", maxReading,minReading)

    
}