var BORDER_SIZE = 6;
var rightPanel = document.getElementById("right-panel");
var leftPanel = document.getElementById("left-panel");
var panelSlider = document.getElementById("panelSlider");
var m_pos;
function resize(e){
    var dx = m_pos - e.x;
    m_pos = e.x;
    var leftPanel_width = parseInt(getComputedStyle(leftPanel, '').width)
    if((dx<0 || 0.3*screenW<leftPanel_width)&& (dx>0 || leftPanel_width<0.8*screenW) ){
        rightPanel.style.width = (parseInt(getComputedStyle(rightPanel, '').width) + dx) + "px";
        leftPanel.style.width = (parseInt(getComputedStyle(leftPanel, '').width) - dx) + "px";
        map.resize();
        setGradHeight()
    }
  
}

panelSlider.addEventListener("mousedown", function(e){
    m_pos = e.x;
    document.addEventListener("mousemove", resize, false);
  }, false);

document.addEventListener("mouseup", function(){
    document.removeEventListener("mousemove", resize, false);
}, false);