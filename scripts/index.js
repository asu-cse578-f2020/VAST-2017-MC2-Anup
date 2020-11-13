// /* index.js */
// import {drawHeatMap} from './heatMap.js'

// var completeData;

// // This runs when the page is loaded
// document.addEventListener('DOMContentLoaded', function() {
  
//   // Load complete_data before doing anything else
//   Promise.all([d3.csv('../data/complete_data.csv'),d3.csv('../data/sensor_data.csv')])
//           .then(function(values){
    
//     completeData = values[0];
//     sensorData= values[1];
//     drawHeatMap (completeData);
//   });  
// });
