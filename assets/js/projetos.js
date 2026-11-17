/* ===== PROJETOS: PASTAS 3D + JANELA DE DETALHES =====
   - Com mouse: a pasta inclina seguindo o cursor e volta suavemente ao sair.
   - Sem mouse (toque): sem inclinação, apenas um leve "pressionar".
   - Ao clicar/tocar: abre uma janela hacker com os detalhes do projeto. */
(function () {
  "use strict";

  var LAM = (window.LAM = window.LAM || {});

  // Dados dos projetos (também usados pelo terminal interativo)
  var PROJETOS = {
    "knockout-lp": {
      pasta: "knockout-house-lp/",
      titulo: "Knockout House — Landing Page",
      descricao: "Landing page fictícia desenvolvida para fins acadêmicos, com prototipação prévia no Figma.",
      techs: ["HTML", "CSS", "JavaScript", "Figma"],
      repo: "https://github.com/LucasAMartins09/Knockout-House-Landing-Page"
    },
    "knockout-shop": {
      pasta: "knockout-house-shop/",
      titulo: "Knockout House — E-commerce",
      descricao: "Projeto de e-commerce fictício com layout construído em CSS Grid, também prototipado no Figma.",
      techs: ["HTML", "CSS", "JavaScript", "Figma"],
      repo: "https://github.com/LucasAMartins09/Knockout-House"
    },
    "parques-solares": {
      pasta: "parques-solares-cs/",
      titulo: "Monitoramento de Parques Solares",
      descricao: "Sistema de monitoramento de parques solares utilizando matrizes e vetores em C#.",
      techs: ["C#"],
      repo: "https://github.com/LucasAMartins09/Parques_Solares_Matriz_Vetores_CSharp"
    }
  };
  LAM.projetos = PROJETOS;

  /* ---- Janela de detalhes ---- */
  var janela = document.getElementById("janProjeto");
  var tituloJanela = document.getElementById("janProjetoTitulo");
  var corpo = document.getElementById("janProjetoCorpo");

  function criar(tag, classe, texto) {
    var el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  }

  function abrirProjeto(chave, origem) {
    var p = PROJETOS[chave];
    if (!p || !janela) return;

    tituloJanela.textContent = p.pasta;
    corpo.textContent = "";

    var comando = criar("p", "t-linha");
    comando.appendChild(criar("span", "t-prompt", "$"));
    comando.appendChild(document.createTextNode("cat " + p.pasta + "README.md"));
    corpo.appendChild(comando);

    corpo.appendChild(criar("h2", "projeto-titulo", p.titulo));
    corpo.appendChild(criar("p", "", p.descricao));
    corpo.appendChild(criar("p", "t-fraco", "# tecnologias"));

    var techs = criar("div", "projeto-techs");
    p.techs.forEach(function (t) { techs.appendChild(criar("span", "", t)); });
    corpo.appendChild(techs);

    var acoes = criar("div", "dialogo-acoes");
    var link = criar("a", "botao botao-primario botao-pequeno", "Ver repositório no GitHub ↗");
    link.href = p.repo;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    acoes.appendChild(link);
    var fechar = criar("button", "botao botao-contorno botao-pequeno", "Fechar");
    fechar.type = "button";
    fechar.setAttribute("data-fechar", "");
    acoes.appendChild(fechar);
    corpo.appendChild(acoes);

    LAM.abrirJanela(janela, origem);
  }
  LAM.abrirProjeto = abrirProjeto;

  document.addEventListener("click", function (evento) {
    var gatilho = evento.target.closest("[data-projeto]");
    if (gatilho) abrirProjeto(gatilho.getAttribute("data-projeto"), gatilho);
  });

  /* ---- Inclinação 3D ---- */
  var podeInclinar = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var INCLINACAO_MAX = 10;         // graus
  var INCLINACAO_REDUZIDA = 4;     // para quem pediu menos movimento no sistema

  document.querySelectorAll(".pasta").forEach(function (pasta) {
    var quadro = null;

    pasta.addEventListener("pointermove", function (evento) {
      if (evento.pointerType !== "mouse" || !podeInclinar.matches) return;
      if (quadro) return;

      quadro = requestAnimationFrame(function () {
        quadro = null;
        var r = pasta.getBoundingClientRect();
        var x = (evento.clientX - r.left) / r.width;   // 0 a 1
        var y = (evento.clientY - r.top) / r.height;   // 0 a 1
        var max = reduzido.matches ? INCLINACAO_REDUZIDA : INCLINACAO_MAX;

        pasta.classList.add("inclinando");
        pasta.style.setProperty("--ry", ((x - 0.5) * 2 * max).toFixed(2) + "deg");
        pasta.style.setProperty("--rx", ((0.5 - y) * 2 * max).toFixed(2) + "deg");
        pasta.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
        pasta.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      });
    });

    // Volta suavemente à posição original
    pasta.addEventListener("pointerleave", function () {
      if (quadro) { cancelAnimationFrame(quadro); quadro = null; }
      pasta.classList.remove("inclinando");
      pasta.style.setProperty("--rx", "0deg");
      pasta.style.setProperty("--ry", "0deg");
    });

    // Toque: leve "pressionar"
    pasta.addEventListener("pointerdown", function (evento) {
      if (evento.pointerType !== "mouse") pasta.classList.add("pressionado");
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (tipo) {
      pasta.addEventListener(tipo, function () { pasta.classList.remove("pressionado"); });
    });
  });
})();
