document.addEventListener('DOMContentLoaded', function(){
    let csv;
    fetch('./example.csv').then(res=>res.text()).then(data=>csv = data).then(()=>window.addEventListener('load', windowLoad(csv)));
})

function windowLoad(csv){ //把拿到 csv 轉成 JSON
    
    var lines = csv.split('\r\n'); //先把每一行分開變成陣列
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
        item.population = +item.population; //把數字轉成number型態
    })
    render(data);
}

function render(data) {
    const svgWid = 960;
    const svgHt = 500;
    const margin = {top:20,right:20,bottom:20,left:100};
    const svg = d3.select('body').append('svg').attr('width',svgWid).attr('height',svgHt);

    var innerW = svgWid - margin.left - margin.right;
    var innerH = svgHt - margin.top - margin.bottom;

    //scaleLinear (domain->data space, range->screen space)
    var maxy = d3.max(data, d => { return d.population }) //找尋data的最大值放進domain裡面

    var xScale = d3.scaleLinear().domain([0,maxy]).range([0,innerW]);

    var yScale = d3.scaleBand().domain(data.map(d=>d.country)).range([0,innerH]).padding(0.2);

    var color = d3.scaleLinear().domain([0,maxy]).range(['navy','maroon']);


    // bar
    const g = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`);

    g.selectAll('rect').data(data).enter()
        .append('rect')
        .attr('y', d=>yScale(d.country))
        .attr('width', d=>xScale(d.population))
        .attr('height',yScale.bandwidth())
        .attr('fill', d=>color(d.population));

    //axis
    g.append('g').call(d3.axisLeft(yScale)); //調整marginLeft讓字不會被遮住
    g.append('g').call(d3.axisBottom(xScale)).attr('transform',`translate(0,${innerH})`); //調整高度放置在最下面
};
