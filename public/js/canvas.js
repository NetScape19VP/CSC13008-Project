$.getScript("/js/client.js")
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

// x: color
// y: line_width
var x = "black",
    y = 2;

var ongoingTouches = [];

//* initialize canvas
function init() {
    canvas = document.getElementById('can');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    //mouse event
    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);

    //TouchEvent
    canvas.addEventListener("touchstart", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        findxy('down', mouseEvent);
        sendNoti("touch start");
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        sendNoti('touch end')
        findxy('up', mouseEvent);
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        findxy('move', mouseEvent);
        sendNoti('touch move');
        canvas.dispatchEvent(mouseEvent);
    }, false);
}

function sendNoti(what) {
    socket.emit("s", what);
}

//* chose color
function color(obj) {
    switch (obj.id) {
        case "green":
            x = "green";
            break;
        case "blue":
            x = "blue";
            break;
        case "red":
            x = "red";
            break;
        case "yellow":
            x = "yellow";
            break;
        case "orange":
            x = "orange";
            break;
        case "black":
            x = "black";
            break;
        case "white":
            x = "white";
            break;
    }
    if (x == "white") y = 14;
    else y = 2;

}

//* set line width
function size() {
    y = $("#lineWidth_input").val();
}

//!draw 
//todo: draw smooth line => use quadraticCurveTo 
function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();

    console.log("Client send data");
    sendDataURL();
    sendContextJson({
        "prevX": prevX,
        "prevY": prevY,
        "currX": currX,
        "currY": currY,
        "strokeStyle": x,
        "lineWidth": y
    });
}

function drawDot() {
    let ctx_temp = canvas.getContext("2d");

    console.log("dot drew");
    let radius = y / 2;
    console.log(radius);
    ctx_temp.beginPath();
    ctx_temp.fillStyle = x;
    ctx_temp.strokeStyle = 'green'
    ctx_temp.arc(currX, currY, radius, 0, Math.PI * 2);
    ctx_temp.fill();
    ctx_temp.closePath();

    sendDotJason({
        'radius': radius,
        "currX": currX,
        "currY": currY,
        "fillStyle": x
    });
}

function erase() {
    var m = confirm("Want to clear");
    if (m) {
        ctx.clearRect(0, 0, w, h);
        console.log("clear all");
        socket.emit("Client-clear-all");
        // sendDataURL();
    }
}

function save() {
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}

//* find mouse offset and call "draw" function
function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        const { pageX, pageY } = e.touches ? e.touches[0] : e;
        currX = e.clientX - canvas.getBoundingClientRect().left;
        currY = e.clientY - canvas.getBoundingClientRect().top;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            drawDot();
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            const { pageX, pageY } = e.touches ? e.touches[0] : e;
            currX = e.clientX - canvas.getBoundingClientRect().left;
            currY = e.clientY - canvas.getBoundingClientRect().top;
            if (y >= 3) {
                drawDot();
            }
            draw();
        }
    }
}