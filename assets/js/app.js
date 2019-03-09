/* Plot census data */


let cData=[];   //data
let xaxd='poverty';    // x axis value, defaults to 
let yaxd='healthcare';    // y axis value, defaults to 
const margin = { top: 50, bottom: 120, right: 75, left: 120 };

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

function drawPlot(redraw){
    console.log('start drawPlot')
    let h = (window.innerHeight - margin.top - margin.bottom);
    let w = window.innerWidth - margin.left - margin.right;
    // aprox radius for 90width = 12px, 
    let radius= w >900 ?13: w> 700? 12: w> 500? 11:10;
    let svg = d3.select("svg");

    let postfix = xaxd==='age'? "" : xaxd ==='income'? "": "%";
    //make group
    
    if (!redraw){ //initial plot
        console.log('redraw is false, so new dtraw')
        let chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        //draw x scale
        let xScale = d3.scaleLinear().domain(d3.extent(cData, d => d[xaxd])).range([0, w+20]);
        let bottomAxis = d3.axisBottom(xScale);
        chartGroup.append("g").attr("transform", `translate(0, ${h})`).call(bottomAxis);
        //draw y scale
        let yScale = d3.scaleLinear().domain(d3.extent(cData, d => d[yaxd])).range([h, 0+20]);
        let leftAxis = d3.axisLeft(yScale);
        chartGroup.append("g").call(leftAxis);
        // draw labels
        let xlabelPoverty=chartGroup.append("text")
            .attr("transform", `translate(${w/2},${h+margin.top})`)
            .classed("active", xaxd=== 'poverty')
            .classed("inactive", xaxd != 'poverty')
            .text('In Poverty (%)');

        let xlabelAge=chartGroup.append("text")
            .attr("transform", `translate(${w/2},${h+margin.top+20})`)
            .classed("active", xaxd=== 'age')
            .classed("inactive", xaxd != 'age')
            .text('Age (median)');

        let xlabelIncome=chartGroup.append("text")
            .attr("transform", `translate(${w/2},${h+margin.top+40})`)
            .classed("active", xaxd=== 'income')
            .classed("inactive", xaxd != 'income')
            .text('Household Income (Median)');
        
        let ylabelHealthcare=chartGroup.append("text").text('Lacks Healthcare (%)')
            .attr("transform", function(d){
                return  ` translate(-40,${h/2}) rotate(-90)`;
            })
            .classed("active", yaxd === 'healthcare')
            .classed("inactive", yaxd != 'healthcare');

        let ylabelSmokes=chartGroup.append("text").text('Smokes (%)')
            .attr("transform", function(d){
                return  ` translate(-60,${h/2}) rotate(-90)`;
            })
            .classed("active", yaxd === 'smokes')
            .classed("inactive", yaxd != 'smokes');

        let ylabelObesity=chartGroup.append("text").text('Obese (%)')
            .attr("transform", function(d){
                return  ` translate(-80,${h/2}) rotate(-90)`;
            })
            .classed("active", yaxd === 'obesity')
            .classed("inactive", yaxd != 'obesity');
        //draw tooltip
        let tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(function(d) { return `${d.state} <br> ${xaxd} : ${d[xaxd]}${postfix} <br> ${yaxd} : ${d[yaxd]}${postfix}` });
            svg.call(tool_tip);
        let circlesGroup = chartGroup.selectAll("circle").data(cData);
        circlesGroup.enter()
            .append("circle")
            .attr("cx", d => xScale(d[xaxd]))
            .attr("cy", d => yScale(d[yaxd]))
            .attr("r", radius)
            .classed("stateCircle", true)
            .on('mouseover', tool_tip.show)
            .on('mouseout', tool_tip.hide);
        circlesGroup.enter()
            .append("text")
            .attr("x", d => xScale(d[xaxd]))
            .attr("y", d => yScale(d[yaxd])+3)
            .attr("font-size", `${radius}px`)
            .attr("text-anchor", "middle")               
            .text(function (d) { return `${d.abbr}`; })
            .classed("stateText",true);
    }else{ // r=trasnform plot
        console.log('start trasnform');
    }// end transofrm
    console.log('end draw plot');
}//end redraw



/*
        console.log(" start refreshing");
        // Enter
        circlesGroup.enter()
            .append('circle')
            .attr('r', 0)
            .attr('cx', d => xScale(d['income']))
            .attr('cy', d => yScale(d['healthcare']))
            .style('fill', 'white')
            .merge(circlesGroup)
        .transition()
            .duration(1500)
            .attr("cx", d => xScale(d[xaxd]))
            .attr("cy", d => yScale(d[yaxd]))
            .attr("r", radius);
            //.style('fill', function(d) {return d.fill;});

        // Exit
        circlesGroup.exit()
            .transition()
            .duration(1500)
            .attr('r', 0)
        .style('opacity', 0)
            .each('end', function() {
                d3.select(this).remove();
            });
        


        console.log(" end refreshing");
    } 
    
}



*/

function completereDraw(){
    initPlot();
    drawPlot(false);
}

d3.csv("assets/data/data.csv").then(censusData=>{
    cData=censusData;
    makeNums();
    completereDraw();
    //plotplot(false);
});

d3.select(window).on("resize", completereDraw);