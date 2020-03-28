//Make connection

const socket = io.connect("http://localhost:4000");

//butao para submeter o nome de um jogador
const btn = document.querySelector("#send");
const name = document.querySelector("#name");

//butao para ir buscar os proximos jogadores e mostrar os seus nomes numa lista
var btnJ = document.querySelector("#fetchJogadores");
const listJ = document.querySelector(".listaJ");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const listaEspera = document.querySelector("#listaEspera");

const mensagem = document.querySelector("#mensagem");

//butao para fazer o fetch das pontuacoes
const btnP = document.querySelector("#acabarJogo");
const listP = document.querySelector("#listaP");

//Label jogadores em falta
const h3Jogadores = document.querySelector("#failJogadores");

//emit events

var session_id;
// Get saved data from sessionStorage
let data = sessionStorage.getItem("sessionId");
console.log(data);
if (data == null) {
    session_id = null; //when we connect first time
    socket.emit("start-session", { sessionId: session_id });
} else {
    session_id = data; //when we connect n times
    socket.emit("start-session", { sessionId: session_id });
}

//click para adicionar jogador
btn.addEventListener("click", function() {
    console.log(name.value);
    socket.emit("listaEspera", {
        username: name.value
    });
});

//click para ir para o proximo jogo "fetch dos proximos jogadores"
btnJ.addEventListener("click", function() {
    console.log(player1.textContent, player1.textContent == "Waiting For Player");
    if (player1.textContent == "Waiting For Player" && player2.textContent == "Waiting For Player") {
        console.log("primeiiro");
        socket.emit("proximoJogo", { start: "Start" });
    }
});

//Click jogo acabou
btnP.addEventListener("click", function() {
    console.log("jogo acabou");
    if (player1.textContent != "Waiting For Player" && player2.textContent != "Waiting For Player") {
        finishGame();
    }
});

//Receber nova lista de Espera
socket.on("novoListaEspera", function(data) {
    const list = ["aux", data];
    newListaEspera(list);
});

socket.on("set-session-acknowledgement", function(data) {
    mensagem.textContent = "Notificacao";
    sessionStorage.setItem("sessionId", data.sessionId);
});

//falha no jogo
socket.on("jogofail", function() {
    createError();
});

//Pedido de novo jogo
socket.on("novoJogo", function(data) {
    console.log("recebendo novos jogadores");
    createlist(data);
});

//Pedido de pontuacoes
socket.on("inserePontuacoes", function(data) {
    createlistaP(data);
});

function createError() {
    console.log("errou");
    h3Jogadores.textContent = "Não Há jogadores suficientes";
}

function finishGame() {
    const pontuacoes = [
        [player1.textContent, 10],
        [player2.textContent, 20]
    ];
    console.log(pontuacoes);
    console.log("changing labels");
    player1.textContent = "Waiting For Player";
    player2.textContent = "Waiting For Player";
    console.log("wow");
    socket.emit("fimDoJogo", pontuacoes);
}

function newListaEspera(data) {
    if (data.length == 2) {
        console.log("hello");
        listaEspera.innerHTML = "";
        data[1].forEach(element => {
            linhaEspera = document.createElement("li");
            linhaEspera.textContent = element;
            listaEspera.appendChild(linhaEspera);
        });
    }
}

function createlist(data) {
    //h3Jogadores.textContent = "";
    console.log(data[0][0], data[0][1]);

    console.log("segundo");
    player1.textContent = data[0][0];
    player2.textContent = data[0][1];

    newListaEspera(data);
}

function createlistaP(data) {
    listP.innerHTML = "";
    if (data.length != 0) {
        for (let i = 0; i <= data.length; i++) {
            console.log("primeiro");
            const line = document.createElement("li");
            console.log("segundo");
            console.log(data[i]);
            line.textContent = data[i][1] + " : " + data[i][0];
            listP.appendChild(line);
            console.log("terceito");
        }
    }
}
