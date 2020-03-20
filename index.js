var express = require("express");
var socket = require("socket.io");
var listaEspera = [];
var listaPontuacoes = [];
var pessoasAtivas = [];
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
        listaEspera.forEach(element => {
            console.log(element);
        });
    });

    socket.on("proximoJogo", function() {
        console.log(listaEspera);
        console.log("primeiro");
        if (listaEspera.length < 2) {
            console.log("segundo");
            io.sockets.emit("jogofail", null);
        } else {
            pessoasAtivas = listaEspera.splice(0, 2);
            console.log(pessoasAtivas[0], pessoasAtivas[1]);
            io.sockets.emit("novoJogo", pessoasAtivas);
        }
    });

    socket.on("fimDoJogo", function(data) {
        listaPontuacoes[data[0].username] = [data[0].username, data[0].pontuacao, data[0].id];
        listaPontuacoes[data[1].username] = [data[1].username, data[1].pontuacao, data[1].id];
    });
});
