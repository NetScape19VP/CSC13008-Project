const User = require('../models/users');
const Whiteboard = require('../models/whiteboards');
const mongoose = require('mongoose');

//get /board
const mainPageController = async (req, res) => {


    async function getRecentBoards(listBoardCode) {
        let recentBoards = [];
        for (const boardCode of listBoardCode) {
            let result = await Whiteboard.findById(boardCode)

            if (result) {
                console.log('board found: ', result);
                recentBoards.push(result);
            }
        };
        console.log('recentBoard get: ', recentBoards);
        return recentBoards;
    }
    let recentBoards = await getRecentBoards(req.user.boards);
    console.log('recentBoard after: ', recentBoards);
    console.log(req.user);
    res.render('mainPage', {
        user: req.user,
        recentBoards: recentBoards
    })
}

//get board/:boardID
const whiteboardController = async (req, res) => {
    //check is valid route
    Whiteboard.findOne({ _id: req.params.whiteboardCode }).then((board) => {
        if (!board) {
            console.log('invalid route');
            res.redirect('/error')
        }
        else {
            //if user have never join this room before, add it to user's boards list
            User.findOneAndUpdate(
                {
                    _id: req.user._id
                },
                {
                    $addToSet: {
                        boards: req.params.whiteboardCode
                    }
                }, err => {
                    if (err) {
                        console.log('update failed', err.message);
                    }
                    else {
                        console.log('update list success')
                    }
                })

            res.render('whiteboard', {
                user: req.user,
                whiteboardCode: req.params.whiteboardCode,
                whiteboardName: board.name
            })
        }
    })
}

function isValidWhiteboardName(whiteBoardName) {
    let regexForValidWBName = /^[\w\d]{2,20}$/
    return regexForValidWBName.test(whiteBoardName);
}

const createWhiteboard = async (req, res, next) => {
    console.log(req.body);
    if (!isValidWhiteboardName(req.body.roomName)) {
        res.json(JSON.stringify({
            status: 'failed',
        }))
    }

    async function checkIsExistWhiteboard(whiteboardName) {
        const whiteboard = await Whiteboard.findOne({ name: whiteboardName}).exec();
        if (whiteboard) {
            console.log('Found room with ID: ' + whiteboardName);
            return true;
        }
        console.log('Cannot find room with ID: ' + isValidWhiteboardName);
        return false;
    }

    const check = await checkIsExistWhiteboard(req.body.whiteboardName);
    //room found => cannot create a new room
    if (check) {
        res.json(JSON.stringify({
            status: 'failed'
        }))
    }
    //room not found
    else {
        new Whiteboard({
            name: req.body.whiteboardName
        }).save().then((newWhiteboard) => {
            console.log('Create room with name: ' + newWhiteboard.name);
            //res.send('Create room with name: ' + newRoom.name);
            res.json(JSON.stringify({
                status: 'success',
                whiteboardCode: newWhiteboard._id
            }))
        });
    }
}

/**
 * @returns boolean
 */
const isExistWhiteboard = async (req, res, next) => {
    /**
     * inner func
     */
    async function checkIsExistWhiteboard(whiteboardCode) {
        try {
            var id = mongoose.Types.ObjectId(whiteboardCode);
        }
        catch (err) {
            console.log('loi', err);
            next();
        }
        const whiteboard = await Whiteboard.findOne({ _id: id}).exec();
        if (whiteboard) {
            console.log('Found room with ID: ' + whiteboardCode);
            return true;
        }
        console.log('Cannot find room with ID: ' + whiteboardCode);
        return false;
    }

    const check = await checkIsExistWhiteboard(req.body.whiteboardCode);
    //room found 
    if (check) {
        res.json(JSON.stringify({
            status: 'success',
            whiteboardCode: req.body.whiteboardCode
        }))
    }
    //room not found
    else {
        res.json(JSON.stringify({
            status: 'failed',
        }))
    }
}

const deleteWhiteboard = (req, res) => {
    room.findOneAndRemove({
        _id: req.body.whiteboardCode
    }).then((whiteboard) => {
        if (whiteboard === null) {
            console.log('Can not delete room with ID: ' + req.body.whiteboardCode);
        } else {
            console.log('Delete successful room with ID: ' + req.body.whiteboardCode);
        }
    })
}

module.exports = {
    mainPageController,
    whiteboardController,
    createWhiteboard,
    isExistWhiteboard,
    deleteWhiteboard
}