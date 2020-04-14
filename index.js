const express = require("express");
const socket = require("socket.io");
let listaEspera = [];
//let listaSocketIds = [];
let listaPontuacoes = [];
let pessoasAtivas = [];

let pessoasPorAceitar = [];
let tresPrimeiros = [];

let PlayerNames = [];
for (let i = 0; i < 20; i++) {
    PlayerNames.push("NomeJogador: " + i);
}

// App setup

const app = express();
/*var server = app.listen(4000, function() {
    console.log("listening to requestes on port 4000");
});
*/
const server = require("http").createServer(app);
server.listen(process.env.PORT || 4000);

//Static files
app.use(express.static("public"));

/*
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/game", function (req, res) {
    res.sendFile(__dirname + "/public/game.html");
});
*/

//Socket setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("made socket connection", socket.id);

    io.sockets.emit("novoListaEspera", listaEspera);

    io.sockets.emit("inserePontuacoes", tresPrimeiros);

    socket.on("listaEspera", function (data) {
        console.log(data);

        let aux = Math.floor(Math.random() * PlayerNames.length);
        let name = [PlayerNames[aux], socket.id];
        listaEspera.push([name[0], socket.id]);
        //listaSocketIds.push(socket.id);
        /*for (let i = 0; i < listaSocketIds.length; i++) {
            console.log(listaSocketIds[i]);
        }
        
        */
        PlayerNames.splice(aux, 1);

        listaEspera.forEach((element) => {
            console.log(element);
        });
        io.to(socket.id).emit("nomeJogador", name);
        if (listaEspera.length == 1) {
            console.log("jogador novo e seguinte 1");
            emitSuaVez1(socket.id);
            io.sockets.emit("novoListaEspera", listaEspera);
        }
        if (listaEspera.length == 2) {
            console.log("jogador novo e seguinte 2");
            emitSuaVez2(socket.id);
            pessoasPorAceitar = listaEspera.splice(0, 2);
            io.sockets.emit("novoListaEspera", listaEspera);
        } else {
            console.log("jogador novo para a fila");
            io.sockets.emit("novoListaEspera", listaEspera);
        }
    });

    socket.on("jogoAceite", function (data) {
        console.log("O jogo foi aceite pelo jogador : ," + data.jogador);
        console.log("Jogadore que tem de aceitar : " + pessoasPorAceitar[0][1] + " ----- " + pessoasPorAceitar[1][1]);

        if (pessoasPorAceitar[0][1] == data.jogador) {
            pessoasAtivas.push(pessoasPorAceitar[0]);
        }
        if (pessoasPorAceitar[1][1] == data.jogador) {
            pessoasAtivas.push(pessoasPorAceitar[1]);
        }
        console.log(pessoasAtivas);
        if (pessoasAtivas.length == 2) {
            io.sockets.emit("novoJogo", [pessoasAtivas, listaEspera]);
        }
    });

    socket.on("proximoJogo", function (data) {
        console.log("Proximo jogo: pessoas na lista de espera: " + listaEspera.length);
        if (listaEspera.length < 2) {
            console.log("Não há pessoas suficientes para o proximo jogo");
            io.sockets.emit("jogofail", "Não há pessoas suficientes para o proximo jogo");
        } else {
            pessoasPorAceitar = listaEspera.splice(0, 2);
            console.log(pessoasPorAceitar[0][0], pessoasPorAceitar[1][0], "Emitindo novos jogadores");
            emitSuaVez1(pessoasPorAceitar[0][1]);
            emitSuaVez2(pessoasPorAceitar[1][1]);
        }
    });

    socket.on("fimDoJogo", function (data) {
        console.log(data);
        if (pessoasAtivas.length != 0) {
            listaPontuacoes.push([data[0][1], data[0][0]]);
            listaPontuacoes.push([data[1][1], data[1][0]]);
            listaPontuacoes.sort(function (a, b) {
                return b[0] - a[0];
            });
            console.log(listaPontuacoes);
            tresPrimeiros[0] = listaPontuacoes[0];
            tresPrimeiros[1] = listaPontuacoes[1];
            tresPrimeiros[2] = listaPontuacoes[2];
            pessoasAtivas.pop();
            pessoasAtivas.pop();
            io.sockets.emit("inserePontuacoes", tresPrimeiros);
        }
    });
});

function emitSuaVez1(id1) {
    console.log(id1);
    io.to(id1).emit("suaVez");
}
function emitSuaVez2(id2) {
    console.log(id2);
    io.to(id2).emit("suaVez");
}
