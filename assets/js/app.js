// @TODO: YOUR CODE HERE!
let cData=[];
let xaxd='poverty';  // x axis valyes default is poverty
let yaxd='healthcare'; // y axis values default to healthcare

function parseNums(){
    cData.forEach(function(d){
        d.income=parseFloat(d.income);
        d.smokes=parseFloat(d.smokes);
        d.healthcare=parseFloat(d.healthcare);
        d.poverty=parseFloat(d.poverty);
        d.obesity=parseFloat(d.obesity);
        d.age=parseFloat(d.age);
    });
}
function plotplot(xax, yax) {
    var svgArea = d3.select("scatter").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    } 
    let svgWidth = window.innerWidth;
    let svgHeight = window.innerHeight;
    const margin = { top: 50, bottom: 50, right: 50, left: 50 };
    let height = svgHeight - margin.top - margin.bottom;
    let width = svgWidth - margin.left - margin.right;
  
    let svg = d3.select("#scatter")
      .append("svg")
      .attr("height", svgHeight*.75)
      .attr("width", svgWidth*.75);
  
    let chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    parseNums()

    //console.table(cData);

    let xScale = d3.scaleLinear()
    .domain(d3.extent(cData, d => d[xax]))
    .range([0, width]);
    
    let yScale = d3.scaleLinear()
    .domain(d3.extent(cData, d => d[yax]))
    .range([height, 0]);


    let leftAxis = d3.axisLeft(yScale);

    let bottomAxis = d3.axisBottom(xScale);

    yadj=d3.select('svg').attr("height")-margin.bottom;
    
    chartGroup.append("g")
    .attr("transform", `translate(0, ${yadj})`)
    .call(bottomAxis);


    chartGroup.append("g")
    .call(leftAxis);
   




}



d3.csv("assets/data/data.csv").then(censusData=>{
    cData=censusData;
    plotplot(xaxd,yaxd);
});

