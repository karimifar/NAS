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

var lineGenerator = d3.line()
	.curve(d3.curveBasis);

var points = [
    [80, 0],
    [80,90],
	[150, 90],
];
var points2 = [
    [78, 0],
    [78,180],
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