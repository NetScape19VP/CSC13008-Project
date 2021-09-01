

//! socket.io listen at https://co-op-whiteboard.herokuapp.com


$(document).ready(() => {
    socket.emit('roomId', whiteboardLocalCode)
    socket.on('server-send-line',data => {
        paint.drawLine(data);
    });
    socket.on('server-send-rect',data => {
        paint.drawRectangle(data);
    });
    socket.on('server-send-text',data => {
        //console.log('text',data);
        paint.drawText(data);
    });
    socket.on('server-erase-img', data => {
        paint.clear(data);
    })
    socket.on('server-erase-img', data => {
        paint.clear(data);
    })
    socket.on('data', data => {
        this.applyData(data);
    })
    // socket.on('server-send-img', data => { 
    //     //console.log(data);
    //     paint.drawImage(this.canvas, null, 0, 0, data)
    // })
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