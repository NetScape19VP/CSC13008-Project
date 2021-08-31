//pencil
document.querySelector('#pencil').onclick = (() => {
    console.log('set ', paint.tool, ' to pen');
    paint.setTool('pen');
})


const inputValue = document.getElementById('width-range');
let val = inputValue.value; // val = value of lineWidth
//cursor
const cursorp = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    if (e.pageX - val/2 < 90 && e.pageY - val/2 < 630) {
        // cursorp.style.left = 50 + "%";
        // cursorp.style.top = 50 + "%";
    } else {
        cursorp.style.left = (e.pageX - val/2) + "px";
        cursorp.style.top = (e.pageY - val/2) + "px";
    }
})

//color-picker
let colorIndicator = document.getElementById('color-indicator');
const colorPicker = new iro.ColorPicker('#picker', {
    width: 100,
    color: "#fff"
});
colorPicker.on('color:change', function (color) {
    colorIndicator.style.backgroundColor = color.hexString;

    //* set color
    paint.setColor(color.hexString);
    cursorp.style.backgroundColor = color.hexString;
});

//line-width
const widthValue = document.getElementById('width-value');
inputValue.oninput = (() => {
    val = inputValue.value;
    console.log(parseInt(val, 10));

    //*set line-width
    paint.setLineWidth(parseInt(val, 10))
    widthValue.textContent = val;
    widthValue.style.left = (val * 1.7) + "%";
    widthValue.classList.add("show");

    cursorp.style.width = val + "px";
    cursorp.style.height = val + "px";
});
inputValue.onblur = (() => {
    widthValue.classList.remove("show");
});
/*
var mainCursor = document.body;*/

//button events
//lineWidth
var lineW=false;
var lineWidth=document.getElementById("lineWidth");
var lineWidthPicker=document.getElementById("lineWboard");
lineWidth.addEventListener('click',() => {
    if(lineW==false) {
        lineWidthPicker.style.left = 85 + "px";
        lineWidthPicker.style.opacity = 1;
        lineW=true;
    }
    else {
        lineWidthPicker.style.left = -300 + "px";
        lineWidthPicker.style.opacity = 0;
        lineW=false;
    }   
})
lineWidthPicker.addEventListener('click',() => {
    lineWidthPicker.style.left = -300 + "px";
    lineWidthPicker.style.opacity = 0;
    lineW=false;
})

//color button
var colorClose=document.getElementById("closeColor");
var cPicker=document.getElementById("colorPicker");
var cBoard=document.getElementById("ColorBoard");
cPicker.addEventListener('click', () => {
        cBoard.style.top = 110 + "px";
        cBoard.style.opacity = 1;
})
colorClose.addEventListener('click', () =>{
        cBoard.style.top = -250 + "px";
        cBoard.style.opacity = 0;
})

//shape
var shape=true;
var ShapeTools=document.getElementById("Shape");
var ShapeBoard=document.getElementById("shape-tool");
ShapeTools.addEventListener('click',() => {
    console.log('click on shape');
    shape= !shape;
    if(shape==false) {
        console.log(1);
        ShapeBoard.style.top = 250 + "px";
        ShapeBoard.style.left = 85 + "px";
        ShapeBoard.style.opacity = 1;
        
    }
    else {
        console.log(2);

        ShapeBoard.style.top = -250 + "px";
        ShapeBoard.style.left = -100 + "%";
        ShapeBoard.style.opacity = 0;
    }   
})
ShapeBoard.addEventListener('click', () => {
    ShapeBoard.style.top = -250 + "px";
    ShapeBoard.style.left = -100 + "%";
    ShapeBoard.style.opacity = 0;
    shape=false;
})

//text font
var textbtn=document.getElementById("font-style");
var txt=document.getElementById("txt");
var closetext=document.getElementById("closeText");
textbtn.addEventListener('click', () => {
        txt.style.left = 95 + "px";
        txt.style.opacity = 1;
        paint.setTool('text');
})
closetext.addEventListener('click', () =>{
        txt.style.left = -200 + "px";
        txt.style.opacity = 0;
})

//eraser
var eraser=false;
var clear=document.getElementById("eraser");
var clearAll=document.getElementById("clearAll");
clear.addEventListener('click',() => {
    paint.setTool('eraser')
    if(eraser==false) {
        clearAll.style.top = 100 + "px";
        clearAll.style.opacity = 1;
       /* mainCursor.style.cursor = "url(../images/tool/eraswe.svg)";*/
        eraser=true;
    }
    else {
        clearAll.style.top = -200 + "px";
        clearAll.style.opacity = 0;
        eraser=false;
    }   
})
clearAll.addEventListener('click', () => {
    paint.clearCanvas(paint.tempContext, 0, 0, paint.tempCanvas.width, this.tempCanvas.height);
    clearAll.style.left = -50 + "%";
    clearAll.style.opacity = 0;
    eraser=false;
})


//chat box
//chat button event
const chatbtn=document.getElementById("chat-btn");
const chatbox=document.getElementById("chat");
var chat=false;
chatbtn.addEventListener('click', () => {
    if(chat==true) {
        chatbox.style.right = -500 + "px";
        chatbox.style.opacity = 0;
        chat=false;
    }
    else {
        chatbox.style.right = 20 + "px";
        chatbox.style.opacity = 1;
        chat=true;
    }
})

//change bachground button
var pencil=document.getElementById("pencil");
var movehand=document.getElementById("move");

var arrButton=[pencil, clear, ShapeTools, textbtn, movehand];
arrButton.forEach(element => {
    element.addEventListener('click', () => {
        arrButton.forEach(element2 => {
            element2.style.background = "white";
        })
        element.style.background = "lime";
    })
})

//clear subtools
var AddImg=document.getElementById("addImg");
var grid=document.getElementById("grid");
var Download=document.getElementById("download");
//all button from wrapper here
var arr1 = [pencil, clear, lineWidth, cPicker, ShapeTools, textbtn, AddImg, movehand, grid, Download];

//clear button
var arr1 = [pencil, lineWidth, cPicker, ShapeTools, textbtn, AddImg, movehand, grid, Download];
arr1.forEach(element => {
    element.addEventListener('click',() => {
        if(eraser==true) {
            clearAll.style.left = -50 + "%";
            clearAll.style.opacity = 0;
            eraser=false;
        }
    })
})
//line-width board
var arr2 = [pencil, clear, cPicker, ShapeTools, textbtn, AddImg, movehand, grid, Download];
arr2.forEach(element => {
    element.addEventListener('click',() => {
        if(lineW==true) {
            lineWidthPicker.style.left = -300 + "px";
            lineWidthPicker.style.opacity = 0;
            lineW=false;
        }
    })
})
//color-picker board
var arr3 = [pencil, clear, lineWidth, ShapeTools, textbtn, AddImg, movehand, grid, Download];
arr3.forEach(element => {
    element.addEventListener('click',() => {
        cBoard.style.top = -200 + "px";
        cBoard.style.opacity = 0;
    })
})
//shape-subtools
var arr4 = [pencil, clear, lineWidth, cPicker, textbtn, AddImg, movehand, grid, Download];
arr4.forEach(element => {
    element.addEventListener('click',() => {
        if(shape==true) {
            ShapeBoard.style.left = -100 + "%";
            ShapeBoard.style.opacity = 0;
            shape=false;
        }
    })
})
//font-style board
var arr5 = [pencil, clear, lineWidth, cPicker, ShapeTools, AddImg, movehand, grid, Download];
arr5.forEach(element => {
    element.addEventListener('click',() => {
        txt.style.left = -200 + "px";
        txt.style.opacity = 0;
    })
})