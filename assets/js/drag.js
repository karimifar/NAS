var BORDER_SIZE = 6;
var rightPanel = document.getElementById("right-panel");
var leftPanel = document.getElementById("left-panel");
var panelSlider = document.getElementById("panelSlider");
var m_pos;
var leftClosed = false
function resize(e){
    var dx = m_pos - e.x;
    m_pos = e.x;
    if((e.x<0.8*screenW)){
        if(m_pos<0.4*screenW){
            document.querySelector("#left-panel").classList.add("narrow")
        }else{
            document.querySelector("#left-panel").classList.remove("narrow")
        }
        if(m_pos<0.35*screenW){
            $("#panelSlider").addClass("closed")
            leftClosed = true;
            
            leftPanel.style.width = "0px";
            rightPanel.style.width = screenW + "px";
            map.resize();
            return
        }else{
            leftClosed = false;
            leftPanel.style.width = m_pos + "px";
            rightPanel.style.width = screenW-m_pos + "px";
            console.log(m_pos + "px")
            console.log(e.x)
            map.resize();
            setGradHeight()
        }
        
    }

  
}



panelSlider.addEventListener("mousedown", function(e){
    if(leftClosed){
        leftClosed = false;
        leftPanel.style.width = 0.35*screenW +"px";
        rightPanel.style.width = 0.65*screenW + "px";
        map.resize();
        setGradHeight();
    }else{
        document.addEventListener("mousemove", resize, false);
    }
    $("body").css("pointer-events", "none")
    m_pos = e.x;
  }, false);

document.addEventListener("mouseup", function(){
    $("body").css("pointer-events", "auto")
    document.removeEventListener("mousemove", resize, false);
}, false);

// panelSlider.addEventListener("click", function(e){
//     console.log("clicked")
    
// })
