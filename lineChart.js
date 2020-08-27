
document.addEventListener('DOMContentLoaded', function(){
    let csv;
    d3.csv('./example3.csv')
    .then(data => csv = data)
    .then(csv => {
        csv.forEach(item => {
            //把數字轉成number型態
            item.temperature = +item.temperature
            item.timestamp =  new Date(item.timestamp);
        });
        render(csv);
    })
})

function render(data) {
    console.log(data);
    const svgWid = 960;
    const svgHt = 560;
    const margin = {top:40,right:20,bottom:60,left:100};
    const svg = d3.select('body').append('svg').attr('width',svgWid).attr('height',svgHt);

    var innerW = svgWid - margin.left - margin.right;
    var innerH = svgHt - margin.top - margin.bottom;

    //value
    var xVal = data => data.timestamp;
    var xAxisLabel = 'Timestamp';

    var yVal = data => data.temperature;
    var yAxisLabel = 'Temperature';

    const chartTitle = 'A Week In San Fransisco';
    const circleRadius = 8; //圓圈用新增

    //scaleLinear (domain->data space, range->screen space)
    var xScale = d3.scaleTime().domain(d3.extent(data, xVal)).range([0,innerW]).nice();

    var yScale = d3.scaleLinear().domain(d3.extent(data, yVal)).range([innerH,0]).nice(); //數字小的在下面（反過來更改range）

    var color = d3.scaleLinear().domain(d3.extent(data, xVal)).range(['navy','maroon']).nice();


    // circle group
    const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

    //axis
    //xAxis
    var xAxis = d3.axisBottom(xScale).tickSize(-innerH).tickPadding(15);
    const xAxisG = g.append('g').call(xAxis).attr('transform',`translate(0,${innerH})`); //調整高度放置在最下面
    xAxisG.append('text').text(xAxisLabel).attr('fill','indianred').attr('x',innerW/2).attr('transform',`translate(0,${60})`).attr('font-size', '30px');;
    xAxisG.selectAll('.tick line').attr('stroke','lightgrey');

    //yAxis
    var yAxis = d3.axisLeft(yScale).tickSize(-innerW).tickPadding(10);
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.tick line').attr('stroke','lightgrey');
    yAxisG.append('text').text(yAxisLabel).attr('fill','indianred')
        .attr('text-anchor', 'middle').attr('y', -60).attr('x', -innerH / 2).attr('transform', `rotate(-90)`).attr('font-size', '30px');


    //chart title
    g.append('text').text(chartTitle).attr('fill','salmon').attr('text-anchor', 'middle').attr('x', innerW/2).attr('y', -20);

    //line put here to get higher z-index
    const lineGenerator = d3.line()
                        .x(d=>xScale(xVal(d)))
                        .y(d=>yScale(yVal(d)))
                        .curve(d3.curveBasis);

    g.append('path').attr('d',lineGenerator(data))
                    .attr('fill','none')
                    .attr('stroke','maroon')
                    .attr('stroke-width',4)
                    .attr('stroke-linejoin','round');

    // g.selectAll('circle').data(data).enter()
    //     .append('circle')
    //     .attr('cy', d=>yScale(yVal(d))) //這邊綁定data數值改變位置
    //     .attr('cx', d=>xScale(xVal(d))) //這邊綁定data數值改變位置
    //     .attr('r', circleRadius)
    //     .attr('fill', d=>color(xVal(d)))
    //     .attr('opacity', 0.5);
    
};