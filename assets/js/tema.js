/* ===== TEMA CLARO / ESCURO =====
   - O tema salvo já é aplicado no <head> (index.html) para não "piscar".
   - Aqui ficam o botão, a transição suave e o salvamento da escolha. */
(function () {
  "use strict";

  var LAM = (window.LAM = window.LAM || {});
  var raiz = document.documentElement;
  var botao = document.getElementById("botaoTema");
  var metaCor = document.querySelector('meta[name="theme-color"]');
  var CHAVE = "lam-tema";
  var timerTransicao;

  function temaAtual() {
    return raiz.getAttribute("data-tema") === "claro" ? "claro" : "escuro";
  }

  function atualizarInterface(tema) {
    if (botao) {
      botao.setAttribute("aria-label", tema === "escuro" ? "Mudar para tema claro" : "Mudar para tema escuro");
    }
    if (metaCor) {
      metaCor.setAttribute("content", tema === "escuro" ? "#0a0d0c" : "#f2eee2");
    }
  }

  function aplicarTema(tema) {
    // Liga as transições só durante a troca, para não deixar a página lenta no resto do tempo
    raiz.classList.add("trocando-tema");
    clearTimeout(timerTransicao);
    timerTransicao = setTimeout(function () {
      raiz.classList.remove("trocando-tema");
    }, 500);

    raiz.setAttribute("data-tema", tema);
    atualizarInterface(tema);

    try {
      localStorage.setItem(CHAVE, tema);
    } catch (e) { /* navegação privada pode bloquear: o tema só não fica salvo */ }

    // Avisa outros scripts (ex.: chuva de código) que as cores mudaram
    document.dispatchEvent(new CustomEvent("lam:tema", { detail: tema }));
  }

  LAM.alternarTema = function () {
    var novo = temaAtual() === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    return novo;
  };

  LAM.temaAtual = temaAtual;

  if (botao) botao.addEventListener("click", LAM.alternarTema);
  atualizarInterface(temaAtual());
})();
