const express = require("express");
const socket = require("socket.io");
let listaEspera = [];
//let listaSocketIds = [];
let listaPontuacoes = [];
let pessoasAtivas = [];

let pessoasPorAceitar = [];
let tresPrimeiros = [];

let pessoa1Rejeitou = false;
let pessoa2Rejeitou = false;

let PlayerNames = [
    "Abacate ",
    " Abacaxi ",
    " Abiu",
    " Araçá",
    " Azeitona ",
    " Açaí",
    " Acerola",
    " Ameixa ",
    " Amora ",
    " Abricó",
    " Anonácea",
    " Ananás ",
    " Abóbora ",
    " Cacau",
    " Cagaita",
    " Cajá-manga",
    " Cereja ",
    " Caimito",
    " Cajá",
    " Conde",
    " Cupuaçu",
    " Caju ",
    " Calabaça ",
    " Carambola ",
    " Calabura",
    " Coco ",
    " Feijoa",
    " Figo ",
    " Framboesa ",
    " Fruta-pão",
    " Frutas do cerrado",
    " Fruta-do-conde",
];

// App setup

const app = express();
const server = require("http").createServer(app);
server.listen(process.env.PORT || 4000);

//Static files
app.use("/game", express.static("public"));

//Socket setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("made socket connection", socket.id);

    io.sockets.emit("novoListaEspera", listaEspera);

    io.sockets.emit("inserePontuacoes", tresPrimeiros);

    socket.on("listaEspera", function (data) {
        //console.log(data);

        let aux = Math.floor(Math.random() * PlayerNames.length);
        let name = [PlayerNames[aux], socket.id];
        listaEspera.push([name[0], socket.id]);
        PlayerNames.splice(aux, 1);

        //emitir o nome para o client
        io.to(socket.id).emit("nomeJogador", name);
        if (listaEspera.length == 1) {
            console.log("wdqwwqd");
            //console.log("jogador novo e seguinte 1");

            const pessoa = listaEspera.splice(0, 1);
            if (pessoasPorAceitar[0] == null) {
                pessoasPorAceitar[0] = pessoa[0];
            } else {
                if (pessoasPorAceitar[1] == null) {
                    pessoasPorAceitar[1] = pessoa[0];
                }
            }
            console.log(pessoasPorAceitar + " se aceitou so um");
            emitSuaVez1(socket.id);

            io.sockets.emit("novoListaEspera", listaEspera);
        }
    });

    socket.on("jogoAceite", function (data) {
        console.log("O jogo foi aceite pelo jogador :" + data.jogador);
        console.log(pessoasPorAceitar);
        if (pessoasPorAceitar[0] != null) {
            console.log("jogador 1 entrou:");
            console.log(" jogador que deveria entrar: " + pessoasPorAceitar[0]);
            console.log("jogador que vai entrar " + data.jogador);
            console.log(pessoasPorAceitar[0], data.jogador);

            //console.log("Jogador que tem de aceitar : " + pessoasPorAceitar[0][0] + " id: " + pessoasPorAceitar[0][1]);
            if (pessoasPorAceitar[0][1] == data.jogador) {
                console.log("resultado if 1: " + pessoasPorAceitar[0][1] == data.jogador);
                //pessoasAtivas.push(pessoasPorAceitar[0]);
                pessoasAtivas.push(pessoasPorAceitar[0]);
            }
        }
        if (pessoasPorAceitar[1] != null) {
            console.log("jogador 2 entrou:");
            console.log(" jogador que deveria entrar: " + pessoasPorAceitar[1]);
            console.log("jogador que vai entrar " + data.jogador);
            console.log(pessoasPorAceitar[1], data.jogador);
            //console.log("Jogador que tem de aceitar : " + pessoasPorAceitar[1][0] + " id: " + pessoasPorAceitar[1][1]);
            if (pessoasPorAceitar[1][1] == data.jogador) {
                console.log("resultado if 2: " + pessoasPorAceitar[1][1] == data.jogador);
                pessoasAtivas.push(pessoasPorAceitar[1]);
                //pessoasAtivas.push(pessoasPorAceitar[1]);
            }
        }

        if (pessoasAtivas.length == 2) {
            pessoasPorAceitar = [];
            console.log(pessoasAtivas);
            io.to(pessoasAtivas[0][1]).emit("suaVezDeJogar");
            io.to(pessoasAtivas[1][1]).emit("suaVezDeJogar");

            io.sockets.emit("novoJogo", [pessoasAtivas, listaEspera]);
        }
    });

    socket.on("jogoRejeita", function (data) {
        console.log(data, pessoasPorAceitar);

        if (pessoasPorAceitar[0]) {
            console.log("jogador 1 " + pessoasPorAceitar[0]);
            if (pessoasPorAceitar[0][1] == data.jogador) {
                console.log("1 rejeitou");
                pessoa1Rejeitou = true;
                //pessoasPorAceitar.splice(0, 1);
                pessoasPorAceitar[0] = null;
                io.to(socket.id).emit("desistiu");
                socket.disconnect();
                if (listaEspera.length >= 1) {
                    pessoasPorAceitar[0] = listaEspera.splice(0, 1)[0];
                    emitSuaVez1(pessoasPorAceitar[0][1]);
                }
            }
        }

        if (pessoasPorAceitar[1]) {
            console.log("jogador 2" + pessoasPorAceitar[1]);
            if (pessoasPorAceitar[1][1] == data.jogador) {
                console.log("2 rejeitou");
                pessoa2Rejeitou = true;
                pessoasPorAceitar[1] = null;
                //pessoasPorAceitar.splice(1, 1);

                io.to(socket.id).emit("desistiu");
                socket.disconnect();
                if (listaEspera.length >= 1) {
                    pessoasPorAceitar[1] = listaEspera.splice(0, 1)[0];
                    emitSuaVez2(pessoasPorAceitar[1][1]);
                }
            }
        }
    });

    socket.on("disconnect", function () {
        if (!!pessoasAtivas[0] && pessoasAtivas[0][1] == socket.id) {
            acabarJogo([
                [pessoasAtivas[0][0], 0],
                [pessoasAtivas[1][0], 0],
            ]);
        }
        if (!!pessoasAtivas[1] && pessoasAtivas[1][1] == socket.id) {
            acabarJogo([
                [pessoasAtivas[0][0], 0],
                [pessoasAtivas[1][0], 0],
            ]);
        }
        if (!!pessoasPorAceitar[0] && pessoasPorAceitar[0][1] == socket.io) {
            pessoasPorAceitar[0] = null;
            console.log(pessoasPorAceitar[0]);
        }
        if (!!pessoasPorAceitar[1] && pessoasPorAceitar[1][1] == socket.io) {
            pessoasPorAceitar[1] = null;
            console.log(pessoasPorAceitar[1]);
        }
        for (let i = 0; i < listaEspera.length; i++) {
            if (listaEspera[i][1] == socket.io) {
                const saiu = listaEspera.splice(i, 1);
                console.log(saiu);
                return;
            }
        }
    });

    //coisas a funcionar

    socket.on("fimDoJogo", function (data) {
        acabarJogo(data);
    });

    function acabarJogo(data) {
        console.log(data);
        console.log("lista espera :" + listaEspera);
        console.log("lista por aceitar :" + pessoasPorAceitar);
        console.log("lista Ativas :" + pessoasAtivas);

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

            if (listaEspera.length > 0) {
                listaEspera.splice(0, 2).forEach((element) => {
                    emitSuaVez1(element[1]);
                });
            }
        }
    }
    function emitSuaVez1(id1) {
        //console.log(id1 + "emitir vez jog 1");
        const time = setTimeout(function () {
            socket.emit("desconectou");
            listaEspera = listaEspera.filter((user) => user[1] !== id1);
            pessoasPorAceitar[0] = null;
            socket.disconnect();
        }, 10000);
        socket.emit("suaVez", function () {
            clearTimeout(time);
            //console.log("aceitou");
        });
    }
    function emitSuaVez2(id2) {
        //console.log(id2 + "emitir vez jog 2");
        const time = setTimeout(function () {
            socket.emit("desconectou");
            listaEspera = listaEspera.filter((user) => user[1] !== id2);
            pessoasPorAceitar[1] = null;
            socket.disconnect();
        }, 10000);
        socket.emit("suaVez", function () {
            clearTimeout(time);
            //console.log("aceitou");
        });
    }
});
