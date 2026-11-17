/* ===== JANELAS (diálogos) =====
   Gerencia todas as janelas: sobre.txt, projetos/, contato.sh, detalhes de projeto,
   terminal e o modal de confirmação do formulário.
   - Abre com animação, fecha com animação.
   - Fecha pelo botão ×, por botões com [data-fechar], clicando fora ou com Esc.
   - Trava a rolagem da página enquanto há janela aberta e devolve o foco ao sair. */
(function () {
  "use strict";

  var LAM = (window.LAM = window.LAM || {});
  var raiz = document.documentElement;
  var suportaDialog = typeof HTMLDialogElement === "function";
  var origemFoco = new Map(); // janela -> elemento que a abriu

  function janelasAbertas() {
    return document.querySelectorAll("dialog.janela-dialogo[open]");
  }

  function abrir(idOuJanela, origem) {
    var janela = typeof idOuJanela === "string" ? document.getElementById(idOuJanela) : idOuJanela;
    if (!janela || janela.open) return janela;

    // Só uma janela por vez: fecha as outras imediatamente
    Array.prototype.forEach.call(janelasAbertas(), function (outra) {
      if (outra !== janela) fecharAgora(outra, false);
    });

    origemFoco.set(janela, origem || document.activeElement);
    janela.classList.remove("fechando");

    if (suportaDialog) {
      janela.showModal();
    } else {
      janela.setAttribute("open", "");
    }
    raiz.classList.add("travado");

    janela.dispatchEvent(new CustomEvent("lam:aberta"));
    return janela;
  }

  function fecharAgora(janela, devolverFoco) {
    janela.classList.remove("fechando");
    if (suportaDialog && janela.open) {
      janela.close();
    } else {
      janela.removeAttribute("open");
    }
    if (!janelasAbertas().length) raiz.classList.remove("travado");

    var origem = origemFoco.get(janela);
    origemFoco.delete(janela);
    if (devolverFoco !== false && origem && typeof origem.focus === "function" && document.contains(origem)) {
      origem.focus({ preventScroll: true });
    }
  }

  function fechar(janela, depois) {
    if (!janela || !janela.open || janela.classList.contains("fechando")) return;

    var duracao = 200; // mesma duração da animação de fechar no CSS
    janela.classList.add("fechando");

    setTimeout(function () {
      fecharAgora(janela, !depois);
      if (typeof depois === "function") depois();
    }, duracao);
  }

  LAM.abrirJanela = abrir;
  LAM.fecharJanela = fechar;

  // Configura cada janela
  Array.prototype.forEach.call(document.querySelectorAll("dialog.janela-dialogo"), function (janela) {
    // Esc: troca o fechamento instantâneo do navegador pelo animado
    janela.addEventListener("cancel", function (evento) {
      evento.preventDefault();
      fechar(janela);
    });

    // Clique fora da caixa (no fundo escurecido) fecha
    janela.addEventListener("click", function (evento) {
      if (evento.target === janela) {
        fechar(janela);
        return;
      }

      var gatilho = evento.target.closest("[data-fechar]");
      if (!gatilho || !janela.contains(gatilho)) return;

      // Links "#secao" dentro da janela: fecha primeiro e depois rola até a seção
      var href = gatilho.getAttribute("href");
      if (href && href.charAt(0) === "#") {
        evento.preventDefault();
        fechar(janela, function () {
          var alvo = document.querySelector(href);
          if (alvo) {
            alvo.scrollIntoView({ behavior: "smooth" });
            history.replaceState(null, "", href);
          }
        });
      } else {
        fechar(janela);
      }
    });
  });

  // Qualquer elemento com data-abrir="idDaJanela" abre essa janela
  document.addEventListener("click", function (evento) {
    var gatilho = evento.target.closest("[data-abrir]");
    if (!gatilho) return;
    evento.preventDefault();
    abrir(gatilho.getAttribute("data-abrir"), gatilho);
  });
})();
