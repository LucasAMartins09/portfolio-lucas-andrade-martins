/* ===== EFEITO DE DIGITAÇÃO + GLITCH NO NOME =====
   Escreve as frases letra por letra, espera, apaga e passa para a próxima.
   O cursor piscando é feito no CSS (.cursor). */
(function () {
  "use strict";

  var alvo = document.getElementById("textoDigitado");
  if (!alvo) return;

  var frases = [
    "Técnico em Informática",
    "Desenvolvedor em formação",
    "Robótica & Automação",
    "Curioso por Cibersegurança"
  ];

  var VELOCIDADE_ESCRITA = 75;
  var VELOCIDADE_APAGAR = 38;
  var PAUSA_FIM = 1900;
  var PAUSA_INICIO = 380;

  var fraseAtual = 0;
  var letra = 0;
  var apagando = false;
  alvo.textContent = "";

  (function escrever() {
    var frase = frases[fraseAtual];
    letra += apagando ? -1 : 1;
    alvo.textContent = frase.substring(0, letra);

    var espera = apagando ? VELOCIDADE_APAGAR : VELOCIDADE_ESCRITA + Math.random() * 40;

    if (!apagando && letra === frase.length) {
      apagando = true;
      espera = PAUSA_FIM;
    } else if (apagando && letra === 0) {
      apagando = false;
      fraseAtual = (fraseAtual + 1) % frases.length;
      espera = PAUSA_INICIO;
    }

    setTimeout(escrever, espera);
  })();

  /* Glitch no nome: no mouse é pelo :hover do CSS; no toque, ativa ao tocar */
  var nome = document.querySelector(".nome-glitch");
  if (nome) {
    nome.addEventListener("touchstart", function () {
      nome.classList.remove("glitch-ativo");
      void nome.offsetWidth; // reinicia a animação
      nome.classList.add("glitch-ativo");
      setTimeout(function () { nome.classList.remove("glitch-ativo"); }, 1000);
    }, { passive: true });
  }
})();
