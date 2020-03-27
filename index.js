var express = require("express");
var socket = require("socket.io");
var listaEspera = [];
var listaPontuacoes = [];
var pessoasAtivas = [];
var tresPrimeiros = [];

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
    io.sockets.emit("novoListaEspera", listaEspera);
    io.sockets.emit("inserePontuacoes", tresPrimeiros);
    socket.on("listaEspera", function(data) {
        console.log(data);
        listaEspera.push(data.username);
        listaEspera.forEach(element => {
            console.log(element);
        });
        io.sockets.emit("novoListaEspera", listaEspera);
    });

    socket.on("proximoJogo", function() {
        console.log(listaEspera);
        console.log("primeiro");
        if (listaEspera.length < 2) {
            console.log("segundo");
            io.sockets.emit("jogofail", null);
        } else {
            pessoasAtivas = listaEspera.splice(0, 2);
            console.log(pessoasAtivas[0], pessoasAtivas[1], "Emitindo novos jogadores");
            io.sockets.emit("novoJogo", pessoasAtivas);
        }
    });

    socket.on("fimDoJogo", function(data) {
        console.log(data);
        listaPontuacoes.push([data[0][1], data[0][0]]);
        listaPontuacoes.push([data[1][1], data[1][0]]);
        listaPontuacoes.sort(function(a, b) {
            return b[0] - a[0];
        });
        console.log(listaPontuacoes);
        tresPrimeiros[0] = listaPontuacoes[0];
        tresPrimeiros[1] = listaPontuacoes[1];
        tresPrimeiros[2] = listaPontuacoes[2];
        io.sockets.emit("inserePontuacoes", tresPrimeiros);
    });
});
