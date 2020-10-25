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

	heatMapSvg = d3.select("#heatMap");
	//chemical = 'Methylosmolene';
    factory = d3.select("#factory").node().value;
    chemical = d3.select('input[name="chemical"]:checked').node().value;
	console.log(data, factory, chemical)
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

	plotHeatMap(heatMapData);

}

function plotHeatMap(data){

	console.log(data);
}
