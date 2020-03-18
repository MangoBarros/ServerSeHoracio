var express = require("express");
var socket = require("socket.io");
var listaEspera = [];
// App setup

var app = express();
var server = app.listen(4000, function() {
    console.log("listening to requestes on port 4000");
});

//Static files
app.use(express.static("public"));

//Socket setup
var io = socket(server);

io.on("connection", function(socket) {
    console.log("made socket connection", socket.id);

    socket.on("listaEspera", function(data) {
        console.log(data);
        listaEspera.push(data.username);
        //io.sockets.emit("listaEspera", data);
        listaEspera.forEach(element => {
            console.log(element);
        });
    });
});
