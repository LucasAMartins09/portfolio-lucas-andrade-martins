/* ===== PAINEL SUPERIOR =====
   - Menu responsivo (abre/fecha com animação, fecha ao escolher seção, Esc ou clique fora)
   - Relógio do "sistema"
   - Destaque da seção visível
   - Sombra no painel depois de rolar
   - Ano no rodapé */
(function () {
  "use strict";

  var painel = document.getElementById("painel");
  var nav = document.getElementById("painelNav");
  var botaoMenu = document.getElementById("botaoMenu");
  var links = nav ? nav.querySelectorAll("a") : [];

  /* ---- Menu mobile ---- */
  function menuAberto() {
    return nav.classList.contains("aberto");
  }

  function definirMenu(abrir) {
    nav.classList.toggle("aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  }

  if (nav && botaoMenu) {
    botaoMenu.addEventListener("click", function () {
      definirMenu(!menuAberto());
    });

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener("click", function () {
        definirMenu(false);
      });
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menuAberto()) {
        definirMenu(false);
        botaoMenu.focus();
      }
    });

    document.addEventListener("click", function (evento) {
      if (menuAberto() && !painel.contains(evento.target)) definirMenu(false);
    });

    // Se a tela crescer com o menu aberto, fecha para não ficar "preso"
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
      if (mq.matches) definirMenu(false);
    });
  }

  /* ---- Relógio ---- */
  var relogio = document.getElementById("relogio");
  function atualizarRelogio() {
    if (!relogio) return;
    var agora = new Date();
    var dia = agora.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).replace(/\./g, "");
    var hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    relogio.textContent = dia + "  " + hora;
    relogio.setAttribute("datetime", agora.toISOString());
  }
  atualizarRelogio();
  setInterval(atualizarRelogio, 15000);

  /* ---- Sombra do painel ao rolar ---- */
  var agendado = false;
  function verificarRolagem() {
    agendado = false;
    painel.classList.toggle("rolado", window.scrollY > 20);
  }
  window.addEventListener("scroll", function () {
    if (!agendado) {
      agendado = true;
      requestAnimationFrame(verificarRolagem);
    }
  }, { passive: true });
  verificarRolagem();

  /* ---- Link da seção atual ---- */
  if ("IntersectionObserver" in window && links.length) {
    var porId = {};
    Array.prototype.forEach.call(links, function (link) {
      porId[link.getAttribute("href").slice(1)] = link;
    });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        Array.prototype.forEach.call(links, function (l) {
          l.classList.remove("ativo");
          l.removeAttribute("aria-current");
        });
        var ativo = porId[entrada.target.id];
        if (ativo) {
          ativo.classList.add("ativo");
          ativo.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    document.querySelectorAll("main > section[id]").forEach(function (secao) {
      observador.observe(secao);
    });
  }

  /* ---- Ano no rodapé ---- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
