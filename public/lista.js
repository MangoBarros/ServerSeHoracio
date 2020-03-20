//Make connection

var socket = io.connect("http://localhost:4000");

//butao para submeter o nome de um jogador
var btn = document.getElementById("send");
const name = document.querySelector("#name");
var output = document.getElementById("output");

//butao para ir buscar os proximos jogadores e mostrar os seus nomes numa lista
var btnJ = document.getElementById("fetchJogadores");
const listJ = document.querySelector(".listaJ");
var player1 = document.querySelector(".player1");
var player1 = document.querySelector(".player2");

//butao para fazer o fetch das pontuacoes
var btnP = document.getElementById("fetchPontuacoes");
var listP = document.getElementById("listaP");

//Label jogadores em falta
var h3Jogadores = document.querySelector("#failJogadores");

//emit events

//click para adicionar jogador
btn.addEventListener("click", function() {
    console.log(name.value);
    socket.emit("listaEspera", {
        username: name.value
    });
});

//click para ir para o proximo jogo "fetch dos proximos jogadores"
btnJ.addEventListener("click", function() {
    console.log("hello is working");
    if (player1.textContent == "" && player2.textContent == "") {
        socket.emit("proximoJogo", function() {
            io.sockets.emit("proximoJogo");
        });
    }
});

btnP.addEventListener("click", function() {
    socket.emit("fimDoJogo", function() {
        player1.textContent = "";
        player2.textContent = "";
        io.sockets.emit("fimDoJogo");
    });
});

socket.on("jogofail", function() {
    createError();
});
socket.on("novoJogo", function(data) {
    //console.log(data[0], data[1]);
    createlist(data);
});

socket.on("inserPontuacoes", function(data) {
    createlistaP(data);
});

function createError() {
    console.log("errou");
    h3Jogadores.textContent = "Não Há jogadores suficientes";
}

function createlist(data) {
    h3Jogadores.textContent = "";
    //console.log(data[0], data[1]);
    //console.log("primeiro");
    console.log("segundo");
    player1.textContent = data[0];
    player2.textContent = data[1];
}

function createlistaP(data) {
    const l1 = document.createElement("li");
    const l2 = document.createElement("li");

    l1.textContent = data[0];
    l2.textContent = data[0];
}
