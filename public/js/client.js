//* Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60); //* 60fps
        };
})();

//! socket.io listea at https://co-op-whiteboard.herokuapp.com
var socket = io('http://localhost:3000/');

$(document).ready(() => {
    socket.on("Server-send-dataURL", (dataURL) => {
        deserialize(dataURL, canvas);
    });

    socket.on("Server-send-context-as-json", (data) => {
        // console.log("Client receive ctx json");
        applyContext(data);
    });
    socket.on("Clear-all", () => {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    })
    socket.on("Server-send-dot-as-json", data => {
        applyDot(data);
    })
});

function sendDataURL() {
    let dataURL_ = canvas.toDataURL();
    socket.emit("Client-send-dataURL", dataURL_);
}

function sendContext(line) {
    socket.emit("Client-send-context", line);
}

// deserialize dataURL to image and apply to casvas
function deserialize(data, canvas) {
    var img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
    };

    img.src = data;
}

//apply (draw) canvas contex to canvas
function applyContext(data) {
    let pX, pY, cX, cY;
    pX = data.prevX;
    pY = data.prevY;
    cX = data.currX;
    cY = data.currY;

    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.lineTo(cX, cY);
    ctx.strokeStyle = data.strokeStyle;
    ctx.lineWidth = data.lineWidth;
    ctx.stroke();
    ctx.closePath();

    //// console.log("apply ctx successfully");
}


//apply (draw) a dot to canvas
function applyDot(data){
    console.log(data);
    let r = data.radius, 
    cX = data.currX;
    cY = data.currY,
    color_fill = data.fillStyle;
    ctx_temp = canvas.getContext('2d');

    console.log("dot drew");
    console.log(r);
    ctx_temp.beginPath();
    ctx_temp.fillStyle = color_fill;
    ctx_temp.arc(cX, cY, r, 0, Math.PI * 2);   
    ctx_temp.fill();
    ctx_temp.closePath();
}

// send a context properties to server
function sendContextJson(json) {
    socket.emit("Client-send-context-as-json", json);
    // ? console.log("client send ctx json");
}

//send a dot properties to server
function sendDotJason(json) {
    socket.emit("Client-send-dot-as-json", json)
}