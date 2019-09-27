var req_zip;
var api_URL= "https://intense-tor-20370.herokuapp.com/api/nas/nas_zip/"

var state_pnd_trend=[
    {"y": 10.0},
    {"y": 9.0},
    {"y": 10.0},
    {"y": 9.0},
    {"y": 10.0},
]
var state_nas_trend=[
    {"y": 1.0},
    {"y": 2.0},
    {"y": 1.0},
    {"y": 2.0},
    {"y": 1.0},
]

$("#home-submit").on("click", function(event){
    event.preventDefault();
    req_zip = $("#home-input").val().trim();
    console.log(req_zip)
    queryZip(req_zip)
})

function queryZip(zip){
    var req_url= api_URL + zip
    console.log(api_URL)

    $.get(req_url, function(data){
        console.log(data)
        var nas_rate= data[4].nas_rate;
        var pnd_rate= data[4].pndexp_rate
        $("#main-rate").text(pnd_rate)
        $(".zip-code").text(data[4].zip)
        var rate_change = (pnd_rate - data[0].pndexp_rate).toFixed(1)
        if(rate_change>0){
            $(".change-wording").text("increased by ")
            $(".rate-change").text(rate_change)
        }else if(rate_change<0){
            $(".change-wording").text("decreased by ")
            $(".rate-change").text(-1*rate_change)
        }else{
            $(".change-wording").text("not changed")
            $(".rate-change").text("")
        }

        var zip_nas_trend = []
        var zip_pnd_trend = []
        for (var i=0; i<data.length; i++){
            zip_nas_trend.push({"y":data[i].nas_rate})
            zip_pnd_trend.push({"y":data[i].pndexp_rate}) 
            console.log(zip_pnd_trend)
        }
        createLineChart([state_nas_trend,state_pnd_trend,zip_nas_trend, zip_pnd_trend]);

        var opioid_p = (nas_rate/pnd_rate *100).toFixed(0);
        $("#opioid-p").text(opioid_p+"%")
        $("#other-p").text(100-opioid_p+"%")
    })

    
}



//breakdown lines
var lineGenerator = d3.line()
	.curve(d3.curveBasis);

var points = [
    [80, 0],
    [80,90],
	[150, 90],
];
var points2 = [
    [80, 0],
    [80,180],
	[150, 180],
];

var pathData1 = lineGenerator(points);
var pathData2 = lineGenerator(points2);

d3.select('svg.break-down')
    .attr("width", 150)
    .attr("height", 185)
    .select("path.first")
    .attr('d', pathData1)
    .attr("class","curve first")

    d3.select('path.second')
    .attr('d', pathData2)
    .attr("class","curve second")


function createLineChart(dataArray){
    $(".lineChart").empty()
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 400;
    var height= 300;
    var n = 5;
    var domain = ["2013", "2014", "2015", "2016", "2017"]
    var xScale = d3.scaleBand()
        .domain(domain)
        // .domain([0,n-1])
        .range([0, width]);

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, 60]) // input 
        .range([height, 0]) // output 

        var line = d3.line()
        .x(function(d,i){return xScale(domain[i])+30;})
        .y(function(d){return yScale(d.y);})
        .curve(d3.curveMonotoneX)

    //replace with actual data
    // var dataset1 = d3.range(n).map(function(d){return{"y":d3.randomUniform(2)()}})
    // var dataset2 = d3.range(n).map(function(d){return{"y":d3.randomUniform(2)()}})


    var svg= d3.select(".lineChart")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," +margin.top+")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3.axisBottom(xScale)
                .tickPadding(10)
                .tickSize(5)
                // .tickFormat(d3.format(",.2s"))
                ); // Create an axis component with d3.axisBottom
            

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)
            .tickValues([1, 3, 5,10,15,20,30,40,50,60])
            // .ticks(50)
            .tickSize(1)
            ); // Create an axis component with d3.axisLeft

        for(var i=0; i<dataArray.length; i++){
            chartLineGenerator(dataArray[i],"line"+(i+1))
        }
        var div = d3.select("#lineChart-wrap").append("div")
            .attr("class", "tooltip")
            .style("display","none")
            .style("opacity", 0);

        function chartLineGenerator(dataset,className){
            svg.append("path")
                .datum(dataset) // 10. Binds data to the line 
                .attr("class", "chartLine "+className) // Assign a class for styling 
                .attr("d", line); // 11. Calls the line generator 
        
            svg.selectAll(".dot")
                .data(dataset)
                .enter().append("circle") // Uses the enter().append() method
                .attr("class", className+"-dot chartDot") // Assign a class for styling
                .attr("cx", function(d, i) { return xScale(domain[i])+30 })
                .attr("cy", function(d) { return yScale(d.y) })
                .attr("r", 4)
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("display","block")
                        .style("opacity", .9);
                    div.html("<p>"+d.y + "</p>")
                        .style("left", (d3.event.pageX-10) + "px")
                        .style("top", (d3.event.pageY - 30) + "px");
                })
                .on("mouseleave", function (d) {
                    div.transition()
                        .duration(200)
                        .style("display","none")
                        .style("opacity", 0)
                })
        }
    }


