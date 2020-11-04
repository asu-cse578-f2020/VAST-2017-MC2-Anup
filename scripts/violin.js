/*violin plot*/
export {drawViolinPlot}
var violinSvg;
var filteredData;
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