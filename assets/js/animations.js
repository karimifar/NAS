var babyMove = new TimelineMax({repeat: -1});
babyMove.to("#fetus", 1,{rotation:2, transformOrigin: "50% 50%", ease:Power2.easeIn})
    .to("#fetus", 1,{rotation:5, transformOrigin: "50% 50%", ease:Power2.easeOut})
    .to("#fetus", 1,{rotation:3, transformOrigin: "50% 50%", ease:Power1.easeIn, delay:1})
    .to("#fetus", 1,{rotation:0, transformOrigin: "50% 50%", ease:Power1.easeOut})


function  eitherOr(a,b){
    if (Math.random()>0.5){
        return a
    }else{
        return b
    }
}
function getRandom(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
$(".pill").on("mouseenter", function(){
    var moveX= eitherOr("-=","+=") + getRandom(10,40)
    var moveY= eitherOr("-=","+=") + getRandom(10,40)
    TweenMax.to(this, 0.5, {x:moveX, y:moveY, rotation: getRandom(10, 90), transformOrigin: "50% 50%"})
})

function svgOut(){
    var svgOut = new TimelineMax()
    svgOut.staggerTo("#pills-group-right .pill", 1, {y:-1200, rotation:360, scale:4, transformOrigin:"50% 50%", ease:Back.easeIn},0.1)
        .staggerTo("#pills-group-left .pill", 1, {y:-1200, rotation:360, scale:4, transformOrigin:"50% 50%", ease:Back.easeIn},0.1 ,"-=2")
        .to("#baby", 1,{y:-200, opacity:0, transformOrigin:"50% 50%", ease:Power1.easeOut},"-=1")
        .staggerTo(".ring", 2,{x:100},1)
        .to(".pre-query", 0.1 ,{opacity:0}, "-=3")
}