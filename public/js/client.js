

//! socket.io listen at https://co-op-whiteboard.herokuapp.com


$(document).ready(() => {
    socket.on('server-send-line',data => {
        paint.drawLine(data);
    });
    socket.on("Server-send-user", (dataURL) => {
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

// deserialize dataURL to image and apply to canvas
function deserialize(data, canvas) {
    var img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
    };

    img.src = data;
}