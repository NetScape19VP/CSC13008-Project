const session = require('express-session')
const passport = require('passport')
const port = 3000
const authRouter = require('../routes/auth-routes');
const boardRouter = require('../routes/board-routes')
const passportSetup = require('../config/passport-setup')
const keys = require('../config/keys')
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('../utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set up mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nmphat-mongodb:v!npXf9X277i_XQ@test.vhxrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (!err) {
            console.log('ket noi database thanh cong');
        }
        else {
            console.log('ket noi database that bai');
        }
    });
mongoose.set('useFindAndModify', false);


var dataURL_saving = "";

//set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}))


// * passport init
app.use(passport.initialize());
app.use(passport.session());


// * set up routes
app.use(express.static("public"));
app.use('/auth', authRouter)
app.use('/board', boardRouter)

//socket.io server listening
server.listen(process.env.PORT || port);


// * server and client
io.on("connection", function (socket) {
    console.log(socket.id, " vua ket noi");
    socket.emit("Server-send-dataURL", dataURL_saving);
    socket.on("disconnect", function () {
        console.log(socket.id, " vua ngat ket noi");
    });
    socket.on("Client-send-dataURL", function (dataURL) {
        dataURL_saving = dataURL;
    });
    socket.on("Client-send-context-as-json", function (data) {
        socket.broadcast.emit("Server-send-context-as-json", data);
        // console.log("server send ctx");
    });
    socket.on("s", (data) => { console.log(data); });
    socket.on("Client-clear-all", () => {
        socket.broadcast.emit("Clear-all");
        console.log("clear all");
    })
    socket.on("Client-send-dot-as-json", (data) => {
        console.log("send dot");
        socket.broadcast.emit("Server-send-dot-as-json", data);
    })

    // ===================
    // == Chat handling ==
    // ===================

    socket.on('joinRoom', ({ username, room }) => {
		//const user = userJoin(socket.id, username, room);
		const user = userJoin(socket.id, username, room);
        socket.join(user.room);

		// welcome message
		socket.emit('message', formatMessage('bot', 'Welcome to breakout room'));

		// broadcast when a member join -- except the member was connected
		socket.broadcast.to(user.room).emit('message', formatMessage('bot', `${user.username} has joined this room`));
		
		// send user and room infos
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room)
		});
	});

	// run when member disconnect
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			io.to(user.room).emit('message', formatMessage('bot', `${user.username} has left breakout room`));
		}

	});
	//broadcast to all
	//io.emit();

	//listen for chatMessage
	socket.on('chatMessage', msg => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});
});

app.get("/", function (req, res) {
    res.render('login');
});
