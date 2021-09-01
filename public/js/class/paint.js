class Paint {
    constructor(width, height) {
        //create main canvas
        this.canvas = this.createCanvas(width, height);
        this.context = this.canvas.getContext("2d");
        this.context.lineCap = 'round';

        //create temp canvas
        this.tempCanvas = this.createCanvas(width, height, "tempCanvas");
        this.tempContext = this.tempCanvas.getContext("2d");
        this.tempContext.lineCap = "round";

        //create grid canvas
        this.grid = this.createCanvas(width, height, "grid");
        this.drawGrid(50);

        //attributes support drawing
        this.tool = "pen";
        this.prevTool = "";
        this.color = "black";
        this.lineWidth = 20;
        this.fontFamily = 'Arial';
        this.fontSize = 40;

        this.boxInputContainer = this.createInputTextContainer();
        this.insertImgContainer = this.createInsertImgContainer();
        this.insertImgContainer.hide_showContainer('hide');

        //position attributes
        this.startPos = { x: 0, y: 0 };
        this.endPos = { x: 0, y: 0 };
        this.curPos = { x: 0, y: 0 };
        this.prevPos = { x: 0, y: 0 };
        this.nextPos = { x: 0, y: 0 };

        //checking attributes
        this.isDot = false;
        this.isDrawing = false;
        this.isClearing = false;
        this.isInputText = false;
        this.isInsertImg = false;

        //dataURL history attributes
        this.undoHistory = [];
        this.redoHistory = [];

        //* listen to mouse events

        //declare a function to handle mouse move events
        this.mousemove = function (event) {
            if (this.isDrawing) {
                switch (this.tool) {
                    case "pen":
                        this.endPos = this.startPos;
                        this.startPos = this.getMousePos(event);

                        break;
                    case "rectangle":
                        //Temp context is always cleared up before drawing.
                        this.clearCanvas(
                            this.tempContext,
                            0,
                            0,
                            this.tempCanvas.width,
                            this.tempCanvas.height
                        );
                        this.endPos = this.getMousePos(event);
                        break;
                    case "line":
                        //Temp context is always cleared up before drawing.
                        this.clearCanvas(
                            this.tempContext,
                            0,
                            0,
                            this.tempCanvas.width,
                            this.tempCanvas.height
                        );
                        this.endPos = this.getMousePos(event);
                        break;
                }
                this.draw();
            }
            //eraser
            else if (this.isClearing) {
                this.curPos = this.getMousePos(event);
                this.clear();
            }
            //text
            else if (this.isInputText) {
                this.clearCanvas(
                    this.tempContext,
                    0,
                    0,
                    this.tempCanvas.width,
                    this.tempCanvas.height
                );
                this.draw();
                this.curPos = this.getMousePos(event);
                this.setInputTextPosition(this.curPos);
            }
            else if (this.tool === 'hand') {
                this.endPos = this.getMousePos(event);
                console.log('hand', this.startPos, this.endPos);
                window.scrollTo({
                    left: window.pageXOffset + (this.startPos.x - this.endPos.x),
                    top: window.pageYOffset + (this.startPos.y - this.endPos.y),
                    behavior: 'auto'
                });
                //this.startPos = this.endPos;
            }
            else {
                //console.log("default mousemove case");
            }
        };

        /**
         * bind that mousemove function above as a attribute of class Paint
         * @purpose this.handleMouse will not change its value => supporting removeEventListener
         */
        this.handleMousemove = this.mousemove.bind(this);

        this.listenEvents();

        socket.emit('check', 'paint has been created')
    }

    /**
     * This function create a canvas
     * @param {int} width width of the canvas
     * @param {int} height height of the canvas
     * @param {string} selfID ID of the initial canvas
     * @param {string} containerID ID of the container which the initial canvas will be appended to
     * @returns {HTML_DOM_Canvas_object} the initial canvas object
     */
    createCanvas(width, height, selfID = "canvas", containerID = "painter-container") {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.className = "canvas";
        canvas.id = selfID;
        document.getElementById(containerID).appendChild(canvas);

        return canvas;
    }

    /**
     * create a input text container for a text box and a button
     * @returns A dom element container contains an "input text" and a "button"
     */
    createInputTextContainer() {
        //create div element
        let divInputTextContainer = document.createElement("div");
        divInputTextContainer.id = "input-text-container";
        divInputTextContainer.hidden = true;
        divInputTextContainer.innerHTML = `
            <input type="text" id="input-text" placeholder='Enter your text here...'>
            <button id="btn-submit-text">Finish</button>`;

        let painterContainer = document.getElementById("painter-container");
        painterContainer.appendChild(divInputTextContainer);

        return divInputTextContainer;
    }

    createInsertImgContainer() {
        let divInsertImgContainer = document.createElement("div");
        divInsertImgContainer.id = "insert-img-container";
        //divInsertImgContainer.hidden = true;
        divInsertImgContainer.innerHTML = /*html*/
            `<div class='img-container'>
                <!--ref: "http://stackoverflow.com/questions/12967876/how-to-set-different-cursors-for-an-element-and-its-border" -->
                <div class="crop">
                    <img src="" id="insert-img" hidden>
                    <div id='right-line' class="crop-line crop-right-line"></div>
                    <div id='bottom-line' class="crop-line crop-bottom-line"></div>
               
                    <div id='bottom-right-corner' class="crop-corner crop-bottom-right-corner"></div>
                </div>
            </div>
            <button id='btn-finish-insert-img' class='btn-for-insert-img-container'>Finish</button>
            <button id='btn-cancel-insert-img' class='btn-for-insert-img-container'>Cancel</button>`;

        let painterContainer = document.getElementById("painter-container");
        painterContainer.appendChild(divInsertImgContainer);
        $(".crop").resizable({
            animateDuration: "fast",
            handles: {
                'se': '#bottom-right-corner',
                'e': '#right-line',
                's': '#bottom-line',
            },
            resize: () => this.drawInsertImage()
        });

        return {
            DOM: divInsertImgContainer,
            isDragging: false,
            cursorPosition: {
                x: 0,
                y: 0
            },
            hide_showContainer: (state) => {
                if (state == 'hide') {
                    this.insertImgContainer.DOM.hidden = true;
                    //hide everything
                    this.insertImgContainer.DOM.querySelector('.crop').hidden = true;
                    this.insertImgContainer.DOM.querySelector('#btn-finish-insert-img').hidden = true;
                    this.insertImgContainer.DOM.querySelector('#btn-cancel-insert-img').hidden = true;
                } else {
                    this.insertImgContainer.DOM.hidden = false;
                    //show everything
                    this.insertImgContainer.DOM.querySelector('.crop').hidden = false;
                    this.insertImgContainer.DOM.querySelector('#btn-finish-insert-img').hidden = false;
                    this.insertImgContainer.DOM.querySelector('#btn-cancel-insert-img').hidden = false;
                }
            }
        }
    }

    /**
     * Return the current mouse position in the canvas
     * @param {mouseEvent} event mouse event
     * @returns {mousePosObject} the mouse position in the canvas
     */
    getMousePos(event) {
        var rect = this.canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }
    getTouchPos(event) { }

    /**
     * set current paint tool to @tool
     * @param {string} tool name of the tool to set
     */
    setTool(tool) {
        this.prevTool = this.tool;
        this.tool = tool;
        if (this.tool !== "text") {
            console.log("hidden input text");
            this.boxInputContainer.hidden = true;
        }
        if (this.tool === "insertImg") {
            console.log('get');
            this.isInsertImg = true;
            this.insertImgContainer.hide_showContainer('show');
            this.setInsertImgPosition({ x: window.pageXOffset, y: window.pageYOffset }, { x: 0, y: 0 });
        }
    }

    /**
     * set current paint color to @color
     * @param {colorHexCode} color color to draw
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * set current paint lineWidth to @lineWidth
     * @param {int} lineWidth line width to draw
     */
    setLineWidth(lineWidth) {
        console.log('setLineWidth', lineWidth);
        this.lineWidth = lineWidth;
    }

    /**
     * Set position of the input text an show it to user
     * @param {object} position {x: number, y: number} position
     */
    setInputTextPosition(position) {
        let fontSize = typeof this.fontSize === 'undefined' ? 40 : this.fontSize
        this.boxInputContainer.style.left = position.x + "px";
        this.boxInputContainer.style.top = position.y + (fontSize + 5) + "px";

        //? should I put this here?
        //show the input text container
        this.boxInputContainer.hidden = false;
    }

    /**
     * set new position of the insert img container element, keep the cursor position in that element
     * @param {object} positionInCanvas {x: number, y: number}
     * @param {object} positionSelf {x: number, y: number}
     */
    setInsertImgPosition(positionInCanvas, positionSelf = { x: 0, y: 0 }) {

        this.insertImgContainer.DOM.style.left = positionInCanvas.x - positionSelf.x + "px";
        this.insertImgContainer.DOM.style.top = positionInCanvas.y - positionSelf.y + "px";
    }


    /**
     * We add a listener to mousedown, mouseup events and enter key event for input text
     * When mousedown event is activated, add immediately a listener to mousedown events
     * When mouseup event is activated, remove immediately a listener to mousedown events
     */
    listenEvents() {
        //add a listener to mousedown event
        this.tempCanvas.addEventListener(
            "mousedown",
            (event) => {
                this.mousedown(event);
                //add a listener to mousemove event when mousedown is activated
                this.tempCanvas.addEventListener(
                    "mousemove",
                    this.handleMousemove,
                    false
                );
            },
            false
        );

        //add a listener to mouseup event
        this.tempCanvas.addEventListener(
            "mouseup",
            (event) => {
                //remove a listener to mousemove event
                this.tempCanvas.removeEventListener(
                    "mousemove",
                    this.handleMousemove,
                    false
                );
                this.mouseup(event);
            },
            false
        );
        this.tempCanvas.addEventListener("mouseout", (event) => {
            this.tempCanvas.removeEventListener(
                "mousemove",
                this.handleMousemove,
                false
            );
            this.mouseup(event);
        });

        //submitting text by enter key
        this.boxInputContainer.querySelector('#input-text').addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.drawText();
                this.drawImage(canvas, tempCanvas, 0, 0);
                this.boxInputContainer.hidden = true;
                this.boxInputContainer.querySelector('#input-text').value = "";
                this.isInputText = false;
            }
        });
        //submitting text by button submit
        this.boxInputContainer.querySelector('#btn-submit-text').addEventListener('click', (event) => {
            this.drawText();
            this.drawImage(canvas, tempCanvas, 0, 0);
            this.boxInputContainer.hidden = true;
            this.boxInputContainer.querySelector('#input-text').value = "";
            this.isInputText = false;
        })

        //change temp context whenever text in input-text is changed
        this.boxInputContainer.querySelector('#input-text').addEventListener("input", (event) => {
            this.clearCanvas(
                this.tempContext,
                0,
                0,
                this.tempCanvas.width,
                this.tempCanvas.height
            );
            this.drawText();
        });

        //* ---------------------------  AddEventListener to insert img container -----------------------------

        //*drag
        this.insertImgContainer.DOM.querySelector('.crop').addEventListener('mousedown', (event) => {
            console.log('img mouse down');
            this.insertImgContainer.isDragging = true;
            this.curPos = this.getMousePos(event)
            this.insertImgContainer.cursorPosition = {
                x: event.clientX - this.insertImgContainer.DOM.getBoundingClientRect().left,
                y: event.clientY - this.insertImgContainer.DOM.getBoundingClientRect().top
            }
            let x = this.insertImgContainer.cursorPosition.x,
                y = this.insertImgContainer.cursorPosition.y,
                w = this.insertImgContainer.DOM.querySelector('.crop').getBoundingClientRect().width,
                h = this.insertImgContainer.DOM.querySelector('.crop').getBoundingClientRect().height;

            if (x <= 5 || y <= 5 || x >= w - 5 || y >= h - 5) {
                console.log('disable dragging');
                this.insertImgContainer.isDragging = false;
            } else {
                console.log('enable dragging');
            }
            this.insertImgContainer.hidden = false;
        })

        this.insertImgContainer.DOM.querySelector('.crop').addEventListener('mousemove', (event) => {
            //console.log(this.insertImgContainer.dragged);
            if (this.insertImgContainer.isDragging) {
                this.curPos = this.getMousePos(event)

                this.setInsertImgPosition(this.curPos, this.insertImgContainer.cursorPosition);
                this.drawInsertImage();
            }
            //we handle down-size event here
            else {
                //console.log('default case');
            }
        })

        this.insertImgContainer.DOM.addEventListener('mouseup', (event) => {
            this.insertImgContainer.isDragging = false;
        })
        this.insertImgContainer.DOM.addEventListener('mouseover', (event) => {
            this.insertImgContainer.isDragging = false;
        })

        //*button events
        this.insertImgContainer.DOM.querySelector('#btn-finish-insert-img').addEventListener('click', (event) => {
            this.drawImage(
                this.canvas,
                this.tempCanvas,
                0,
                0);
            this.insertImgContainer.hide_showContainer('hide');
            this.isInsertImg = false;
            this.tool = this.prevTool;
        });
        this.insertImgContainer.DOM.querySelector('#btn-cancel-insert-img').addEventListener('click', (event) => {
            this.clearCanvas(this.tempContext, 0, 0, this.tempCanvas.width, this.tempCanvas.height);
            this.insertImgContainer.hide_showContainer('hide');
            this.isInsertImg = false;
        })

        //insert img
        this.insertImgContainer.DOM.querySelector('#insert-img').addEventListener('load', (event) => {
            console.log('event load');
            this.drawInsertImage({
                x: window.pageXOffset,
                y: window.pageYOffset
            });
        })

    }

    //mouse moving methods
    mousedown(event) {
        this.startPos = this.getMousePos(event);
        this.curPos = this.getMousePos(event);

        //Temp context is always cleared up before drawing.
        this.clearCanvas(
            this.tempContext,
            0,
            0,
            this.tempCanvas.width,
            this.tempCanvas.height
        );
        switch (this.tool) {
            case "pen":
                //draw a dot at start
                this.isDrawing = true;
                this.drawDot();
                break;
            case "rectangle":
                this.isDrawing = true;
                break;
            case "circle":
                this.isDrawing = true;
                break;
            case "line":
                this.isDrawing = true;
                break;
            case "triangle":
                this.isDrawing = true;
                break;
            case "text":
                this.isInputText = true;
                this.setInputTextPosition(this.getMousePos(event));
                this.clearCanvas(
                    this.tempContext,
                    0,
                    0,
                    this.tempCanvas.width,
                    this.tempCanvas.height
                );
                this.drawText();
                // //set a time out
                // setTimeout(function () {
                //     this.inputText.focus()
                // }, 1)
                break;
            case "eraser":
                this.isClearing = true;
                this.clear();
                break;
            case "hand":

                break;
        }
    }

    mouseup(event) {

        //draw image for tempCanvas to main canvas
        if (!this.isInputText && !this.isInsertImg) {
            if (this.isDrawing === true) {
                console.log('draw sth to main canvas');
                this.drawImage(this.canvas, this.tempCanvas, 0, 0);
            }
        } else {
            //do nothing
        }


        this.isDrawing = false;
        this.isClearing = false;
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            this.drawText();
            this.boxInputContainer.hidden = true;

            console.log("drew: ", this.boxInputContainer.value);
            this.boxInputContainer.value = "";
        }
    }
    undo() {
        console.log("undo called");
        let currentVersion = this.canvas.toDataURL();
        this.redoHistory.push(currentVersion);

        let previousVersion = this.undoHistory.pop();
        this.clearCanvas(
            this.canvas.getContext(),
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.drawImageFromDataURL(
            this.canvas,
            previousVersion,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    redo() {
        let currentVersion = this.canvas.toDataURL();
        this.undoHistory.push(currentVersion);

        let previousVersion = this.redoHistory.pop();
        this.drawImageFromDataURL(
            this.canvas,
            previousVersion,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    //draw grid for the canvas
    drawGrid(distanceBetweenTwoLine = 10) {
        var gridContext = this.grid.getContext("2d");
        gridContext.width = this.grid.width;
        gridContext.height = this.grid.height;
        gridContext.lineWidth = 1;
        gridContext.strokeStyle = "#dadada";
        gridContext.fillStyle = "#dadada";

        //draw the vertical lines
        for (let x = 0; x <= this.grid.width; x += distanceBetweenTwoLine) {
            gridContext.moveTo(x, 0);
            gridContext.lineTo(x, this.grid.height);
        }
        //draw the horizontal lines
        for (let y = 0; y <= this.grid.height; y += distanceBetweenTwoLine) {
            gridContext.moveTo(0, y);
            gridContext.lineTo(this.grid.width, y);
        }
        gridContext.stroke();
    }

    showHideGrid() {
        let curState = this.grid.hidden;

        if (curState === true) {
            curState = false;
            this.grid.hidden = curState;
        }
        else {
            curState = true;
            this.grid.hidden = curState;
        }
    }
    clear() {
        let context = this.canvas.getContext("2d");
        context.clearRect(
            this.curPos.x - this.lineWidth * 1,
            this.curPos.y - this.lineWidth * 1,
            this.lineWidth * 2,
            this.lineWidth * 2
        );
        socket.emit()
    }


    //draw everything
    draw() {
        switch (this.tool) {
            case "pen":
                this.drawLine();
                break;
            case "rectangle":
                this.drawRectangle();
                break;
            case "line":
                this.drawLine();
                break;
            case "text":
                this.drawText();
                break;
        }
    }

    //draw a line to temp canvas
    drawLine(data) {
        if (!data) {
            this.tempContext.beginPath();
            this.tempContext.moveTo(this.endPos.x, this.endPos.y);
            this.tempContext.lineTo(this.startPos.x, this.startPos.y);
            this.tempContext.strokeStyle = this.color;
            this.tempContext.lineWidth = this.lineWidth;
            this.tempContext.stroke();
            this.tempContext.closePath();

            if (this.tool !== 'line') {
                socket.emit(
                    'client-draw-line',
                    {
                        endPos: { 
                            x: this.endPos.x,
                            y: this.endPos.y
                        },
                        startPos: { 
                            x: this.startPos.x,
                            y: this.startPos.y
                        },
                        color: this.color,
                        lineWidth: this.lineWidth
                    })
            }
        }
        else {
            this.context.beginPath();
            this.context.moveTo(data.endPos.x, data.endPos.y);
            this.context.lineTo(data.startPos.x, data.startPos.y);
            this.context.strokeStyle = data.color;
            this.context.lineWidth = data.lineWidth;
            this.context.stroke();
            this.context.closePath();
        }
    }

    //draw a dot to temp canvas
    drawDot() {
        console.log(this.curPos);
        let radius = this.lineWidth / 2;
        this.tempContext.beginPath();
        this.tempContext.fillStyle = this.color;
        this.tempContext.strokeStyle = this.color;
        this.tempContext.arc(this.curPos.x, this.curPos.y, radius, 0, Math.PI * 2);
        this.tempContext.fill();
        this.tempContext.closePath();
    }

    /**
     * Draw a rectangle to temp canvas
     */
    drawRectangle() {
        this.tempContext.strokeStyle = this.color;
        this.tempContext.fillStyle = this.color;
        this.tempContext.beginPath();
        this.tempContext.rect(
            this.startPos.x,
            this.startPos.y,
            this.endPos.x - this.startPos.x,
            this.endPos.y - this.startPos.y
        );
        this.tempContext.closePath();
        this.tempContext.stroke();
    }

    drawText() {
        let textToDraw = this.boxInputContainer.querySelector('#input-text').value;

        // //check
        // console.log("draw text called", textToDraw);

        this.tempContext.font = `${this.fontSize}px ${this.fontFamily}`;
        this.tempContext.fillStyle = this.color;
        this.tempContext.strokeStyle = this.color;
        this.tempContext.fillText(
            textToDraw,
            this.curPos.x,
            this.curPos.y
        );
        this.tempContext.stroke();
    }
    /**
     * draw image (overlay) from tempCanvas to main canvas
     * @param {HTML_DOM_Canvas_object} mainCanvas destination of the image
     * @param {HTML_DOM_Canvas_object} tempCanvas source of the image
     * @param {int} sx source x-offset
     * @param {int} sy source x-offset
     */
    drawImage(mainCanvas, tempCanvas, sx, sy) {
        /**
         * @reference  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
         */
        let mainContext = mainCanvas.getContext("2d");
        mainContext.drawImage(tempCanvas, sx, sy);
        this.clearCanvas(
            this.tempContext,
            0,
            0,
            this.tempCanvas.width,
            this.tempCanvas.height
        );
    }

    /**
     * clear temp canvas and draw insert image to
     * @param {object} posToDraw {x: number, y: number}
     */
    drawInsertImage(posToDraw) {
        //clear rect before drawing image
        this.clearCanvas(this.tempContext, 0, 0, this.tempCanvas.width, this.tempCanvas.height);
        let sx = 0,
            sy = 0,
            sw = this.insertImgContainer.DOM.querySelector('#insert-img').width,
            sh = this.insertImgContainer.DOM.querySelector('#insert-img').height,
            dx = this.curPos.x - this.insertImgContainer.cursorPosition.x,
            dy = this.curPos.y - this.insertImgContainer.cursorPosition.y,
            dw = this.insertImgContainer.DOM.querySelector('.crop').getBoundingClientRect().width,
            dh = this.insertImgContainer.DOM.querySelector('.crop').getBoundingClientRect().height;

        if (typeof posToDraw !== 'undefined') {
            dx = posToDraw.x;
            dy = posToDraw.y;
        }

        //draw
        let src = this.insertImgContainer.DOM.querySelector('#insert-img');
        this.tempContext.drawImage(
            src,
            sx,
            sy,
            sw,
            sh,
            dx,
            dy,
            dw,
            dh
        )
    }

    /**
     * erases the pixels in a rectangular area by setting them to transparent of a canvas object
     * @param {CanvasRenderingContext2D} context context of canvas to clear
     * @param {int} x start x-offset
     * @param {int} y  start y-offset
     * @param {int} width width to clear
     * @param {int} height height to clear
     */
    clearCanvas(context, x, y, width, height) {
        /**
         * @reference {https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect}
         */
        context.clearRect(x, y, width, height);
    }

    /**
     *
     * @param {HTML_DOM_Canvas_object} canvas
     * @param {dataURL} dataURL source of the image
     * @params {CanvasRenderingContext2D.drawImage.params} https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
     */
    drawImageFromDataURL(canvas, dataURL, x, y, width, height) {
        let context = canvas.getContext("2d");
        let img = new Image();
        img.src = dataURL;
        context.drawImage(img, x, y, width, height);
    }

    exportCanvasAsPNG(canvas, fileName) {
        var MIME_TYPE = "image/png";

        var imgURL = canvas.toDataURL(MIME_TYPE);

        var dlLink = document.createElement("a");
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(":");

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }
    download(fileName = "untitled") {
        this.exportCanvasAsPNG(this.canvas, fileName);
    }
}
