var scatterPlotMargin = { top: 10, right: 40, bottom: 40, left: 60 }

var scatterPlotWidth = 600 - scatterPlotMargin.left - scatterPlotMargin.right;
var scatterPlotHeight = 500 - scatterPlotMargin.top - scatterPlotMargin.bottom;

var scatterPlotSvg = d3.select("#innovative_dataviz")
    .append("svg")
    .attr("width", scatterPlotWidth + scatterPlotMargin.left + scatterPlotMargin.right)
    .attr("height", scatterPlotHeight + scatterPlotMargin.top + scatterPlotMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + scatterPlotMargin.left + "," + scatterPlotMargin.top + ")");;

d3.select("#innovative_dataviz").append("input")
.attr("class", "playPause")
.attr("type","button")
.attr("value", "Start")
.attr("onClick","toggleAnimation()");

compass = d3.select("#innovative_dataviz").select("svg").append("g")
.attr("transform", "translate("+0 +","+(scatterPlotHeight+100)+")")

// data
var data;
var windData;
// svg elements
var gDots;
var ind = 0;
// axes
var x = d3.scaleLinear()
    .range([0, scatterPlotWidth]);

var y = d3.scaleLinear()
    .range([scatterPlotHeight, 0]);

const t = d3.transition().duration(100)

const colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

var running = false;
var timer;

document.addEventListener('DOMContentLoaded', function () {
    drawInitialViz()
});

function drawInitialViz() {
    drawScatterPlot()
    loadData()
}

function loadData() {
    Promise.all([d3.csv('data/sensor_locations.csv'),
                 d3.csv('data/windData.csv')]).then(function (values) {
        data = values[0]
        windData = values[1];

        x.domain([0, d3.max(data, function (d) {
            return +d["x"];
        })]);

        y.domain([0, d3.max(data, function (d) {
            return +d["y"];
        })]);

        drawCircles()
        drawCompass([windData[ind]])
    });
}

// Draw the map in the #map svg
function drawScatterPlot() {
    scatterPlotSvg.selectAll("*").remove()

    scatterPlotSvg.append("text")
        .attr("x", (scatterPlotWidth / 2))
        .attr("y", 10 - (scatterPlotMargin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("font-family", "sans-serif")
        .style("text-decoration", "underline")
        .attr("font-weight", 700)
        .text("Sensor Locations");

    scatterPlotSvg.append("g")
        .attr("transform", "translate(0," + scatterPlotHeight + ")")
        .call(d3.axisBottom(x));

    scatterPlotSvg.append("g")
        .call(d3.axisLeft(y));

    scatterPlotSvg.append("text")
        .attr("transform",
            "translate(" + (scatterPlotWidth / 2) + " ," +
            (scatterPlotHeight + scatterPlotMargin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("font-family", "sans-serif")
        .attr("font-weight", 400)
        .text("X");

    scatterPlotSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", 0 - (scatterPlotHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("font-family", "sans-serif")
        .attr("font-weight", 400)
        .text("Y");

    gDots = scatterPlotSvg.append("g")
    // Add dots
    drawCircles()
}

function drawCircles() {
    gDots.selectAll('g')
        .data(data)
        .join(
            enter => enterCircles(enter, t),
            update => updateCircles(update, t),
            exit => exitCircles(exit, t)
        )

    gDots.selectAll('circle')
        .on('mouseover', function (d, i) {
            tooltip.style("opacity", 1);
            tooltip.html(d.country)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })
        .on('mouseout', function (d, i) {
            tooltip.style("opacity", 0);
        })
}

function enterCircles(enter, t) {
    enter.append('g')
        .call(g =>
            g
                .append("circle")
                .attr("class", "circles")
                .attr("r", 18)
                .transition(t)
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .style("fill", function (d) { return colorScale(d.x + "," + d.y) })
                .attr('stroke', '#000000')
                .attr('stroke-width', 1)
                .attr("opacity", 0.8)
        )
        .call(g =>
            g.append('text')
                .style('fill', 'black')
                .attr("text-anchor", "middle")
                .transition(t)
                .text(function (d) {
                    return d.index;
                })
                .attr("x", function (d) {
                    return x(d.x);
                })
                .attr("y", function (d) {
                    return y(d.y);
                })
        )
}

function updateCircles(update, t) {
    update
        .call(g => g.select('text')
            .attr("text-anchor", "middle")
            .transition(t)
            .text(function (d) {
                return d.index;
            })
            .attr("x", function (d) {
                return x(d.x);
            })
            .attr("y", function (d) {
                return y(d.y);
            })
        )
        .call(g => g.select('circle')
            .transition(t)
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { return y(d.y); })
        )
}

function exitCircles(exit, t) {
    exit
        .call(exit => exit
            .transition()
            .duration(200)
            .ease(d3.easeCubic)
            .attr("r", 0)
            .remove())
}

function drawCompass(compassData){

  compass.selectAll('g')
        .data(compassData)
        .join(
            enter => enterCompass(enter, t),
            update => updateCompass(update, t)
        )
}

function updateCompass(update, t) {

    update.select('#speed')
        .attr("text-anchor", "middle")
        .text(d=> "Wind Speed:" + d.speed)

    update.select('#direction')
        .attr("text-anchor", "middle")
        .text(d=> "Wind direction:" + d.direction)
        
    update.select("line")
    .transition()
    .duration(500)
    .attr('transform',d => 'rotate('+ d.direction + ' 100 100)')
    .end()
    .then(circleTransitions);
}

function enterCompass(enter, t) {
    glyph = enter.append('g')
        
    glyph.append("circle")
        .attr("transform", "translate(100,100)")
        .attr("r",50)
        .attr("stroke","black")
        .attr("fill", "white")

    glyph.append("text")
    .attr("transform", "translate(100,90)")
    .attr("id", "speed")
    .style("text-anchor", "middle")
    .style("font-size", "8px") 
    .style("font-weight", "700")
    .style("font-family", "sans-serif")
    .style("fill", "gray")
    .style("opacity", 0.5)
    .text(d=> "Wind Speed:" + d.speed)

    glyph.append("text")
    .attr("transform", "translate(100,110)")
    .attr("id", "direction")
    .style("text-anchor", "middle")
    .style("font-size", "8px") 
    .style("font-weight", "700")
    .style("font-family", "sans-serif")
    .style("fill", "gray")
    .style("opacity", 0.5)
    .text(d=> "Wind direction:" + d.direction)
    
    glyph.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 6)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("markerUnits","userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 20 6 0 12 3 6")
    .style("fill", "black")

    glyph.append('line')
    .attr('class', 'gaugeChart-needle')
    .attr("x1", 100)
    .attr("y1", 145)
    .attr("x2", 100)
    .attr("y2", 70)
    .attr('stroke-width', 1)
    .attr("stroke","black")
    .attr("marker-end", "url(#triangle)")
    .attr('transform',d => 'rotate('+ d.direction + ' 100 100)')
}

function stopAnimation(){
    d3.select('.playPause').attr('value', "Start");
}

function toggleAnimation() {
    const currentState = d3.select('.playPause').attr('value');
    const updatedLabel = currentState == 'Start' ? 'Stop' : 'Start';
    d3.select('.playPause').attr('value', updatedLabel);
    circleTransitions()
}

function circleTransitions() {
    
    if(d3.select('.playPause').attr('value') == 'Stop' && ind < windData.length-1) {
        ind = ind+1;
        drawCompass([windData[ind]]);
    }
    else if (ind == windData.length-1){
        ind = 0;
        stopAnimation();
    }
    else stopAnimation();
}