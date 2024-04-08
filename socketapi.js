const io = require( "socket.io" )();
const socketapi = {
    io: io
};

let usersId = [];
let usersUsername = [];

io.on( "connection", function( socket ) {
    // console.log( "A user connected with " + socket.id );

    socket.on("disconnect", d =>{
        usersId.splice(usersId.indexOf(socket.id),1);
        usersUsername.splice(usersId.indexOf(socket.id),1);
        // io.emit("online", usersId.length);
        // io.emit("name", usersUsername);
    })

    socket.on('username', username =>{
        usersId.push(socket.id);
        usersUsername.push(username);
        // console.log(username);
        // console.log(usersId);
        // console.log(usersUsername);
    })

    socket.on('messages', data =>{
        socket.broadcast.emit('messages', data);
        // console.log(data);
    })
});

module.exports = socketapi;