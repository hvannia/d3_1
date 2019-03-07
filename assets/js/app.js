// @TODO: YOUR CODE HERE!
let cData=[];
let xaxd="";
let yaxd="";

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

function drawXScale(w,h,chGrp){
    let xScale = d3.scaleLinear().domain(d3.extent(cData, d => d[xaxd])).range([0, w+20]);
    let bottomAxis = d3.axisBottom(xScale);
    chGrp.append("g").attr("transform", `translate(0, ${h})`).call(bottomAxis);
    return xScale;
}

function drawYScale(w,h,chGrp){
    let yScale = d3.scaleLinear().domain(d3.extent(cData, d => d[yaxd])).range([h, 0+20]);
    let leftAxis = d3.axisLeft(yScale);
    chGrp.append("g").call(leftAxis);
    return yScale;
}

function drawLabels(w, h, m, chGrp){

   let xlabelPoverty=chGrp.append("text")
   .attr("transform", `translate(${w/2},${h+m.top})`)
   .classed("active", xaxd=== 'poverty')
   .classed("inactive", xaxd != 'poverty')
   .text('In Poverty (%)');

   let xlabelAge=chGrp.append("text")
   .attr("transform", `translate(${w/2},${h+m.top+20})`)
   .classed("active", xaxd=== 'age')
   .classed("inactive", xaxd != 'age')
   .text('Age (median)');

   let xlabelIncome=chGrp.append("text")
   .attr("transform", `translate(${w/2},${h+m.top+40})`)
   .classed("active", xaxd=== 'income')
   .classed("inactive", xaxd != 'income')
   .text('Household Income (Median)');
  
   let ylabelHealthcare=chGrp.append("text").text('Lacks Healthcare (%)')
   .attr("transform", function(d){
        return  ` translate(-40,${h/2}) rotate(-90)`;
       })
   .classed("active", yaxd === 'healthcare')
   .classed("inactive", yaxd != 'healthcare');

   let ylabelSmokes=chGrp.append("text").text('Smokes (%)')
   .attr("transform", function(d){
        return  ` translate(-60,${h/2}) rotate(-90)`;
       })
   .classed("active", yaxd === 'smokes')
   .classed("inactive", yaxd != 'smokes');

   let ylabelObesity=chGrp.append("text").text('Obese (%)')
   .attr("transform", function(d){
        return  ` translate(-80,${h/2}) rotate(-90)`;
       })
   .classed("active", yaxd === 'obesity')
   .classed("inactive", yaxd != 'obesity');
}


function drawCircles(chGrp){
    let radius=12;
    let svg = d3.select("svg");

    let postfix = xaxd==='age'? "" : xaxd ==='income'? "": "%";
    
    var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { return `${d.state} <br> ${xaxd} : ${d[xaxd]}${postfix} <br> ${yaxd} : ${d[yaxd]}${postfix}` });
    svg.call(tool_tip);

    let circlesGroup = chGrp.selectAll("circle")
    .data(cData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d[xaxd]))
    .attr("cy", d => yScale(d[yaxd]))
    .attr("r", radius)
    .classed("stateCircle", true)
    .on('mouseover', tool_tip.show)
    .on('mouseout', tool_tip.hide);

    let stateGroup = chGrp.selectAll("text")
    .data(cData)
    .enter()
    .append("text")
    .attr("x", d => xScale(d[xaxd]))
    .attr("y", d => yScale(d[yaxd]))
    .attr("font-size", `${radius-2}px`)
    .attr("text-anchor", "middle")               
    .text(function (d) { return `${d.abbr}`; })
    .classed("stateText",true);
}


function update() {
    let radius=12;
	var u = d3.select('svg')
		.selectAll('circle')
		.data(cData);

	// Enter
	u.enter()
		.append('circle')
		.attr('r', 0)
		.attr('cx', d => xScale(d['income']))
		.attr('cy', d => yScale(d['healthcare']))
		.style('fill', 'white')
		.merge(u)
	  .transition()
		.duration(1500)
		.attr("cx", d => xScale(d[xaxd]))
         .attr("cy", d => yScale(d[yaxd]))
        .attr("r", radius);
		//.style('fill', function(d) {return d.fill;});

	// Exit
	u.exit()
		.transition()
		.duration(1500)
		.attr('r', 0)
	  .style('opacity', 0)
		.each('end', function() {
			d3.select(this).remove();
		});
}


function plotplot() {
    var svgArea = d3.select("scatter").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    } 
    let svgWidth = window.innerWidth;
    let svgHeight = window.innerHeight;
    const margin = { top: 50, bottom: 120, right: 75, left: 120 };
    let height = (svgHeight - margin.top - margin.bottom);
    let width = svgWidth - margin.left - margin.right;
  
    let svg = d3.select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    let chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


    xScale= drawXScale(width, height, chartGroup);
    yScale= drawYScale(width, height, chartGroup);

    drawLabels(width,height,margin, chartGroup);

    drawCircles(chartGroup);
    console.log('just hanging');
}



d3.csv("assets/data/data.csv").then(censusData=>{
    cData=censusData;
    parseNums()
    xaxd='poverty';  // x axis valyes default is poverty
    yaxd='healthcare'; // y axis values default to healthcare
    plotplot();
});

