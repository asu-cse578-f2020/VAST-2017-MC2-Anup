let margin = {top: 10, right: 30, bottom: 30, left: 60}
let width = 460 - margin.left - margin.right
let height = 400 - margin.top - margin.bottom
const timeConv = d3.timeParse("%Y-%m-%d");
let data


let svg = d3.select("#linechart")
    .append("div")
    .style("float","left")
    .style("width", "10%")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


document.addEventListener("DOMContentLoaded", async function () {
    let values = await Promise.all([
        d3.csv("./data/processed_sensor_data_line_chart.csv"),
    ]);
    data = values[0]

    draw()

});

function draw() {
    let xScale = d3.scaleTime()
    .range([ 0, width ])
    .domain(d3.extent(data, function(d) { 
        return timeConv(d.Date) 
    }))

    let yScale = d3.scaleLinear()
    .range([ height, 0 ])
    .domain([d3.min(data, function (d) {
        return +d.Reading
    }), d3.max(data, function(d) { 
        return +d.Reading; 
    })])

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).ticks(3));

    svg.append("g")
        .call(d3.axisLeft(yScale));


    var lineGen = d3.line()
        .x(function(d) { 
            return xScale(timeConv(d.Date)); 
        })
        .y(function(d) { 
            return yScale(+d.Reading); 
        })
        .curve(d3.curveBasis);


    let AGOC_3A_data = []
    let Appluimonia_data = []
    let Chlorodinine_data = []
    let Methylosmolene_data = []

    data.forEach(element => {
        if (element['Chemical'] == 'AGOC-3A') {
            AGOC_3A_data.push(element)
        } else if (element['Chemical'] == 'Appluimonia') {
            Appluimonia_data.push(element)
        } else if (element['Chemical'] == 'Chlorodinine') {
            Chlorodinine_data.push(element)
        } else if (element['Chemical'] == 'Methylosmolene') {
            Methylosmolene_data.push(element)
        }
    })

    svg.append('svg:path')
        .attr('d', lineGen(AGOC_3A_data))
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr("id", "line-AGOC3A");

    svg.append('svg:path')
        .attr('d', lineGen(Appluimonia_data))
        .attr('stroke', 'blue')
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr("id", "line-APPLUIMONIA");

    svg.append('svg:path')
        .attr('d', lineGen(Chlorodinine_data))
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr("id", "line-CHLORODININE");

    svg.append('svg:path')
        .attr('d', lineGen(Methylosmolene_data))
        .attr('stroke', 'orange')
        .attr('stroke-width', 3)
        .attr('fill', 'none')
        .attr("id", "line-METHYLOSMOLENE")
}



svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width-200)
    .style("font-size", "14px") 
    .style("font-weight", "bold")
    .style("font-family", "sans-serif")  
    .attr("y", 380)
    .attr("dy", ".75em")
    .attr("transform", "rotate(0)")

    .text("Time");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -150)
    .style("font-size", "14px") 
    .style("font-weight", "bold") 
    .style("font-family", "sans-serif") 
    .attr("y", -50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Readings");


svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 10 )
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("font-weight", "bold") 
    .style("font-family", "sans-serif") 
    .style("text-decoration", "underline")  
    .text("Chemical Readings vs Time");


document.getElementById("text-AGOC3A").addEventListener('click',function (){
   var agocLine = document.getElementById('line-AGOC3A');
   var agocText = document.getElementById('text-AGOC3A');
   if (agocLine.style.visibility === 'hidden' ){ 
        agocLine.style.visibility = 'visible';
        agocText.style.opacity = 1;
   }
    else {
        agocLine.style.visibility = 'hidden';
        agocText.style.opacity = 0.2;
    }
}); 

document.getElementById("text-APPLUIMONIA").addEventListener('click',function (){
    var appluimoniaLine = document.getElementById('line-APPLUIMONIA');
    var appluimoniaText = document.getElementById('text-APPLUIMONIA');
    if (appluimoniaLine.style.visibility === 'hidden' ){ 
        appluimoniaLine.style.visibility = 'visible';
        appluimoniaText.style.opacity = 1;
    }
     else {
        appluimoniaLine.style.visibility = 'hidden';
        appluimoniaText.style.opacity = 0.2;
     }
 }); 

 document.getElementById("text-CHLORODININE").addEventListener('click',function (){
    var chlorodinineLine = document.getElementById('line-CHLORODININE');
    var chlorodinineText = document.getElementById('text-CHLORODININE');
    if (chlorodinineLine.style.visibility === 'hidden' ){ 
        chlorodinineLine.style.visibility = 'visible';
        chlorodinineText.style.opacity = 1;
    }
     else {
        chlorodinineLine.style.visibility = 'hidden';
        chlorodinineText.style.opacity = 0.2;
     }
 }); 

 document.getElementById("text-METHYLOSMOLENE").addEventListener('click',function (){
    var methylosmoleneLine = document.getElementById('line-METHYLOSMOLENE');
    var methylosmoleneText = document.getElementById('text-METHYLOSMOLENE');
    if (methylosmoleneLine.style.visibility === 'hidden' ){ 
        methylosmoleneLine.style.visibility = 'visible';
        methylosmoleneText.style.opacity = 1;
    }
     else {
        methylosmoleneLine.style.visibility = 'hidden';
        methylosmoleneText.style.opacity = 0.2;
     }
 }); 