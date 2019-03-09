/* Plot census data */
var cgGlobal =[] ; // for debug

let cData=[];   //data
let xaxd='poverty';    // x axis value, defaults to 
let yaxd='healthcare';    // y axis value, defaults to 
const margin = { top: 50, bottom: 120, right: 75, left: 120 };
const povertyText='In Poverty (%)';
const ageText='Age (median)';
const incomeText='Household Income (Median)';
const healthText="Lacks Healthcare (%)";
const smokeText="Smokes (%)";
const obesityText="Obese (%)";


/* Prase relevant strings as numbers */
function makeNums(){
    cData.forEach(function(d){
        d.income=parseFloat(d.income);
        d.smokes=parseFloat(d.smokes);
        d.healthcare=parseFloat(d.healthcare);
        d.poverty=parseFloat(d.poverty);
        d.obesity=parseFloat(d.obesity);
        d.age=parseFloat(d.age);
    });
}

/* initialize plot, to run when window is loaded or resized,
    */
function initPlot(){
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    } 
    svg = d3.select("#scatter")
      .append("svg")
      .attr("height", window.innerHeight)
      .attr("width", window.innerWidth);
}

function drawPlot(){
    console.log('start drawPlot')
    let h = (window.innerHeight - margin.top - margin.bottom);
    let w = window.innerWidth - margin.left - margin.right;
    // aprox radius for 90width = 12px, 
    let radius= w >900 ?13: w> 700? 12: w> 500? 11:10;
    let svg = d3.select("svg");

    let postfix = xaxd==='age'? "" : xaxd ==='income'? "": "%";
    //make group
    
    //if (!redraw){ //initial plot
    console.log('redraw is false, so new dtraw')
     let chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    //draw x scale
    let xScale = d3.scaleLinear().domain(d3.extent(cData, d => d[xaxd])).range([0, w+20]);
    let bottomAxis = d3.axisBottom(xScale);
    chartGroup.append("g").attr("transform", `translate(0, ${h})`).call(bottomAxis);

    //draw y scale
    let yScale = d3.scaleLinear().domain(d3.extent(cData, d => d[yaxd])).range([h, 0+20]);
    let leftAxis = d3.axisLeft(yScale);
    chartGroup.append("g").call(leftAxis);

     //tool top
    let tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { return `${d.state} <br> ${xaxd} : ${d[xaxd]}${postfix} <br> ${yaxd} : ${d[yaxd]}${postfix}` });
        svg.call(tool_tip);

        //draw circles
    let circlesGroup = chartGroup.selectAll("circle");
    circlesGroup.data(cData).enter()
        .append("circle")
        .attr("cx", d => xScale(d[xaxd]))
        .attr("cy", d => yScale(d[yaxd]))
        .attr("r", radius)
        .classed("stateCircle", true)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    // and text
    circlesGroup.data(cData).enter()
        .append("text")
        .attr("x", d => xScale(d[xaxd]))
        .attr("y", d => yScale(d[yaxd])+3)
        .attr("font-size", `${radius-1}px`)
        .attr("text-anchor", "middle")               
        .text(function (d) { return `${d.abbr}`; })
        .classed("stateText",true);

        // draw labels
    let xlabelPoverty=chartGroup.append("text")
        .attr("transform", `translate(${w/2},${h+margin.top})`)
        .classed("active", xaxd=== 'poverty')
        .classed("inactive", xaxd != 'poverty')
        .text(povertyText)
        .on("click",  function(d) {
            moveCt('poverty',yaxd,w,h);
        });

    let xlabelAge=chartGroup.append("text")
        .attr("transform", `translate(${w/2},${h+margin.top+20})`)
        .classed("active", xaxd=== 'age')
        .classed("inactive", xaxd != 'age')
        .text(ageText)
        .on("click",  function(d) {
            moveCt('age',yaxd,w,h);
        });

    let xlabelIncome=chartGroup.append("text")
            .attr("transform", `translate(${w/2},${h+margin.top+40})`)
            .classed("active", xaxd=== 'income')
            .classed("inactive", xaxd != 'income')
            .text(incomeText)
            .on("click",  function(d) {
                moveCt('income',yaxd,w,h);
            });
        
    let ylabelHealthcare=chartGroup.append("text").text(healthText)
            .attr("transform", function(d){
                return  ` translate(-40,${h/2}) rotate(-90)`;
            })
            .classed("active", yaxd === 'healthcare')
            .classed("inactive", yaxd != 'healthcare')
            .on("click",  function(d) {
                moveCt(xaxd,'health',w,h);
            });

    let ylabelSmokes=chartGroup.append("text").text(smokeText)
            .attr("transform", function(d){
                return  ` translate(-60,${h/2}) rotate(-90)`;
            })
            .classed("active", yaxd === 'smokes')
            .classed("inactive", yaxd != 'smokes')
            .on("click",  function(d) {
                moveCt(xaxd,'smokes',w,h);
            });

    let ylabelObesity=chartGroup.append("text").text(obesityText)
            .attr("transform", function(d){
                return  ` translate(-80,${h/2}) rotate(-90)`;
            })
            .classed("active", yaxd === 'obesity')
            .classed("inactive", yaxd != 'obesity')
            .on("click",  function(d) {
                moveCt(xaxd,'obesity',w,h);
            });
        //draw tooltip

       
   // }else
    console.log('end draw plot');
}//end redraw

// xy: axis changed (x/y), xd: x axis label, yd: y axis label, w:width, h:height
function moveCt(xd,yd,w,h){ // do transitions on circles and text
    console.log('start moveCt');
    xaxd=xd; 
    yaxd=yd;
    xScale = d3.scaleLinear().domain(d3.extent(cData, d => d[xaxd])).range([0, w+20]);
    yScale = d3.scaleLinear().domain(d3.extent(cData, d => d[yaxd])).range([h, 0+20]);
    console.log(`axises are now ${xaxd} and ${yaxd}!`);
    d3.selectAll('circle')//.data(cData).enter().append('circle')
        .transition()
        .duration(1000)
        .attr("cx",d => xScale(d[xaxd]))
        .attr("cy",d => yScale(d[yaxd]));

    d3.selectAll(".stateText")
        .transition()
        .duration(1000)
        .attr("x",d => xScale(d[xaxd]))
        .attr("y",d => yScale(d[yaxd]));
    
    
    //clear active axis
    actives = d3.selectAll('.active');
    actives.classed('inactive',true);  //remove active class from currently active axis

    //get what axis chnages and change label style
    let newActivexTxt="";
    let newActiveyTxt="";

        switch(xd) {
            case 'age': newActivexTxt=ageText; break;
            case 'income': newActivexTxt=incomeText; break;
            default: newActivexTxt = povertyText; break;
          }
        switch(yd) {
            case 'smokes': newActiveyTxt=smokeText; break;
            case 'healthcare': newActiveyTxt=healthText; break;
            default: newActiveyTxt = obesityText; break;
          }
   //x axis
    newactive = d3.selectAll("text").filter(function(){ 
            return d3.select(this).text() == newActivexTxt; });
    newactive.classed('inactive', false);              
    newactive.classed('active', true);
    //y axis
    newactive = d3.selectAll("text").filter(function(){ 
                 return d3.select(this).text() == newActiveyTxt; });
    newactive.classed('inactive', false);              
    newactive.classed('active', true);

    console.log('end moveCt');
}




    /*
        console.log('start trasnform');
        cG.data(cData).enter()
            .append('circle')
            .attr('r', 0)
            .attr('cx', d => xs(d[xaxd]))
            .attr('cy', d => ys(d[yaxd]))
            .style('fill', 'white')
            .merge(cG)
        .transition()
            .duration(1500)
            .attr("cx", d => xs(d[xaxd]))
            .attr("cy", d => ys(d[yaxd]))
            .attr("r", r);
        cG.exit()
            .transition()
            .duration(1500)
            .attr('r', 0)
        .style('opacity', 0)
            .each('end', function() {
                d3.select(this).remove();
        });
        console.log('end transform')
    }// end transofrm */

function completereDraw(){
    initPlot();
    drawPlot();
}

d3.csv("assets/data/data.csv").then(censusData=>{
    cData=censusData;
    makeNums();
    completereDraw();
    //plotplot(false);
});

d3.select(window).on("resize", completereDraw);