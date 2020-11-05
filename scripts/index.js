/* index.js */
import {drawHeatMap} from './heatMap.js';

var lineWidth;
var lineHeight;
var lineInnerHeight;
var lineInnerWidth;
var lineMargin = { top: 20, right: 60, bottom: 60, left: 100 };

var completeData;
var factory;
var chemical;

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Load complete_data before doing anything else
  Promise.all([d3.csv('../data/complete_data.csv')])
          .then(function(values){
    
    completeData = values[0];
    drawHeatMap (completeData);
    // Load the innovative vis (the first vis)
  });

  // On factory change call heat map for new factory
  d3.select('#factory').on('change', function(){
    drawHeatMap (completeData);
  });

  // On chemical change call heat map for new chemical
  d3.select('#chemical').on('change', function(){
    drawHeatMap (completeData);
  });
  
});
