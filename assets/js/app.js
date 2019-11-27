var search_input;
var zipList;
var ctyList;
var listArr;
var api_URL= "https://intense-tor-20370.herokuapp.com" //"http://localhost:3306" //
var first = true;
var rateState;
var notTimeout;
var screenW= window.innerWidth
var screenH= window.innerHeight
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
var map;
var hasOver65;
var pin;


$(window).resize(function(){
    screenW= window.innerWidth
    screenH= window.innerHeight
    setGradHeight()
})
function setGradHeight(){
    $(".solid").height("100vh")
    setTimeout(function(){
        var h = $(".desc-col").height()
        $(".solid").height(h)
    }, 800);
    
}






$("#home-submit").on("click", function(event){
    event.preventDefault();
    hasOver65= false;
    search_input = $("#home-input").val().trim();
    
    if (isNaN(search_input)){
        queryCounty(search_input)
    }else{
        queryZip(search_input);
    }

        
    
})

$("#sec-submit").on("click", function(event){
    event.preventDefault();
    hasOver65= false;
    search_input = $("#sec-input").val().trim();
    if (isNaN(search_input)){
        queryCounty(search_input)
    }else{
        queryZip(search_input);
    }
})

function queryZip(zip){
    var req_url= api_URL + "/api/nas/nas_zip/" + zip;
    console.log(req_url)
    
    // afterDataTransition()
    $("#notification").removeClass("not-in")
    $.get(req_url, function(data){
        console.log(data)
        if(data.length!==0 && data[data.length-1].pndexp_rate!=-1){
            $(".after-query").css("display", "block")
            
            if (first){
                createMap();
                map.resize();
                setGradHeight();
                svgOut.play()
                setTimeout(function(){
                    $(".pre-query").addClass("started")
                    // $(".pre-query").css("height","80px")
                    $(".after-query-slide").addClass("animate slideIn")
                },1800)
                first = false
            }
            $(".chart1").css("display", "flex")
            startTransitionQuery()
            setTimeout(afterDataTransition, 400)
            var z_lat = data[0].zip_county.z_lat
            var z_lng = data[0].zip_county.z_lng
            console.log(z_lat, z_lng)
            map.flyTo({
                center:[z_lng,z_lat],
                zoom: 10
            })
            if(pin){
                pin.remove();
            }
            pin = new mapboxgl.Marker()
                .setLngLat([z_lng, z_lat])
                .addTo(map);

            
            
            $("#home-input").text(" ")

            setTimeout(visualizeData,400)
                
            function visualizeData(){
                var zip_nas_trend = []
                var zip_pnd_trend = []
                var rate2010 =data[6].pndexp_rate;
                var rate2011 =data[7].pndexp_rate;
                var rate2009 =data[5].pndexp_rate;

                for (var i=0; i<data.length; i++){
                    if(data[i].nas_rate != -1){
                        zip_nas_trend.push({"y":data[i].nas_rate, "i": i})
                    }
                    if(data[i].pndexp_rate != -1){
                        zip_pnd_trend.push({"y":data[i].pndexp_rate, "i":i}) 
                    }

                    if(data[i].pndexp_rate > 85){
                        hasOver65=true;
                    }
                    console.log(zip_pnd_trend)
                }
                
                var nas_rate= data[14].nas_rate;
                var pnd_rate= parseFloat(data[14].pndexp_rate);
                $("#percent-change-s").css("display", "inline")
                $("#ifZero").css("display", "none")
                if(rate2010 == -1){
                    if(rate2011 == -1){
                        if(rate2009 == -1){
                            $("#percent-change-s").css("display", "none")
                        }else{
                            $(".change-year").text("2009")
                            if (rate2009 ==0){
                                $("#percent-change-s").css("display", "none")
                                $("#ifZero").css("display", "inline")
                            }else{
                                var rate_change = ((pnd_rate - rate2009)/rate2009)*100
                            }
                        }
                    }else{
                        $(".change-year").text("2011")
                        if (rate2011 ==0){
                            $("#percent-change-s").css("display", "none")
                            $("#ifZero").css("display", "inline")
                        }else{
                            var rate_change = ((pnd_rate - rate2011)/rate2011)*100
                        }
                    }

                }else{
                    $(".change-year").text("2010")
                    if(rate2010 == 0){
                        $("#percent-change-s").css("display", "none")
                        $("#ifZero").css("display", "inline")
                    }else{
                        var rate_change = ((pnd_rate - rate2010)/rate2010)*100
                    }
                }
                
                if(pnd_rate<4.8){
                    rateState=  "underrate";
                }else     
                if(pnd_rate>14.2){
                    rateState = "overrate";
                    console.log(pnd_rate)
                }else   
                if(4.8<pnd_rate<14.2){
                    rateState = "standard";
                }
                                   
                $("#res-row").attr("class", rateState)

                $("#main-rate").text(pnd_rate)
                var result = data[0].zip
                $(".the-result").text(data[14].zip)

             
                if(rate_change>0){
                    $(".change-wording").text("increased by ")
                    $(".rate-change").text(rate_change.toFixed(1)+"%")
                }else if(rate_change<0){
                    $(".change-wording").text("decreased by ")
                    $(".rate-change").text(-1*rate_change.toFixed(1)+"%")
                }else{
                    console.log(rate_change)
                    $(".change-wording").text("not changed")
                    $(".rate-change").text("")
                }
                
                createLineChart([state_nas_trend,state_pnd_trend,zip_nas_trend, zip_pnd_trend],result);
                createDistBox(pnd_rate, result);
                var opioid_p = (nas_rate/pnd_rate *100).toFixed(0);
                
                if(pnd_rate==0){
                    $(".desc-row2").css("display","none")
                    $(".desc-row1").addClass("single")
                }else{
                    $(".desc-row2").css("display","flex")
                    $(".desc-row1").removeClass("single")
                }
                $("#opioid-p").text(opioid_p+"%")
                $("#other-p").text(100-opioid_p+"%")
                
            }
            

        }else if(data.length==0){
            alert("Please Enter a Valid Texas ZIP-Code")
        }else{
            var cntyName = data[0].zip_county.county
            $("#notification").html("Displaying county-level data because the data is suppressed in <span>"+zip+"</span>")
            // clearTimeout(notTimeout)
            queryCounty(cntyName)
            $("#notification").addClass("not-in")
            setTimeout(function(){
                notTimeout = $("#notification").removeClass("not-in")
            }, 3000)
            // alert("No Data for This Zip")
        }
        
    })

    
}



//breakdown lines
var lineGenerator = d3.line()
	.curve(d3.curveBasis);

var points = [
    [100, 0],
    [100,70],
	[150, 70],
];
var points2 = [
    [100, 0],
    [100,140],
	[150, 140],
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
function createDistBox(data,result){
    $(".distBox").empty()
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 500;
    var height= 50;
    var xScale= d3.scaleLinear()
        .domain([0,67.6])
        .range([0,width])

    var svg= d3.select(".distBox")
    .attr("class",function(){
        var rate = data
        switch(true){
            case(rate<4.8):
                return "distBox underrate";
            case(rate>14.2):
                return "distBox overrate";
            case(4.8<rate<14.2):
                return "distBox";           
        }

    })
    // .attr("width", width+margin.left+margin.right)
    // .attr("height", height+margin.top+margin.bottom)
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
        .style("stop-color","#e0c2a2" )

    d3.select("#grad1")
        .append("stop")
        .attr("offset","100%")
        .style("stop-color","#d39c83" )

    d3.select("defs")
        .append("linearGradient")
        .attr("id","grad2")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .append("stop")
        .attr("offset","0%")
        .style("stop-color","#d39c83" )
        
    d3.select("#grad2")
        .append("stop")
        .attr("offset","100%")
        .style("stop-color","#c1766f" )

    d3.select("defs")
        .append("linearGradient")
        .attr("id","grad3")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .append("stop")
        .attr("offset","0%")
        .style("stop-color","#c1766f" )
    d3.select("#grad3")
        .append("stop")
        .attr("offset","100%")
        .style("stop-color","#a65461" )

    d3.select("defs")
        .append("linearGradient")
        .attr("id","grad4")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .append("stop")
        .attr("offset","0%")
        .style("stop-color","#a65461" )
    d3.select("#grad4")
        .append("stop")
        .attr("offset","30%")
        .style("stop-color","#541f3f" )

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(
            d3.axisBottom(xScale)
            .tickPadding(5)
            .tickSize(5)
            .tickValues([0,4.8,14.2,26.3,67.6])
            .tickFormat(d3.format(",.3"))
            ); // Create an axis component with d3.axisBottom
            
    // svg.append("g")
    //     .attr("id", "allzips")
    //     .append("rect")
    //     .attr("y", 0)
    //     .attr("x", 0)
    //     .attr("height", height)
    //     .attr("width", width)
    //     .attr("class", "allzips")
    //     .attr("fill","url(#grad1)")

    
    
    svg.append("g")
        .attr("id","quart2")
        .append("rect")
        .attr("y", 0)
        .attr("x", 0)
        .attr("height", height)
        .attr("width", xScale(9.4))
        .attr("class", "quart quart2")
        .attr("fill","url(#grad2)")
        .attr("transform","translate("+xScale(4.8)+" 0)")

    svg.append("g")
        .attr("id","quart1")
        .append("rect")
        .attr("y", height/2)
        .attr("x", 0)
        .attr("height", height/2)
        .attr("width", xScale(4.8))
        .attr("class", "quart quart1")
        .attr("fill","url(#grad1)")

    svg.append("g")
        .attr("id","quart3")
        .append("rect")
        .attr("y", 1.5*height/2.5)
        .attr("x", 0)
        .attr("height", height/2.5)
        .attr("width", xScale(12.1))
        .attr("class", "quart quart3")
        .attr("fill","url(#grad3)")
        .attr("transform","translate("+xScale(14.2)+" 0)")

    svg.append("g")
        .attr("id","quart4")
        .append("rect")
        .attr("y", 9*height/10)
        .attr("x", 0)
        .attr("height", height/10)
        .attr("width", xScale(41.3))
        .attr("class", "quart quart4")
        .attr("fill","url(#grad4)")
        .attr("transform","translate("+xScale(26.3)+" 0)")

    // svg.select("#allzips").append("text")
    //     .text("All ZIP-codes")
    //     .attr("class", "dist-text")
    //     .attr("x", function(){
    //         if(data>8){
    //             return 5
    //         }else{
    //             var textWidth = this.getBBox().width
    //             return width-textWidth-5
    //         }
    //     })
    //     .attr("y", -5)
    //     .attr("class", "dist-all-text dist-text")
    svg.select("#quart1").append("text")
        .text("25% of ZIP Codes")
        .attr("class", "dist-q1-text dist-text")
        .attr("x", -46)
        .attr("y", height/2 -5)

    svg.select("#quart2").append("text")
        .text("50% of ZIP Codes")
        .attr("class", "dist-q2-text dist-text")
        .attr("x", xScale(4.8)-5)
        .attr("y", -5)

    svg.select("#quart3").append("text")
        .text("20% of ZIP Codes")
        .attr("class", "dist-q3-text dist-text")
        .attr("x", xScale(14.2)+4)
        .attr("y", 1.5*height/2.5 -5)

    svg.select("#quart4").append("text")
        .text("5% of ZIP Codes")
        .attr("class", "dist-q3-text dist-text")
        .attr("x", xScale(42))
        .attr("y", 9*height/10 -5)

    svg.append("g")
        .attr("id","thezip")
        .append("line")
        .attr("class","thezip-line")
        .attr("x1",xScale(data))
        .attr("y1",-17)
        .attr("x2",xScale(data))
        .attr("y2",height +20)

    svg.select("#thezip").append("text")
        .attr("class","thezip-text")
        .text("Where " + result + " stands")
        .attr("x", function(){
            var textWidth = this.getBBox().width
            return (xScale(data) - textWidth/2)
        })
        .attr("y", -30)
    svg.select("#thezip").append("path")
        .attr("d", "M "+xScale(data)+" -18 L "+(xScale(data)-4)+" -25 L " +(xScale(data)+4)+" -25 L "+xScale(data)+" -18")
        .attr("id","dist-triangle")

    svg.select("#thezip").append("text")
        .text(data)
        .attr("class","thezip-text")
        .attr("x", function(){
            var textWidth = this.getBBox().width
            return xScale(data) - textWidth/2
        })
        .attr("y",height+35)
        .attr("class", "thezip-text thezip-rate")

    svg.select("#thezip").append("rect")
        .attr("x", xScale(data)-10)
        .attr("y", -25)
        .attr("width", 20)
        .attr("height", height+50)
        .attr("opacity",0)

}


///function to create the line chart
function createLineChart(dataArray, result){
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
    if(hasOver65){ydomain=160}else{ydomain=60}

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
        // .attr("width", width+margin.left+margin.right)
        // .attr("height", height+margin.top+margin.bottom)
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
            .tickPadding(5)
            .tickSize(5)
            ); // Create an axis component with d3.axisLeft
        
        //append a group to be used later
        svg.append("g")
            .attr("id", "lineChart-legend")

        
        //run the line generator function for each array item passed into the main function
        for(var i=0; i<dataArray.length; i++){
            chartLineGenerator(dataArray[i],"line"+(i+1))
            legendGenerator(i, result)
        }
        
        function legendGenerator(index, result){
            switch(index){
                case 0:
                    var legendText= "State NAS rate"
                    break;
                case 1:
                    var legendText= "State overall rate"
                    break;
                case 2:
                    var legendText= result + " NAS rate"
                    break;
                case 3:
                    var legendText= result + " overall rate"
                    break;
            }
            d3.select("#lineChart-legend")
                .append("line")
                .attr("class","chartLine line"+(index+1))
                .attr("x1",width-160)
                .attr("y1",15*(3-index)-19)
                .attr("x2",width-130)
                .attr("y2",15*(3-index)-19)

            d3.select("#lineChart-legend")
                .append("text")
                .text(legendText)
                .attr("x", width - 120)
                .attr("y", 15*(3-index)-15)
                .attr("class", "legend-text")
        }

        var div = d3.select("body").append("div")
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
                        .style("top", (d3.event.pageY-30) + "px");
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
    setGradHeight();
}
function afterDataTransition(){
    $("#main-rate").css("transform", "scale(1)")
    $("#main-rate").css("opacity", "1")
    $("#main-rate").css("width", "180px")
    $(".changeble").css("opacity", "1")
}




// MAP FUNCTIONS
var firstSymbolId;
var hoveredCtId = null;
var hoveredZipId = null;
var zoomThreshold = 5.9;
//BLUES: var COLORS = ['rgba(75,187,231,1)', 'rgba(42,131,182,1)', 'rgba(55,121,144,1)', 'rgba(50,90,120,1)', 'rgba(25,73,96,1)', 'rgba(37,24,68,1)','#ddd']
//REDS: var COLORS = ['rgba(211,132,132,1)', 'rgba(206,124,110,1)', 'rgba(155,74,74,1)', 'rgba(140,49,59,1)', 'rgba(102,39,41,1)', 'rgba(73,18,21,1)','#ddd']
// var COLORS = ['#009392','#39b185','#9ccb86','#e9e29c','#eeb479','#e88471','#ddd']
var COLORS = ['#e0c2a2','#d39c83','#c1766f','#a65461','#813753','#541f3f','#eee']
var BREAKS = [4.7, 14.2, 20, 26.2, 35, 999]

mapboxgl.accessToken = "pk.eyJ1Ijoia2FyaW1pZmFyIiwiYSI6ImNqOGtnaWp4OTBjemsyd211ZDV4bThkNmIifQ.Xg-Td2FFJso83Mmmc87NDA";
var mapStyle = "mapbox://styles/mapbox/streets-v11";
var mapStyle2 = "mapbox://styles/karimifar/ck2ey2mad1rtp1cmppck4wq2d";

function createMap(){
    var bounds = [
        [-109.629974, 21.537354], // Southwest coordinates
        [-91.393472,39.913594]  // Northeast coordinates
    ];
    map = new mapboxgl.Map({
        container: 'theMap',
        zoom: 4.5,
        center: [-99.113241, 31.079125],
        maxZoom: 10,
        minZoom: 4.7,
        maxBounds: bounds,
        style: mapStyle2//'mapbox://styles/mapbox/streets-v11'
    });
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-right');

// Find the index of the first symbol layer in the map style
    map.on('load', function () {
        var layers = map.getStyle().layers;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
            }
        }

        map.on("zoom", function () {
            if (map.getZoom() > zoomThreshold) {
                isCounty=false;
                $("#county-btn").removeClass("disabled")
            } 
            else {
                isCounty=true;
                $("#county-btn").addClass("disabled")
            }
        })
        
        
        map.addSource("zips_source", {
            type: "geojson",
            data: api_URL+ "/NAS/zips",
            generateId: true,
        })

        map.addLayer({
            'id': 'zips_fill',
            'type': 'fill',
            'source':'zips_source',
            'layout': {
                'visibility':'visible'
            },
            'minzoom': zoomThreshold,
            'paint':{
                'fill-color': [
                    "step",
                    ["get", "pndexp_rate"],
                    COLORS[0],BREAKS[0],
                    COLORS[1],BREAKS[1], 
                    COLORS[2],BREAKS[2], 
                    COLORS[3],BREAKS[3], 
                    COLORS[4],BREAKS[4],
                    COLORS[5], BREAKS[5],
                    COLORS[6],
                    
                ],
                // 'fill-opacity':0.5
            }
        }, firstSymbolId);

        map.addLayer({
            'id': 'zips_outline',
            'type': 'line',
            'source':'zips_source',
            'minzoom': zoomThreshold,
            'paint':{
                "line-color": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    "#111",
                    "#999"
                ],
                "line-width": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    1,
                    0.1
                ],
            }
        }, firstSymbolId);


        map.addSource("counties_source", {
            type: "geojson",
            data: api_URL+ "/NAS/counties",
            generateId: true,
        })
        map.addLayer({
            'id': 'counties_fill',
            'type': 'fill',
            "interactive": true,
            'source':'counties_source',
            'layout': {
                'visibility':'visible'
            },
            'maxzoom': zoomThreshold,
            'paint':{
                'fill-color': [
                    "step",
                    // ["linear"],
                    ["get", "pndexp_rate"],
                    COLORS[0],BREAKS[0],
                    COLORS[1],BREAKS[1], 
                    COLORS[2],BREAKS[2], 
                    COLORS[3],BREAKS[3], 
                    COLORS[4],BREAKS[4],
                    COLORS[5], BREAKS[5],
                    COLORS[6],
                ],
            }
        }, firstSymbolId);

        map.addLayer({
            'id': 'counties_outline',
            'type': 'line',
            'source':'counties_source',
            'maxzoom': zoomThreshold,
            'paint':{
                "line-color": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    "#111",
                    "#999"
                ],
                "line-width": ["case",
                    ["boolean", ["feature-state", "hover"], false],
                    1,
                    0.1
                ],
            }
        }, firstSymbolId);
        
        map.resize();


        map.on("move" ,function(){
            $("#popupBox").css("display", "none")
        });
        map.on("mousemove", "counties_fill", function(e) {
            
            
            // $("#theMap").css("cursor","pointer")

                if (e.features.length > 0) {
                    if (hoveredCtId) {
                        map.setFeatureState({source: 'counties_source', id: hoveredCtId}, { hover: false});
                    }
                    map.getCanvas().style.cursor = "pointer"
                    hoveredCtId = e.features[0].id;
                    var county = e.features[0].properties.countyName;
                    var pnd_rate = e.features[0].properties.pndexp_rate;

                    var popupClass = "dataSupressed"
                    if(pnd_rate == 9999){
                        pnd_rate = "Data Supressed"
                    }else if(pnd_rate>14.2){
                        popupClass = "overrated"
                    }else if(pnd_rate<4.8){
                        popupClass = "underrated"
                    }else if(4.8<pnd_rate<14.2){
                        popupClass = "standard"
                    }
                    $("#popupBox").css("display", "block")
                    $("#popupBox").html("<div class="+popupClass+"><p class='area'>"+county+" County</p><p class='rate'>"+pnd_rate+"</p></div>")

                    map.setFeatureState({source: 'counties_source', id: hoveredCtId}, { hover: true});
                }
            });
             
        map.on("mouseleave", "counties_fill", function() {
            if (hoveredCtId) {
                map.setFeatureState({source: 'counties_source', id: hoveredCtId}, { hover: false});
                $("#popupBox").css("display", "block")
            }
            map.getCanvas().style.cursor = "auto"
            hoveredCtId =  null;
            $("#popupBox").css("display", "none")
        });

        map.on("mouseover", "zips_fill", function(e) {
            $("#popupBox").css("display", "block")
        });
        map.on("mouseover", "counties_fill", function(e) {
            $("#popupBox").css("display", "block")
        });
        
        map.on("mousemove", "zips_fill", function(e) {
            

                if (e.features.length > 0) {
                    if (hoveredZipId) {
                        map.setFeatureState({source: 'zips_source', id: hoveredZipId}, { hover: false});
                    }
                    map.getCanvas().style.cursor = "pointer"
                    hoveredZipId = e.features[0].id;
                    var zipcode = e.features[0].properties.zip;
                    var pnd_rate = e.features[0].properties.pndexp_rate;


                    var popupClass = "dataSupressed"
                    console.log(popupClass)
                    if(pnd_rate == 9999){
                        pnd_rate = "Data Supressed"
                        popupClass = "dataSupressed"
                    }else if(pnd_rate>14.2){
                        popupClass = "overrated"
                    }else if(pnd_rate<4.8){
                        popupClass = "underrated"
                    }else{
                        console.log(pnd_rate)
                        popupClass = "standard"
                    }
                    console.log(popupClass)
                    $("#popupBox").css("display", "block")
                    $("#popupBox").html("<div class="+popupClass+"><p class='area'>"+zipcode+"</p><p class='rate'>"+pnd_rate+"</p></div>")
                    // $("#popupBox").html("<p>"+zipcode+"</p><p>"+pnd_rate+"</p>")
                    console.log(e.features[0].properties)
                    map.setFeatureState({source: 'zips_source', id: hoveredZipId}, { hover: true});
                }
            });
             
        map.on("mouseleave", "zips_fill", function() {
            if (hoveredZipId) {
                map.setFeatureState({source: 'zips_source', id: hoveredZipId}, { hover: false});
                $("#popupBox").css("display", "block")
            }
            hoveredZipId =  null;
            if(!hoveredCtId){
                console.log("left")
                map.getCanvas().style.cursor = "auto"
                $("#popupBox").css("display", "none")
            }
            
        });

        map.on("click", "zips_fill", function(e){
            console.log("clicked")
            console.log(e)
            var zip=e.features[0].properties.zip;
            queryZip(zip)
        })

        map.on("click", "counties_fill", function(e){
            console.log("clicked")
            console.log(e)
            var county=e.features[0].properties.countyName;
            queryCounty(county)
        })


    });
    

}




function queryCounty(county){
    var req_url= api_URL + "/api/nas/nas_county/" + county;
    console.log(req_url)
    $("#notification").removeClass("not-in")
    // $(".test").removeClass("invisible")
    
    $.get(req_url, function(data){
        console.log(data)
        
        if(data.length!==0 && data[14].pndexp_rate!=-1){
            $(".after-query").css("display", "block")
            $(".after-query-slide").removeClass("animate slideIn")
            if (first){
                createMap();
                map.resize();
                setGradHeight();
                svgOut.play()
                setTimeout(function(){
                    $(".pre-query").addClass("started")
                    // $(".pre-query").css("height","80px")
                    $(".after-query-slide").addClass("animate slideIn")
                },1800)
                first=false;
            }
            startTransitionQuery()
            setTimeout(afterDataTransition, 400)
            var c_lat = data[0].cnty_centroid.c_lat
            var c_lng = data[0].cnty_centroid.c_lng
            console.log(c_lat, c_lng)
            map.flyTo({
                center:[c_lng,c_lat],
                zoom: 5.8
            })
            if(pin){
                pin.remove();
            }
            pin = new mapboxgl.Marker()
                .setLngLat([c_lng, c_lat])
                .addTo(map);

            $(".chart1").css("display", "none")
            $("#home-input").text(" ")

            
            // $(".test").addClass("invisible")
            setTimeout(visualizeData,400)
            function visualizeData(){

                var cnt_nas_trend = []
                var cnt_pnd_trend = []
                var rate2010 =data[6].pndexp_rate;
                var rate2011 =data[7].pndexp_rate;
                var rate2009 =data[5].pndexp_rate;
                console.log(rate2009, rate2010, rate2010)
                for (var i=0; i<data.length; i++){
                    if(data[i].nas_rate != -1){
                        cnt_nas_trend.push({"y":data[i].nas_rate, "i": i})
                    }
                    if(data[i].pndexp_rate != -1){
                        cnt_pnd_trend.push({"y":data[i].pndexp_rate, "i":i}) 
                    }

                    if(data[i].pndexp_rate > 85){
                        hasOver65=true;
                    }
                    console.log(cnt_pnd_trend)
                }
                
                var nas_rate= data[14].nas_rate;
                var pnd_rate= parseFloat(data[14].pndexp_rate);
                $("#percent-change-s").css("display", "inline")
                $("#ifZero").css("display", "none")
                if(rate2010 == -1){
                    if(rate2011 == -1){
                        if(rate2009 == -1){
                            $("#percent-change-s").css("display", "none")
                        }else{
                            console.log("hit here")

                            $(".change-year").text("2009")
                            if (rate2009 ==0){
                                $("#percent-change-s").css("display", "none")
                                $("#ifZero").css("display", "inline")
                            }else{
                                var rate_change = ((pnd_rate - rate2009)/rate2009)*100
                            }
                        }
                    }else{
                        $(".change-year").text("2011")
                        if (rate2011 ==0){
                            $("#percent-change-s").css("display", "none")
                            $("#ifZero").css("display", "inline")
                        }else{
                            var rate_change = ((pnd_rate - rate2011)/rate2011)*100
                        }
                    }

                }else{
                    $(".change-year").text("2010")
                    if(rate2010 == 0){
                        $("#percent-change-s").css("display", "none")
                        $("#ifZero").css("display", "inline")
                    }else{
                        var rate_change = ((pnd_rate - rate2010)/rate2010)*100
                    }
                }
                if(pnd_rate<4.8){
                    rateState=  "underrate";
                }else if(pnd_rate>14.2){
                    rateState = "overrate";
                }else if(4.8<pnd_rate<14.2){
                    rateState = "standard";
                }
                $("#res-row").attr("class", rateState)
                $("#main-rate").text(pnd_rate)
                var result = data[0].countyName + " Cty"
                var countyResult = data[0].countyName + " County"
                $(".the-result").text(countyResult)

             
                if(rate_change>0){
                    $(".change-wording").text("increased by ")
                    $(".rate-change").text(rate_change.toFixed(1)+"%")
                }else if(rate_change<0){
                    $(".change-wording").text("decreased by ")
                    $(".rate-change").text(-1*rate_change.toFixed(1)+"%")
                }else{
                    console.log(rate_change)
                    $(".change-wording").text("not changed")
                    $(".rate-change").text("")
                }
                
                createLineChart([state_nas_trend,state_pnd_trend,cnt_nas_trend, cnt_pnd_trend],result);
                var opioid_p = (nas_rate/pnd_rate *100).toFixed(0);
                
                if(pnd_rate==0){
                    $(".desc-row2").css("display","none")
                    $(".desc-row1").addClass("single")
                }else{
                    $(".desc-row2").css("display","flex")
                    $(".desc-row1").removeClass("single")
                }
                $("#opioid-p").text(opioid_p+"%")
                $("#other-p").text(100-opioid_p+"%")
            
            }
        }else if(data.length==0){
            alert("Please Enter a Valid Texas County Name")
        }else{
            var c_lat = data[0].cnty_centroid.c_lat
            var c_lng = data[0].cnty_centroid.c_lng
            console.log(c_lat, c_lng)
            if(!first){
                map.flyTo({
                    center:[c_lng,c_lat],
                    zoom: 5.8
                })
            }

            $("#notification").text("The data is suppressed in this area!")
            svgOut.reverse()
            $("#notification").addClass("not-in")
            setTimeout(function(){
                notTimeout = $("#notification").removeClass("not-in")
            }, 3000)         
        }
        
    })   
}

$("#theMap").mousemove(function(e){
    
    var position_x = e.pageX - $('#theMap').offset().left;
    var position_y = e.pageY - $('#theMap').offset().top;
    var popupX = position_x - $("#popupBox").width()/2
    $("#popupBox").css("left", popupX+"px")
    $("#popupBox").css("top", position_y-60+"px")

})







///MAP LEGEND GENERATOR
function mapLegend(){
    for(var i =0; i<BREAKS.length; i++){
        var legend = $("<div class='legend'>")
        $(".unsuppress").append(legend)
        var legColor = $("<div class='legend-color'>")

        if(i != BREAKS.length-1){
            var breakPoint = $("<div class='break'><p>"+BREAKS[i]+"</p></div>")
            legend.append(breakPoint)
        }
        
        legend.append(legColor)
        legColor.css("background", COLORS[i])

    }
    var legend = $("<div class='legend'>")
    $(".suppress").append(legend)
    var legColor = $("<div class='legend-color'>")
    legend.append(legColor)
    legColor.css("background", COLORS[6])
    $(".suppress").append("<span>Data Suppressed</span>")
}
mapLegend();




///ZOOM BACK TO COUNTY LEVEL
var isCounty=false;

$("#county-btn").on("click", function(e){
    e.preventDefault();
    console.log("clicked")
    if(!isCounty){
        map.flyTo({
            zoom: zoomThreshold -0.8
        })
    }  
})