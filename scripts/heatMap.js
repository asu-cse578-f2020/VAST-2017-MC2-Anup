/* heatMap.js */
export {drawHeatMap}

var heatMapSvg;
var factoryVal = {
	'RFE':'Roadrunner Fitness Electronics',
    'KOF':'Kasios Office Furniture',
    'RCT':'Radiance ColourTek',
    'ISB':'Indigo Sol Boards'
}
var chemical;

function drawHeatMap(data){

    factory = d3.select("#factory").node().value;
    chemical = d3.select('input[name="chemical"]:checked').node().value;
	console.log(factory, chemical)
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
			'value': parseInt((+heatMapData[_key][0]['total_reading'] / +heatMapData[_key][0]['count'])*100)
		})
	}

	drawCalender(data);
}

function drawCalender(dateData){
	d3.selectAll(".month").remove()
	console.log(dateData)
	var weeksInMonth = function(month){
		var m = d3.timeMonth.floor(month)
		return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
	}

	var minDate = new Date(2016, 3, 1)
	console.log(minDate)
	var maxDate = new Date(2016, 12, 31)

	var cellMargin = 2,
      cellSize = 20;

	var day = d3.timeFormat("%w"),
		week = d3.timeFormat("%U"),
		format = d3.timeFormat("%Y-%m-%d"),
		titleFormat = d3.utcFormat("%a, %d-%b"),
		monthName = d3.timeFormat("%B"),
		months = d3.timeMonth.range(d3.timeMonth(minDate), d3.timeMonth(maxDate));

	var svg = d3.select("#heatmap").selectAll("svg")
		.data(months)
		.enter().append("svg")
		.attr("class", "month")
		.attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) )
		.attr("width", function(d) {
		var columns = weeksInMonth(d);
			return ((cellSize * columns) + (cellMargin * (columns + 1)));
		})
		.append("g")


	svg.append("text")
		.attr("class", "month-name")
		.attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
		.attr("x", function(d) {
		var columns = weeksInMonth(d);
		return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
		})
		.attr("text-anchor", "middle")
		.text(function(d) { return monthName(d); })


	var rect = svg.selectAll("rect.day")
		.data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
		.enter().append("rect")
		.attr("class", "day")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("rx", 3).attr("ry", 3) // rounded corners
		.attr("fill", '#eaeaea') // default light grey fill
		.attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
		.attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
		.on("mouseover", function(d) {
		d3.select(this).classed('hover', true);
		})
		.on("mouseout", function(d) {
		d3.select(this).classed('hover', false);
		})
		.datum(format);

	rect.append("title")
		.text(function(d) { return titleFormat(new Date(d)); });

	var lookup = d3.nest()
		.key(function(d) { return d.day; })
		.rollup(function(leaves) {
		return d3.sum(leaves, function(d){ return parseInt(d.value); });
		})
		.object(dateData);

	var scale = d3.scaleLinear()
		.domain(d3.extent(dateData, function(d) { return parseInt(d.value); }))
		.range([0.2,1]); 
		
	rect.filter(function(d) { return d in lookup; })
		.style("fill", function(d) { return d3.interpolateYlGn(scale(lookup[d])); })
		.select("title")
		.text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });

	
}
