//Make connection

var socket = io.connect("http://localhost:4000");
//var name = document.getElementById("name");
const name = document.querySelector("#name");
//var name = document.getElementById("name");
var btn = document.getElementById("send");
var output = document.getElementById("output");
//emit events

btn.addEventListener("click", function() {
    console.log(name.value);
    socket.emit("listaEspera", {
        username: name.value
    });
});
