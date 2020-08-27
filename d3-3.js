const svg1 = d3.select('.svg1');
const width1 = 960;
const height1 = 500;
svg1.style('background-color', 'maroon').attr('width',width1).attr('height',height1);

var g = svg1.append('g').attr('transform',`translate(${width1/2},${height1/2})`);
var circle1 = g.append('circle');
circle1.attr('r',height1/2).attr('fill','white').attr('stroke','olive').attr('stroke-width', 10);

var eyeSpace = 100;
var eyeHright = 60;
var eyeG = g.append('g').attr('transform',`translate(0,${-eyeHright})`)

var eye1 = eyeG.append('path')
    .attr('d',d3.arc()({
        innerRadius:15,
        outerRadius:40,
        startAngle:0,
        endAngle:Math.PI*2
    }))
    .attr('fill','#292929')
    .attr('transform',`translate(${eyeSpace},0)`);

var eye2 = eyeG.append('path')
    .attr('d',d3.arc()({
        innerRadius:15,
        outerRadius:40,
        startAngle:0,
        endAngle:Math.PI*2
    }))
    .attr('fill','#292929')
    .attr('transform',`translate(${-eyeSpace},0)`);



var mouth = svg1.append('path')
    .attr('d', d3.arc()({
        innerRadius:90,
        outerRadius:100,
        startAngle:Math.PI/2,
        endAngle:Math.PI*1.5
    }))
    .attr('transform','translate(480,330)');

var tongue = svg1.append('path')
    .attr('d', d3.arc()({
        innerRadius:0,
        outerRadius:90,
        startAngle:Math.PI/2,
        endAngle:Math.PI*1.5
    }))
    .attr('fill','indianred')
    .attr('transform','translate(480,330)');