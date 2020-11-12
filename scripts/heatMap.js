/* heatMap.js */
export {drawHeatMap}

var heatMapSvg;
var factoryVal = {
	'RFE':'Roadrunner Fitness Electronics',
    'KOF':'Kasios Office Furniture',
    'RCT':'Radiance ColourTek',
    'ISB':'Indigo Sol Boards'
}

// div for tooltip
var div = d3.select("body")
		    .append("div")
		    .attr("class", "tooltip")
			.style("opacity", 0);
			
var chemical, factory;
var margin = { top: 10, right: 10, bottom: 10, left: 10 }
var width = 475 - margin.left - margin.right
var height = 250 - margin.top - margin.bottom

function drawHeatMap(data){

	d3.select("#heatMapSvg").remove()
	heatMapSvg = d3.select("#heatmap").append("svg")
					.attr("id", "heatMapSvg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.attr("transform", `translate(${margin.left}, ${margin.top})`)

    factory = d3.select("#factory").node().value;
    chemical = d3.select('input[name="chemical"]:checked').node().value;
	var heatMapData = {};

	// filter the data
	data.forEach(function(d){
		if(d['highest_contributor'] == factoryVal[factory]){
			if(d['Chemical'] == chemical){
				var date = d['Date Time '].split(" ")[0];

				if(date in heatMapData){
					heatMapData[date][0]['total_reading'] +=  (+d['Reading']);
					heatMapData[date][0]['count'] ++;
				}
				else{
					var val = [];
					val.push({
						total_reading: +d['Reading'],
						count: 1
					})
					heatMapData[date] = val
				}
				
			}
		}
	});

	var data = []
	for(var _key in heatMapData){
		data.push({
			'day': _key,
			'value': parseInt((+heatMapData[_key][0]['total_reading'] / 
								+heatMapData[_key][0]['count'])*100)
		})
	}

	drawCalender(data);
}

function drawCalender(data){
	
	var weeksInMonth = function(month){
		var m = d3.timeMonth.floor(month)
		return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
	}

	var months = [d3.timeMonth(new Date(2016, 3, 1)),
				 d3.timeMonth(new Date(2016, 7, 1)), 
				 d3.timeMonth(new Date(2016, 11, 1))];

	var cellMargin = 4, cellSize = 25;

	var day = d3.timeFormat("%w"),
		week = d3.timeFormat("%U"),
		format = d3.timeFormat("%Y-%m-%d"),
		titleFormat = d3.utcFormat("%a, %d-%b"),
		monthName = d3.timeFormat("%B")
	
	var reading = d3.nest()
					.key(function(d) { 
						return d.day; 
					})
					.rollup(function(leaves) {
						return d3.sum(leaves, function(d){ return parseInt(d.value); });
					})
					.object(data);

	var scale = d3.scaleLinear()
		.domain(d3.extent(data, function(d) { 
			return parseInt(d.value); 
		}))
		.range([0, 1]); 
		
	var tooltipHtml = d =>  titleFormat(new Date(d)) + ":  " + reading[d]/100; 

	var calenderWidth = function(d) {
		var columns = weeksInMonth(d);
		return ((cellSize * columns) + (cellMargin * (columns + 1)) );
	}
	var calenderHeight = ((cellSize * 7) + (cellMargin * 8) + 20);
	var calender = heatMapSvg
					.selectAll(".month")
					.data(months)
					.enter()
					.append("g")
					.attr("class", "month")
					.attr("height", calenderHeight)
					.attr("width", function(d) {return calenderWidth(d);})
					.attr("transform", (d,i)=>`translate(${i*calenderWidth(d)}, ${0})`)
					.append("g")

	calender.append("text")
		.attr("class", "month-name")
		.attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
		.attr("x", function(d) {
			var columns = weeksInMonth(d);
			return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
		})
		.attr("text-anchor", "middle")
		.text(function(d) { 
			return monthName(d); 
		})

	var rect = calender.selectAll("rect.day")
		.data(function(d, i) { 
			return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); 
		})
		.enter()
		.append("rect")
		.attr("class", "day")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("rx", 3).attr("ry", 3)
		.attr("fill", '#eaeaea')
		.attr("y", function(d) { 
			return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; 
		})
		.attr("x", function(d) { 
			return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + 
				((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; 
		})
		.datum(format);

	rect
		.filter(function(d) { 
			return d in reading; 
		})
		.style("fill", function(d) { return d3.interpolatePuBu(scale(reading[d])); })
		.on("mouseover", function(d) {
			d3.select(this)
				.style('stroke', 'black')
				.style('stroke-width', 1);

			div.transition()
				.duration(50)
				.style("opacity", 1);

			div.html(tooltipHtml(d))
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px");

		})
		.on('mousemove', function(d) {
			div.transition()
				.duration(50)
				.style("opacity", 1);

			div.html(tooltipHtml(d))
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px");
		})
		.on('mouseout', function(d) {
			d3.select(this)
				.style('stroke-width', 0)
			//Makes the new div disappear:
			div.transition()
				.duration(50)
				.style("opacity", 0);
		});
	
}
