/* ===== CHUVA DE CÓDIGO (fundo da área de trabalho) =====
   Bem sutil: poucos quadros por segundo, baixa opacidade (definida no CSS).
   Pausa quando a área de trabalho sai da tela ou a aba fica oculta.
   Para quem prefere menos movimento: desenha um quadro estático, sem animação. */
(function () {
  "use strict";

  var canvas = document.getElementById("chuva");
  if (!canvas || !canvas.getContext) return;
  var estatico = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ctx = canvas.getContext("2d");
  var CARACTERES = "01{}[]<>/\\$#*+=;:abcdef0123456789";
  var TAMANHO = 16;
  var INTERVALO = 70; // ms entre quadros (~14 fps)

  var colunas = [];
  var cor = "#3dff7a";
  var visivel = true;
  var ultimo = 0;
  var dpr = 1;

  function lerCor() {
    cor = getComputedStyle(document.documentElement).getPropertyValue("--verde").trim() || "#3dff7a";
  }

  function redimensionar() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var largura = canvas.clientWidth;
    var altura = canvas.clientHeight;
    canvas.width = Math.floor(largura * dpr);
    canvas.height = Math.floor(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = TAMANHO + "px 'JetBrains Mono', monospace";

    var total = Math.ceil(largura / TAMANHO);
    colunas = [];
    for (var i = 0; i < total; i++) {
      // Nem toda coluna "chove": deixa o efeito mais espaçado e discreto
      colunas.push(Math.random() < 0.55 ? Math.floor(Math.random() * -60) : null);
    }
  }

  function desenhar(tempo) {
    requestAnimationFrame(desenhar);
    if (!visivel || tempo - ultimo < INTERVALO) return;
    ultimo = tempo;

    var largura = canvas.clientWidth;
    var altura = canvas.clientHeight;

    // Apaga aos poucos, deixando o rastro (funciona em qualquer cor de fundo)
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.fillRect(0, 0, largura, altura);
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = cor;
    for (var i = 0; i < colunas.length; i++) {
      if (colunas[i] === null) continue;
      var y = colunas[i] * TAMANHO;
      if (y > 0) {
        var c = CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length));
        ctx.fillText(c, i * TAMANHO, y);
      }
      if (y > altura && Math.random() > 0.97) {
        colunas[i] = Math.floor(Math.random() * -20);
      } else {
        colunas[i]++;
      }
    }
  }

  // Pausa fora da tela ou com a aba oculta
  var naTela = true;
  function atualizarVisibilidade() {
    visivel = naTela && !document.hidden;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entradas) {
      naTela = entradas[0].isIntersecting;
      atualizarVisibilidade();
    }).observe(canvas);
  }
  document.addEventListener("visibilitychange", atualizarVisibilidade);

  // Quadro único: rastros de caracteres espalhados, com brilho decrescente
  function desenharEstatico() {
    var altura = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = cor;
    for (var i = 0; i < colunas.length; i++) {
      if (colunas[i] === null) continue;
      var fim = Math.floor(Math.random() * (altura / TAMANHO));
      var comprimento = 6 + Math.floor(Math.random() * 14);
      for (var j = 0; j < comprimento; j++) {
        var y = (fim - j) * TAMANHO;
        if (y < 0) break;
        ctx.globalAlpha = (1 - j / comprimento) * 0.5; // mais fraco que a versão animada
        ctx.fillText(CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length)), i * TAMANHO, y);
      }
    }
    ctx.globalAlpha = 1;
  }

  function atualizarTudo() {
    redimensionar();
    if (estatico) desenharEstatico();
  }

  var timerResize;
  window.addEventListener("resize", function () {
    clearTimeout(timerResize);
    timerResize = setTimeout(atualizarTudo, 200);
  });

  document.addEventListener("lam:tema", function () {
    lerCor();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (estatico) desenharEstatico();
  });

  lerCor();
  atualizarTudo();
  if (!estatico) requestAnimationFrame(desenhar);
})();
