
document.addEventListener('DOMContentLoaded', function(){
    let csv;
    fetch('./example2.csv').then(res=>res.text()).then(data=>csv = data).then(()=>window.addEventListener('load', windowLoad(csv)));
})

function windowLoad(csv){ //把拿到 csv 轉成 JSON
    
    var lines = csv.split('\n'); //先把每一行分開變成陣列
    var data = []; //var 一個最後的結果陣列
    var headers = lines[0].split(','); //拿到每個title

    for(i=1;i<lines.length;i++){
        var obj = {}; //中繼物件
        var currentLine = lines[i].split(','); //把每一行的內容分開存成陣列
        for(j=0;j<headers.length;j++){
            obj[headers[j]] = currentLine[j]; //把內容放進對應的title
        }
        data.push(obj);//丟進結果的陣列
    }

    data.forEach(item=>{
        //把數字轉成number型態
        item.acceleration = +item.acceleration
        item.cylinders =  +item.cylinders
        item.displacement =  +item.displacement
        item.horsepower =  +item.horsepower
        item.mpg =  +item.mpg
        item.weight =  +item.weight
        item.year =  +item.year
    })

    render(data);
    
}

function render(data) {
    console.log(data);
    const svgWid = 960;
    const svgHt = 560;
    const margin = {top:40,right:20,bottom:60,left:100};
    const svg = d3.select('body').append('svg').attr('width',svgWid).attr('height',svgHt);

    var innerW = svgWid - margin.left - margin.right;
    var innerH = svgHt - margin.top - margin.bottom;

    //value
    var xVal = data => data.horsepower;
    var xAxisLabel = 'Horsepower';

    var yVal = data => data.weight;
    var yAxisLabel = 'Weight';

    const chartTitle = 'CARS: Horsepower v.s Weight';
    const circleRadius = 15; //圓圈用新增

    //scaleLinear (domain->data space, range->screen space)
    var xScale = d3.scaleLinear().domain(d3.extent(data, xVal)).range([0,innerW]).nice();

    var yScale = d3.scaleLinear().domain(d3.extent(data, yVal)).range([0,innerH]).nice();

    var color = d3.scaleLinear().domain(d3.extent(data, xVal)).range(['navy','maroon']);


    // circle group
    const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

    //axis
    //xAxis
    var xAxisFormat = number => d3.format('.2s')(number).replace('k','(千)').replace('M','(百萬)');
    var xAxis = d3.axisBottom(xScale).tickFormat(xAxisFormat).tickSize(-innerH).tickPadding(10);
    const xAxisG = g.append('g').call(xAxis).attr('transform',`translate(0,${innerH})`); //調整高度放置在最下面
    xAxisG.append('text').text(xAxisLabel).attr('fill','indianred').attr('x',innerW/2).attr('transform',`translate(0,${50})`).attr('font-size', '30px');;
    xAxisG.selectAll('.tick line').attr('stroke','lightgrey');

    //yAxis
    var yAxis = d3.axisLeft(yScale).tickSize(-innerW).tickPadding(10);
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.tick line').attr('stroke','lightgrey');
    yAxisG.append('text').text(yAxisLabel).attr('fill','indianred')
        .attr('text-anchor', 'middle').attr('y', -60).attr('x', -innerH / 2).attr('transform', `rotate(-90)`).attr('font-size', '30px');


    //chart title
    g.append('text').text(chartTitle).attr('fill','salmon').attr('text-anchor', 'middle').attr('x', innerW/2).attr('y', -20);

    //circle put here to get higher z-index
    g.selectAll('circle').data(data).enter()
        .append('circle')
        .attr('cy', d=>yScale(yVal(d))) //這邊綁定data數值改變位置
        .attr('cx', d=>xScale(xVal(d))) //這邊綁定data數值改變位置
        .attr('r', circleRadius)
        .attr('fill', d=>color(xVal(d)))
        .attr('opacity', 0.5);
    
};