window.onload = function () {
    handleBtnEvent('init');
    var eventBtn = document.getElementById("submitText");
    eventBtn.addEventListener("click", checkValidData);

    const inputWhiteBoardNameDOM = document.querySelector('#enterName');
    var isInput = false;
    if (!inputWhiteBoardNameDOM) {
        console.log('not exist item');
    }
    else {
        inputWhiteBoardNameDOM.addEventListener('keypress', (event) => {
            var regex = /^[\w\d]$/;
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

            //* invalid input case 
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
            //? check if space input on front
            else if (isInput === false) {
                //if space
                if (key === ' ') {
                    event.preventDefault();
                    return false;
                }
                else {
                    isInput = true;
                }
            }
        })
    }
}

/*
 * handle button click event
 * @event: init - btn-join-click btn-create-click
 */
function handleBtnEvent(event) {
    if (event == 'init') {
        document.getElementById("btn-join").hidden = false;
        document.getElementById("btn-create").hidden = false;

        document.getElementById("recentBoard").hidden = false;

        document.getElementById("join").hidden = true;
        document.getElementById("create").hidden = true;

        document.getElementById("enterCode").hidden = true;
        document.getElementById("enterName").hidden = true;

        document.getElementById("back").hidden = true;
        document.getElementById("submit").hidden = true;

        document.getElementById("message").hidden = true;
    }
    else if (event == 'btn-join-click') {
        document.getElementById("btn-join").hidden = true;
        document.getElementById("btn-create").hidden = true;

        document.getElementById("recentBoard").hidden = true;

        document.getElementById("join").hidden = false;
        document.getElementById("create").hidden = true;

        document.getElementById("enterCode").hidden = false;
        document.getElementById("enterName").hidden = true;

        document.getElementById("back").hidden = false;
        document.getElementById("submit").hidden = false;
        document.getElementById("submitText").innerHTML = "Join";
    }
    else if (event == 'btn-create-click') {
        document.getElementById("btn-join").hidden = true;
        document.getElementById("btn-create").hidden = true;

        document.getElementById("recentBoard").hidden = true;

        document.getElementById("join").hidden = true;
        document.getElementById("create").hidden = false;

        document.getElementById("enterCode").hidden = true;
        document.getElementById("enterName").hidden = false;

        document.getElementById("back").hidden = false;
        document.getElementById("submit").hidden = false;
        document.getElementById("submitText").innerText = "Create";
    }
}

const whiteboardName = "chauchau";
const whiteboardCode = { id: "ABCDEFGH" };
/*
 * check valid data
 * @data: null - duplicate name - id does not exist
 */
async function checkValidData() {
    var eventBtn = document.getElementById("submitText").innerHTML;
    document.getElementById("message").hidden = false;
    if (eventBtn === 'Join') {
        var inputCode = document.getElementById("enterCode").value;
        if (inputCode.length === 0) {

            document.getElementById("message").innerHTML = `<div class="alert alert-danger" role="alert">
                                                                Please enter code
                                                            </div>`
        }
        else {
            //send request to server
            let resultOfJoining = await joinWhiteboard(inputCode);
            console.log(resultOfJoining);
            if (resultOfJoining.status === "success") {
                //redirect to created whiteboard
                window.location.href = `/board/${resultOfJoining.whiteboardCode}`;
                document.getElementById("message").innerHTML = '';

            }
            //failed
            else {
                document.getElementById("message").innerHTML = /*html*/
                    `<div class="alert alert-danger" role="alert">
                        Whiteboard is not exist
                    </div>`

            }

        }
    }
    //btn create
    else {
        let regexForValidWBName = /^[\w\d]{2,20}$/
        var inputWBName = document.getElementById("enterName").value;
        if (inputWBName.length === 0) {
            document.getElementById("message").innerHTML = `<div class="alert alert-danger" role="alert">
                                                                Please enter name
                                                            </div>`
        }
        //check is valid name
        else if (!regexForValidWBName.test(inputWBName)) {
            document.getElementById("message").innerHTML = `
            <div class="alert alert-danger" role="alert">
                Invalid whiteboard name, please check again.
            </div>`
        }
        else {
            //send request to server
            let resultOfCreating = await createWhiteBoard(inputWBName);
            console.log(resultOfCreating);
            if (resultOfCreating.status === "success") {
                //redirect to created whiteboard
                window.location.href = `https://co-op-whiteboard.herokuapp.com/board/${resultOfCreating.whiteboardCode}`;
                document.getElementById("message").innerHTML = '';

            }
            //failed
            else {
                document.getElementById("message").innerHTML = /*html*/
                    `<div class="alert alert-danger" role="alert">
                    Whiteboard's name "${inputWBName}" already exist
                </div>`

            }
        }

    }
}



