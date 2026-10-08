var html = document.documentElement;
var botaoTema = document.getElementById("botaoTema");

var temaSalvo = localStorage.getItem("tema");
if (temaSalvo) {
  html.setAttribute("data-theme", temaSalvo);
}

botaoTema.addEventListener("click", function () {
  var temaAtual = html.getAttribute("data-theme");
  var novoTema;

  if (temaAtual === "dark") {
    novoTema = "light";
  } else {
    novoTema = "dark";
  }

  html.setAttribute("data-theme", novoTema);
  localStorage.setItem("tema", novoTema);
});

var botaoMenu = document.getElementById("botaoMenu");
var menuLinks = document.getElementById("links");

botaoMenu.addEventListener("click", function () {
  menuLinks.classList.toggle("aberto");
});

var linksDoMenu = document.querySelectorAll(".links a");
for (var i = 0; i < linksDoMenu.length; i++) {
  linksDoMenu[i].addEventListener("click", function () {
    menuLinks.classList.remove("aberto");
  });
}

var textoDigitado = document.getElementById("textoDigitado");

var frases = [
  "Técnico em Informática",
  "Estudante de Desenvolvimento Web",
  "Entusiasta de Robótica e Automação",
  "Aprendendo Lógica de Programação"
];

var numeroDaFrase = 0;
var numeroDaLetra = 0;
var apagando = false;

function escrever() {
  var frase = frases[numeroDaFrase];

  if (apagando) {
    numeroDaLetra = numeroDaLetra - 1;
  } else {
    numeroDaLetra = numeroDaLetra + 1;
  }

  textoDigitado.textContent = frase.substring(0, numeroDaLetra);

  var tempo = 70;
  if (apagando) {
    tempo = 40;
  }

  if (!apagando && numeroDaLetra === frase.length) {

    apagando = true;
    tempo = 1800;
  } else if (apagando && numeroDaLetra === 0) {

    apagando = false;
    numeroDaFrase = numeroDaFrase + 1;

    if (numeroDaFrase === frases.length) {
      numeroDaFrase = 0;
    }
  }

  setTimeout(escrever, tempo);
}

escrever();

var secoesParaMostrar = document.querySelectorAll(".aparecer");

function mostrarSecoes() {
  for (var i = 0; i < secoesParaMostrar.length; i++) {
    var distanciaDoTopo = secoesParaMostrar[i].getBoundingClientRect().top;

    if (distanciaDoTopo < window.innerHeight - 100) {
      secoesParaMostrar[i].classList.add("visivel");
    }
  }
}

window.addEventListener("scroll", mostrarSecoes);
mostrarSecoes();

var cartoes = document.querySelectorAll(".projeto");

for (var i = 0; i < cartoes.length; i++) {

  cartoes[i].addEventListener("mousemove", function (evento) {
    var cartao = evento.currentTarget;
    var tamanho = cartao.getBoundingClientRect();

    var x = evento.clientX - tamanho.left;
    var y = evento.clientY - tamanho.top;

    var inclinarY = (x / tamanho.width - 0.5) * 10;
    var inclinarX = (y / tamanho.height - 0.5) * -10;

    cartao.style.transform = "perspective(600px) rotateX(" + inclinarX + "deg) rotateY(" + inclinarY + "deg)";
  });

  cartoes[i].addEventListener("mouseleave", function (evento) {
    evento.currentTarget.style.transform = "none";
  });
}

var formulario = document.getElementById("formulario");
var campoNome = document.getElementById("nome");
var campoTelefone = document.getElementById("telefone");
var campoEmail = document.getElementById("email");
var campoMensagem = document.getElementById("mensagem");
var contador = document.getElementById("contador");

campoTelefone.addEventListener("input", function () {

  var numeros = campoTelefone.value.replace(/\D/g, "");

  numeros = numeros.substring(0, 11);

  var telefone = "";

  if (numeros.length > 0) {
    telefone = "(" + numeros.substring(0, 2);
  }
  if (numeros.length >= 3) {
    telefone = telefone + ") " + numeros.substring(2, 7);
  }
  if (numeros.length >= 8) {
    telefone = telefone + "-" + numeros.substring(7, 11);
  }

  campoTelefone.value = telefone;
});

campoMensagem.addEventListener("input", function () {
  contador.textContent = campoMensagem.value.length;
});

function mostrarErro(campo, idDoErro, texto) {
  campo.classList.add("invalido");
  document.getElementById(idDoErro).textContent = texto;
}

function limparErro(campo, idDoErro) {
  campo.classList.remove("invalido");
  document.getElementById(idDoErro).textContent = "";
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var tudoCerto = true;

  if (campoNome.value.trim().length < 3) {
    mostrarErro(campoNome, "erroNome", "Digite seu nome completo.");
    tudoCerto = false;
  } else {
    limparErro(campoNome, "erroNome");
  }

  var numerosDoTelefone = campoTelefone.value.replace(/\D/g, "");
  if (numerosDoTelefone.length < 10) {
    mostrarErro(campoTelefone, "erroTelefone", "Telefone incompleto. Ex: (31) 99999-9999.");
    tudoCerto = false;
  } else {
    limparErro(campoTelefone, "erroTelefone");
  }

  var temArroba = campoEmail.value.indexOf("@") > 0;
  var temPonto = campoEmail.value.indexOf(".") > 0;
  if (!temArroba || !temPonto) {
    mostrarErro(campoEmail, "erroEmail", "Digite um e-mail válido.");
    tudoCerto = false;
  } else {
    limparErro(campoEmail, "erroEmail");
  }

  if (campoMensagem.value.trim().length < 10) {
    mostrarErro(campoMensagem, "erroMensagem", "Conte um pouco mais na mensagem (mín. 10 caracteres).");
    tudoCerto = false;
  } else {
    limparErro(campoMensagem, "erroMensagem");
  }

  if (!tudoCerto) {
    return;
  }

  document.getElementById("modalNome").textContent = campoNome.value.trim();
  modalFundo.classList.add("aberto");

  formulario.reset();
  contador.textContent = "0";
});

var modalFundo = document.getElementById("modalFundo");
var modalFechar = document.getElementById("modalFechar");
var modalOk = document.getElementById("modalOk");

function fecharModal() {
  modalFundo.classList.remove("aberto");
}

modalFechar.addEventListener("click", fecharModal);
modalOk.addEventListener("click", fecharModal);

modalFundo.addEventListener("click", function (evento) {
  if (evento.target === modalFundo) {
    fecharModal();
  }
});

document.getElementById("ano").textContent = new Date().getFullYear();