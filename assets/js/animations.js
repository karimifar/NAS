var babyMove = new TimelineMax({repeat: -1});
babyMove.to("#fetus", 1,{rotation:2, transformOrigin: "50% 50%", ease:Power2.easeIn})
    .to("#fetus", 1,{rotation:5, transformOrigin: "50% 50%", ease:Power2.easeOut})
    .to("#fetus", 1,{rotation:3, transformOrigin: "50% 50%", ease:Power1.easeIn, delay:1})
    .to("#fetus", 1,{rotation:0, transformOrigin: "50% 50%", ease:Power1.easeOut})