var req_zip;
var api_URL= "https://intense-tor-20370.herokuapp.com/api/nas/nas_zip/"
var first = true;
var state_pnd_trend=[
    {"y": "4.8"},
    {"y": "5.4"},
    {"y": "6.1"},
    {"y": "6.4"},
    {"y": "6.3"},
    {"y": "6.1"},
    {"y": "6.2"},
    {"y": "6.9"},
    {"y": "7.7"},
    {"y": "8.3"},
    {"y": "8.8"},
    {"y": "9.3"},
    {"y": "9.6"},
    {"y": "9.5"},
    {"y": "9.5"},
]
var state_nas_trend=[
    {"y": "0.8"},
    {"y": "0.9"},
    {"y": "1"},
    {"y": "1.1"},
    {"y": "1.3"},
    {"y": "1.4"},
    {"y": "1.6"},
    {"y": "1.8"},
    {"y": "2.0"},
    {"y": "2.2"},
    {"y": "2.4"},
    {"y": "2.5"},
    {"y": "2.6"},
    {"y": "2.6"},
    {"y": "2.5"},
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
    $(".pre-query").css("height","80px")
    $(".pre-query").addClass("started")
    // $(".test").removeClass("invisible")
    startTransitionQuery()
    $.get(req_url, function(data){
        
        console.log(data)
        if(data){
            $("#home-input").text(" ")
            $(".after-query").css("display", "block")
            // $(".test").addClass("invisible")
            setTimeout(function(){
                afterDataTransition()
                var nas_rate= data[14].nas_rate;
                var pnd_rate= data[14].pndexp_rate
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
                createDistBox(pnd_rate);
                var opioid_p = (nas_rate/pnd_rate *100).toFixed(0);
                $("#opioid-p").text(opioid_p+"%")
                $("#other-p").text(100-opioid_p+"%")
                

            },400)
        }
        
    })

    
}



//breakdown lines
var lineGenerator = d3.line()
	.curve(d3.curveBasis);

var points = [
    [100, 0],
    [100,90],
	[150, 90],
];
var points2 = [
    [100, 0],
    [100,180],
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

function createDistBox(data){
    $(".distBox").empty()
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 500;
    var height= 75;
    var xScale= d3.scaleLinear()
        .domain([0,40])
        .range([0,width])

    var svg= d3.select(".distBox")
    .attr("class",function(){
        var rate = data
        switch(true){
            case(rate<8):
                return "distBox underrate";
            case(rate>12):
                return "distBox overrate";
            case(8<rate<12):
                return "distBox";           
        }

    })
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
    .attr("viewBox", "0 0 " + (width+margin.left+margin.right).toString()+ " " +(height+margin.top+margin.bottom).toString() )
    .append("g")
    .attr("transform", "translate(" + margin.left + "," +margin.top+")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(xScale)
            .tickPadding(5)
            .tickSize(0)
            .tickValues([0,8,12,40])
            // .tickFormat(d3.format(",.2s"))
            ); // Create an axis component with d3.axisBottom
            
    svg.append("g")
        .attr("id", "allzips")
        .append("rect")
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", height)
        .attr("width", width)
        .attr("class", "allzips")

    svg.append("g")
        .attr("id","mostzips")
        .append("rect")
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", height)
        .attr("width", xScale(4))
        .attr("class", "mostzips")
        .attr("transform","translate("+xScale(8)+" , 0)")

    svg.select("#allzips").append("text")
        .text("All ZIP-codes")
        .attr("class", "dist-text")
        .attr("x", function(){
            if(data>8){
                return 5
            }else{
                var textWidth = this.getBBox().width
                return width-textWidth-5
            }
        })
        .attr("y", -5)
        .attr("class", "dist-all-text dist-text")


    svg.select("#mostzips").append("text")
        .text("Most zip codes")
        .attr("class", "dist-most-text dist-text")
        .attr("x", xScale(12)+5)
        .attr("y", height-5)

    svg.append("g")
        .attr("id","thezip")
        .append("line")
        .attr("class","thezip-line")
        .attr("x1",xScale(data))
        .attr("y1",-7)
        .attr("x2",xScale(data))
        .attr("y2",height +7)

    svg.select("#thezip").append("text")
        .attr("class","thezip-text dist-text")
        .text("Where this zip code stands")
        .attr("x", function(){
            var textWidth = this.getBBox().width
            return xScale(data) - textWidth/2
        })
        .attr("y", -20)
    svg.select("#thezip").append("path")
        .attr("d", "M "+xScale(data)+" -8 L "+(xScale(data)-4)+" -15 L " +(xScale(data)+4)+" -15 L "+xScale(data)+" -8")
        .attr("id","dist-triangle")

    svg.select("#thezip").append("text")
        .text(data)
        .attr("class","dist-text")
        .attr("x", function(){
            var textWidth = this.getBBox().width
            return xScale(data) - textWidth/2 
        })
        .attr("y",height+20)
        .attr("class", "dist-text thezip-rate")

    svg.select("#thezip").append("rect")
        .attr("x", xScale(data)-20)
        .attr("y", -20)
        .attr("width", 40)
        .attr("height", height+20)
        .attr("opacity",0)

}



function createLineChart(dataArray){
    $(".lineChart").empty()
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 500;
    var height= 300;
    var n = 15;
    var domain = ["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013", "2014", "2015", "2016", "2017", "2018"]
    var xScale = d3.scaleBand()
        .domain(domain)
        // .domain([0,n-1])
        .range([0, width]);

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, 60]) // input 
        .range([height, 0]) // output 

        var line = d3.line()
        .x(function(d,i){return xScale(domain[i])+width/(2*n) ;})
        .y(function(d){return yScale(d.y);})
        // .curve(d3.curveCardinal.tension(0))
        .curve(d3.curveMonotoneX)



    var svg= d3.select(".lineChart")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .attr("viewBox", "0 0 " + (width+margin.left+margin.right).toString()+ " " +(height+margin.top+margin.bottom).toString() )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," +margin.top+")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3.axisBottom(xScale)
                .tickPadding(5)
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
                .attr("cx", function(d, i) { return xScale(domain[i])+width/(2*n) })
                .attr("cy", function(d) { return yScale(d.y) })
                .attr("r", 3)
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


function startTransitionQuery(){
    // $("#main-rate").css("background", "#f15a29")
    $("#main-rate").css("width", "0")
    $("#main-rate").css("transform", "scale(0)")
    $("#main-rate").css("opacity", "0")
    $(".changeble").css("opacity", "0")
}
function afterDataTransition(){
    $("#main-rate").css("transform", "scale(1)")
    $("#main-rate").css("opacity", "1")
    $("#main-rate").css("width", "180px")
    $(".changeble").css("opacity", "1")
}