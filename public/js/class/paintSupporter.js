function setTool(tool) {
    console.log(`set ${paint.tool} to ${tool}`);
    paint.setTool(tool);
}
function clearAll() {
    paint.clear();
}
function download() {
    console.log("download");
    paint.download();
}

async function loadFile(event) {
    var image = document.getElementById('insert-img');

    image.src = await URL.createObjectURL(event.target.files[0]);

    setTool('insertImg', document.querySelector('#btn-insert-img'));
};

function grid() {
    paint.showHideGrid();
};
