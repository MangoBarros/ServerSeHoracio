//Make connection

const socket = io.connect("http://192.168.1.105:4000");

//butao para submeter o nome de um jogador
const btn = document.querySelector("#send");
const name = document.querySelector("#name");

let idJogador = 0;
let suaVez = false;

let funTime;

//butao para ir buscar os proximos jogadores e mostrar os seus nomes numa lista
const btnAceitaJogo = document.querySelector("#fetchJogadores");
btnAceitaJogo.style.visibility = "hidden";
const btnRejeitaJogo = document.querySelector("#rejeitaJogo");
btnRejeitaJogo.style.visibility = "hidden";
const listJ = document.querySelector(".listaJ");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const listaEspera = document.querySelector("#listaEspera");
const nomeJogador = document.querySelector("#nomeJogador");

const lable = document.querySelector("#opcao");

const mensagem = document.querySelector("#mensagem");

//butao para fazer o fetch das pontuacoes
const btnP = document.querySelector("#acabarJogo");
const listP = document.querySelector("#listaP");

//Label jogadores em falta
const h3Jogadores = document.querySelector("#failJogadores");

//emit events

//click para adicionar jogador
btn.addEventListener("click", function () {
    console.log("botao entrar");
    socket.emit("listaEspera", {
        username: "player",
    });
});

//click para ir para o proximo jogo "fetch dos proximos jogadores"
btnAceitaJogo.addEventListener("click", function () {
    console.log(player1.textContent, player1.textContent == "À espera de jogadores");
    if (player1.textContent == "À espera de jogadores" && player2.textContent == "À espera de jogadores" && idJogador != 0 && suaVez != false) {
        console.log("primeiiro");
        if (funTime) {
            funTime();
        }
        console.log("jogador aceitou, vai enviar");
        socket.emit("jogoAceite", {
            start: "Start",
            jogador: idJogador,
        });
        lable.textContent = "Espere que outro jogador aceite";
        btnAceitaJogo.style.visibility = "hidden";
        btnRejeitaJogo.style.visibility = "hidden";
        console.log("enviou");
    }
});

btnRejeitaJogo.addEventListener("click", function () {
    console.log(idJogador + " rejeitou o jogo");
    if (player1.textContent == "À espera de jogadores" && player2.textContent == "À espera de jogadores" && idJogador != 0 && suaVez != false) {
        console.log("prestes a rejeitar");
        socket.emit("jogoRejeita", {
            start: "Start",
            jogador: idJogador,
        });
    }
});

//Click jogo acabou
btnP.addEventListener("click", function () {
    console.log("jogo acabou");
    if (player1.textContent != "À espera de jogadores" && player2.textContent != "À espera de jogadores") {
        finishGame();
    }
});

socket.on("nomeJogador", function (data) {
    console.log("nome e id do jogador a serem definidos");
    console.log(data);
    btn.style.visibility = "hidden";
    idJogador = data[1];
    nomeJogador.textContent = data[0];
});

socket.on("suaVez", function (fnTime) {
    console.log(" tempo ", fnTime);
    lable.textContent = "Para entrar clique no botão entrar no jogo";
    btnAceitaJogo.style.visibility = "visible";
    btnRejeitaJogo.style.visibility = "visible";
    funTime = fnTime;
    suaVez = true;
    console.log("suaVez definido a verdadeiro");
    nomeJogador.textContent = nomeJogador.textContent + ": É a sua vez ";
    console.log("notificação definida");
});

//Receber nova lista de Espera
socket.on("novoListaEspera", function (data) {
    data = ["arr", data];
    newListaEspera(data);
});

//falha no jogo
socket.on("jogofail", function () {
    createError();
});

socket.on("suaVezDeJogar", function () {
    lable.textContent = "É você a jogar , divirta-se!!!";
});

//Pedido de novo jogo
socket.on("novoJogo", function (data) {
    console.log("recebendo novos jogadores");
    createlist(data);
});

//Pedido de pontuacoes
socket.on("inserePontuacoes", function (data) {
    player1.textContent = "À espera de jogadores";
    player2.textContent = "À espera de jogadores";
    createlistaP(data);
});

//Desconnect
socket.on("desconectou", function () {
    nomeJogador.textContent = "desconectou-se";
    funTime = null;
});

//desistiu
socket.on("desistiu", function () {
    console.log("desistiu");
    nomeJogador.textContent = "Desistiu";
    idJogador = 0;
    suaVez = false;
    funTime = null;
});

function createError() {
    console.log("errou");
    h3Jogadores.textContent = "Não Há jogadores suficientes";
}

function finishGame() {
    const pontuacoes = [
        [player1.textContent, 10],
        [player2.textContent, 20],
    ];
    console.log(pontuacoes);
    console.log("changing labels");
    socket.emit("fimDoJogo", pontuacoes);
}

function newListaEspera(data) {
    listaEspera.innerHTML = "";
    data[1].forEach((element) => {
        linhaEspera = document.createElement("li");
        linhaEspera.textContent = element[0];
        listaEspera.appendChild(linhaEspera);
    });
}

function createlist(data) {
    //h3Jogadores.textContent = "";
    console.log(data[0][0], data[0][1]);

    console.log("lista jogadores atuais");
    player1.textContent = data[0][0][0];
    player2.textContent = data[0][1][0];

    newListaEspera(data);
}

function createlistaP(data) {
    listP.innerHTML = "";
    if (data.length != 0) {
        for (let i = 0; i <= data.length; i++) {
            console.log("pontuacoes");
            const line = document.createElement("li");
            //console.log("segundo");
            if (data[i] != null) {
                console.log(data[i]);
                line.textContent = data[i][1] + " : " + data[i][0];
                listP.appendChild(line);
                //console.log("terceito");
            }
        }
    }
}
