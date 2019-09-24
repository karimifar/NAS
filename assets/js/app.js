var req_zip;
var api_URL= "https://intense-tor-20370.herokuapp.com/api/nas/nas_zip/"



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


function createBarChart(){
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 300;
    var height= 200;
    var n = 5;
    var xScale = d3.scaleLinear()
        .domain(["2013", "2014", "2015", "2016", "2017"])
        .range([height,0]);

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, 2]) // input 
        .range([height, 0]); // output 

    var line = d3.line()
        .x(function(d,i){return xScale(i);})
        .y(function(d){return yScale(d.y);})
        .curve(d3.curveMonotoneX)

    //replace with actual data
    var dataset = d3.range(n).map(function(d){return{"y":d3.randomUniform(1)()}})
    console.log(dataset)
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
                // .tickFormat(d3.format(",.2s"))
                ); // Create an axis component with d3.axisBottom
            

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
        
        svg.append("path")
            .datum(dataset) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line); // 11. Calls the line generator 
}