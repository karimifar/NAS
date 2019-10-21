var req_zip;
var api_URL= "https://intense-tor-20370.herokuapp.com/api/nas/nas_zip/"
var first = true;
var state_pnd_trend=[
    {"y": "4.8" ,"i":0},
    {"y": "5.4", "i":1},
    {"y": "6.1", "i":2},
    {"y": "6.4", "i":3},
    {"y": "6.3", "i":4},
    {"y": "6.1", "i":5},
    {"y": "6.2", "i":6},
    {"y": "6.9", "i":7},
    {"y": "7.7", "i":8},
    {"y": "8.3", "i":9},
    {"y": "8.8", "i":10},
    {"y": "9.3", "i":11},
    {"y": "9.6", "i":12},
    {"y": "9.5", "i":13},
    {"y": "9.5", "i":14},
]
var state_nas_trend=[
    {"y": "0.8", "i":0},
    {"y": "0.9", "i":1},
    {"y": "1", "i":2},
    {"y": "1.1", "i":3},
    {"y": "1.3", "i":4},
    {"y": "1.4", "i":5},
    {"y": "1.6", "i":6},
    {"y": "1.8", "i":7},
    {"y": "2.0", "i":8},
    {"y": "2.2", "i":9},
    {"y": "2.4", "i":10},
    {"y": "2.5", "i":11},
    {"y": "2.6", "i":12},
    {"y": "2.6", "i":13},
    {"y": "2.5", "i":14},
]

var hasOver65;

$("#home-submit").on("click", function(event){
    hasOver65= false;
    event.preventDefault();
    req_zip = $("#home-input").val().trim();
    console.log(req_zip)
    queryZip(req_zip)
})

function queryZip(zip){
    var req_url= api_URL + zip
    console.log(api_URL)
    
    // $(".test").removeClass("invisible")
    startTransitionQuery()
    $.get(req_url, function(data){
        
        console.log(data)
        if(data.length!==0 && data[14].pndexp_rate!=-1){
            $(".pre-query").css("height","80px")
            $(".pre-query").addClass("started")
            $("#home-input").text(" ")
            $(".after-query").css("display", "block")
            // $(".test").addClass("invisible")
            setTimeout(function(){
                afterDataTransition()

                var zip_nas_trend = []
                var zip_pnd_trend = []
                for (var i=0; i<data.length; i++){
                    if(data[i].nas_rate != -1){
                        zip_nas_trend.push({"y":data[i].nas_rate, "i": i})
                    }
                    if(data[i].pndexp_rate != -1){
                        zip_pnd_trend.push({"y":data[i].pndexp_rate, "i":i}) 
                    }

                    if(data[i].pndexp_rate > 65){
                        hasOver65=true;
                    }
                    console.log(zip_pnd_trend)
                }

                var nas_rate= data[14].nas_rate;
                var pnd_rate= data[14].pndexp_rate
                $("#main-rate").text(pnd_rate)
                $(".zip-code").text(data[4].zip)
                var rate_change = (pnd_rate - zip_pnd_trend[0].y).toFixed(1)
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
                $("#change-period").text(15-zip_pnd_trend[0].i)
                createLineChart([state_nas_trend,state_pnd_trend,zip_nas_trend, zip_pnd_trend]);
                createDistBox(pnd_rate);
                var opioid_p = (nas_rate/pnd_rate *100).toFixed(0);
                
                if(pnd_rate==0){
                    $(".desc-row2").css("display","none")
                }else{
                    $(".desc-row2").css("display","flex")
                }
                $("#opioid-p").text(opioid_p+"%")
                $("#other-p").text(100-opioid_p+"%")
                

            },400)
        }else if(data.length==0){
            alert("Please Enter a Valid Texas ZIP-Code")
        }else{
            //should get the county data
            alert("No Data for This Zip")
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
    [100,185],
	[150, 185],
];

var pathData1 = lineGenerator(points);
var pathData2 = lineGenerator(points2);

d3.select('svg.break-down')
    .attr("viewBox", "0 0 150 195")
    .attr("width", 200)
    .attr("height", 190)
    .select("path.first")
    .attr('d', pathData1)
    .attr("class","curve first")


    d3.select('path.second')
    .attr('d', pathData2)
    .attr("class","curve second")


///function to create distribution box
function createDistBox(data){
    $(".distBox").empty()
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 500;
    var height= 50;
    var xScale= d3.scaleLinear()
        .domain([0,69])
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

    //the gradient definition
    svg.append("defs")
        .append("linearGradient")
        .attr("id","grad1")
        .attr("x1", "10%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .append("stop")
        .attr("offset","0%")
        .style("stop-color","#3f91c4" )
    d3.select("#grad1")
        .append("stop")
        .attr("offset","100%")
        .style("stop-color","#736a7f" )

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(xScale)
            .tickPadding(5)
            .tickSize(3)
            .tickValues([0,8,12,34.5,69])
            .tickFormat(d3.format(",.3"))
            ); // Create an axis component with d3.axisBottom
            
    svg.append("g")
        .attr("id", "allzips")
        .append("rect")
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", height)
        .attr("width", width)
        .attr("class", "allzips")
        .attr("fill","url(#grad1)")

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
        .attr("y2",height +10)

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
        .attr("y",height+25)
        .attr("class", "dist-text thezip-rate")

    svg.select("#thezip").append("rect")
        .attr("x", xScale(data)-20)
        .attr("y", -20)
        .attr("width", 40)
        .attr("height", height+20)
        .attr("opacity",0)

}


///function to create the line chart
function createLineChart(dataArray){
    $(".lineChart").empty()
    var margin = {top: 25, right: 50, bottom: 25, left: 50};
    var width = 500;
    var height= 300;
    var n = 15;
    var domain = ["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013", "2014", "2015", "2016", "2017", "2018"]
    var xScale = d3.scaleBand()
        .domain(domain)
        // .domain([0,n-1])
        .range([0, width]);
    var ydomain;
    if(hasOver65){ydomain=150}else{ydomain=60}

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0,ydomain])
        .range([height, 0]) // output 

        line = d3.line()
        .x(function(d,i){return xScale(domain[d.i])+width/(2*n) ;})
        .y(function(d){return yScale(d.y);})
        // .curve(d3.curveCardinal.tension(0))
        .curve(d3.curveMonotoneX)



    var svg= d3.select(".lineChart")
        .attr("width", width+margin.left+margin.right)
        .attr("height", height+margin.top+margin.bottom)
        .attr("viewBox", "0 0 " + (width+margin.left+margin.right).toString()+ " " +(height+margin.top+margin.bottom).toString() )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," +margin.top+")");

        ///append the legend
        
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
            // .tickValues([1, 3, 5,10,15,20,30,40,50,60])
            // .ticks(50)
            .tickSize(1)
            ); // Create an axis component with d3.axisLeft
        
        //append a group to be used later
        svg.append("g")
            .attr("id", "lineChart-legend")

        var div = d3.select("#lineChart-wrap").append("div")
            .attr("class", "tooltip")
            .style("display","none")
            .style("opacity", 0);

        //run the line generator function for each array item passed into the main function
        for(var i=0; i<dataArray.length; i++){
            chartLineGenerator(dataArray[i],"line"+(i+1))
            legendGenerator(i)
        }
        
        function legendGenerator(index){
            switch(index){
                case 0:
                    var legendText= "State NAS rate"
                    break;
                case 1:
                    var legendText= "State overall rate"
                    break;
                case 2:
                    var legendText= "ZIP-Code NAS rate"
                    break;
                case 3:
                    var legendText= "ZIP-Code overall rate"
                    break;
            }
            d3.select("#lineChart-legend")
                .append("line")
                .attr("class","chartLine line"+(index+1))
                .attr("x1",width-130)
                .attr("y1",12*index-4)
                .attr("x2",width-100)
                .attr("y2",12*index-4)

            d3.select("#lineChart-legend")
                .append("text")
                .text(legendText)
                .attr("x", width-90)
                .attr("y", 12*index)
                .attr("class", "legend-text")
        }

        function chartLineGenerator(dataset,className){
            svg.append("path")
                .datum(dataset) // 10. Binds data to the line 
                .attr("class", "chartLine "+className) // Assign a class for styling 
                .attr("d", line); // 11. Calls the line generator 
        
            svg.selectAll(".dot")
                .data(dataset)
                .enter().append("circle") // Uses the enter().append() method
                .attr("class", className+"-dot chartDot") // Assign a class for styling
                .attr("cx", function(d, i) { return xScale(domain[d.i])+width/(2*n) })
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