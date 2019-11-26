var openingAnimation = new TimelineMax()
openingAnimation.staggerFrom("#pills-group-right .pill", 1.5, {opacity:0,scale:0, rotation:100, y:-100, x:100, transformOrigin:"50% 50%", ease:Power4.easeOut},0.1)
openingAnimation.staggerFrom("#pills-group-left .pill", 1.5, {opacity:0,scale:0, rotation:-100, y:-100, x:-100,transformOrigin:"50% 50%", ease:Power4.easeOut},0.09, "-=2.5")






var fetusMove = new TimelineMax({repeat: -1});
fetusMove.to("#fetus", 1,{rotation:getRandom(1,3), transformOrigin: "50% 50%", ease:Power2.easeIn})
    .to("#fetus", 1,{rotation:getRandom(3,6), transformOrigin: "50% 50%", ease:Power2.easeOut})
    .to("#fetus", 1,{rotation:getRandom(1,5), transformOrigin: "50% 50%", ease:Power1.easeIn, delay:1})
    .to("#fetus", 1,{rotation:0, transformOrigin: "50% 50%", ease:Power1.easeOut})
    

var ringMove = new TimelineMax({repeat:-1});
for(var i=0; i<10; i++){
    ringMove.to(".ring-1", 1,{opacity:Math.random, ease:Power2.easeIn})
    ringMove.to(".ring-2", 1,{opacity:Math.random, ease:Power2.easeIn})
    ringMove.to(".ring-3", 1,{opacity:getRandom(5,10)/10, ease:Power2.easeIn})
}
ringMove.staggerTo(".ring", 1,{opacity:1, ease:Power2.easeIn},1)
// ringMove.staggerTo(".ring", 1,{opacity:1},0.5)

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

var svgOut= new TimelineMax({paused: true})
svgOut.staggerTo("#pills-group-right .pill", 1, {y:-1200, rotation:360, scale:4, transformOrigin:"50% 50%", ease:Back.easeIn},0.05)
    .staggerTo("#pills-group-left .pill", 1, {y:-1200, rotation:360, scale:4, transformOrigin:"50% 50%", ease:Back.easeIn},0.05 ,"-=2")
    .to("#baby-all", 1,{y:-200, opacity:0, transformOrigin:"50% 50%", ease:Power1.easeOut},"-=0.4")
    .to(".pre-query", 0.1 ,{opacity:0, y:-100 , ease:Power4.easeIn},"-=1")
    // .fromTo(".after-query", 1 ,{opacity:0},{opacity:1})

svgOut.duration(1.8)

