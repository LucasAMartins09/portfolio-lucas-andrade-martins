/* ===== TERMINAL INTERATIVO =====
   O visitante digita comandos (help, sobre, projetos, curriculo...) e recebe respostas.
   Recursos: histórico com ↑/↓, autocompletar com Tab, comando "clear".
   Todo texto digitado é tratado como texto puro (nada vira HTML). */
(function () {
  "use strict";

  var LAM = window.LAM || {};
  var janela = document.getElementById("janTerminal");
  var corpo = document.getElementById("terminalCorpo");
  var saida = document.getElementById("terminalSaida");
  var form = document.getElementById("terminalForm");
  var entrada = document.getElementById("terminalEntrada");
  if (!janela || !saida || !form || !entrada) return;

  var CURRICULO = "assets/docs/Curriculo_Lucas_Andrade_Martins.pdf";
  var LINKS = {
    github: "https://github.com/LucasAMartins09",
    linkedin: "https://www.linkedin.com/in/lucas-andrade-martins-8780a93b7/",
    whatsapp: "https://wa.me/5531997382009"
  };

  var historico = [];
  var posHistorico = 0;
  var iniciado = false;

  /* ---- Saída ---- */
  // linhas: array de strings ou de [texto, classe]
  function imprimir(linhas, classeBloco) {
    var bloco = document.createElement("div");
    bloco.className = "t-bloco" + (classeBloco ? " " + classeBloco : "");
    linhas.forEach(function (linha) {
      var p = document.createElement("p");
      if (Array.isArray(linha)) {
        p.textContent = linha[0];
        if (linha[1]) p.className = linha[1];
      } else {
        p.textContent = linha;
      }
      bloco.appendChild(p);
    });
    saida.appendChild(bloco);
    corpo.scrollTop = corpo.scrollHeight;
  }

  function ecoarComando(texto) {
    var p = document.createElement("p");
    var usuario = document.createElement("span");
    usuario.className = "t-usuario";
    usuario.textContent = "lucas@lam-os";
    p.appendChild(usuario);
    p.appendChild(document.createTextNode(":~$ " + texto));
    saida.appendChild(p);
  }

  function irPara(id) {
    LAM.fecharJanela(janela, function () {
      var alvo = document.getElementById(id);
      if (alvo) alvo.scrollIntoView({ behavior: "smooth" });
    });
  }

  function baixarCurriculo() {
    var a = document.createElement("a");
    a.href = CURRICULO;
    a.download = "Curriculo_Lucas_Andrade_Martins.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function abrirLink(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  /* ---- Comandos ---- */
  var COMANDOS = {
    help: {
      desc: "lista os comandos",
      run: function () {
        var linhas = [["Comandos disponíveis:", "t-verde"]];
        var estreito = corpo.clientWidth < 520; // celular: sem colunas alinhadas
        Object.keys(COMANDOS).forEach(function (nome) {
          var coluna = estreito ? nome + " " : (nome + "            ").slice(0, 13);
          linhas.push("  " + coluna + "— " + COMANDOS[nome].desc);
        });
        linhas.push(["Dica: use Tab para completar e ↑/↓ para o histórico.", "t-fraco"]);
        imprimir(linhas);
      }
    },
    whoami: {
      desc: "quem é Lucas",
      run: function () {
        imprimir([
          ["Lucas Andrade Martins", "t-verde"],
          "17 anos · Contagem, MG",
          "Estudante do Ensino Médio + Técnico em Informática (Cotemig)"
        ]);
      }
    },
    sobre: {
      desc: "resumo e objetivo",
      run: function () {
        imprimir([
          "Busco ampliar meus conhecimentos na área de TI, aprendendo a operar",
          "ferramentas, sistemas e recursos utilizados na área.",
          "Interesses: desenvolvimento de software, redes, robótica e cibersegurança.",
          ["→ digite \"ir sobre\" para ver a seção completa", "t-fraco"]
        ]);
      }
    },
    habilidades: {
      desc: "conhecimentos",
      run: function () {
        imprimir([
          ["linguagens:", "t-verde"], "  HTML, CSS, JavaScript, C#, Python, SQL (MySQL)",
          ["sistemas:", "t-verde"], "  Windows, Linux, hardware e software, redes,",
          "  manutenção e configuração de computadores",
          ["outros:", "t-verde"], "  lógica de programação, robótica e automação,",
          "  cibersegurança, Google Workspace",
          ["idiomas:", "t-verde"], "  Inglês intermediário (B2)"
        ]);
      }
    },
    formacao: {
      desc: "histórico escolar",
      run: function () {
        imprimir([
          ["[2025 — 2027] Colégio Cotemig — Unidade Barroca", "t-verde"],
          "  Ensino Médio + Técnico em Informática (em andamento)",
          ["[2016 — 2024] Colégio Santa Maria Minas — Contagem", "t-verde"],
          "  Ensino Fundamental I e II (concluído)"
        ]);
      }
    },
    projetos: {
      desc: "lista os projetos",
      run: function () {
        var linhas = [["drwxr-xr-x  projetos/", "t-fraco"]];
        var dados = LAM.projetos || {};
        Object.keys(dados).forEach(function (chave) {
          linhas.push(["  " + dados[chave].pasta, "t-verde"]);
          linhas.push("    " + dados[chave].titulo + " · " + dados[chave].techs.join(", "));
        });
        linhas.push(["→ \"abrir <nome-da-pasta>\" mostra os detalhes. Ex.: abrir knockout-house-lp", "t-fraco"]);
        imprimir(linhas);
      }
    },
    abrir: {
      desc: "abre um projeto",
      run: function (args) {
        var alvo = (args[0] || "").replace(/\/$/, "");
        var dados = LAM.projetos || {};
        var chave = Object.keys(dados).find(function (k) {
          return dados[k].pasta.replace(/\/$/, "") === alvo || k === alvo;
        });
        if (!chave) {
          imprimir([["abrir: projeto não encontrado. Digite \"projetos\" para ver a lista.", "t-erro"]]);
          return;
        }
        LAM.abrirProjeto(chave);
      }
    },
    contato: {
      desc: "canais de contato",
      run: function () {
        imprimir([
          "email     → lucasamartins2009@gmail.com",
          "whatsapp  → (31) 99738-2009",
          "linkedin  → /lucas-andrade-martins",
          "github    → /LucasAMartins09",
          ["→ digite \"ir contato\" para abrir o formulário", "t-fraco"]
        ]);
      }
    },
    curriculo: {
      desc: "baixa o currículo",
      run: function () {
        imprimir([["[ok] iniciando download de Curriculo_Lucas_Andrade_Martins.pdf ...", "t-verde"]]);
        baixarCurriculo();
      }
    },
    github: {
      desc: "abre o GitHub",
      run: function () { imprimir(["abrindo github.com/LucasAMartins09 ..."]); abrirLink(LINKS.github); }
    },
    linkedin: {
      desc: "abre o LinkedIn",
      run: function () { imprimir(["abrindo LinkedIn ..."]); abrirLink(LINKS.linkedin); }
    },
    whatsapp: {
      desc: "abre o WhatsApp",
      run: function () { imprimir(["abrindo WhatsApp ..."]); abrirLink(LINKS.whatsapp); }
    },
    ir: {
      desc: "vai até uma seção",
      run: function (args) {
        var secoes = ["inicio", "sobre", "habilidades", "formacao", "projetos", "contato"];
        var alvo = (args[0] || "").replace(/^[~./]+/, "");
        if (secoes.indexOf(alvo) === -1) {
          imprimir([["ir: use uma destas seções → " + secoes.join(", "), "t-erro"]]);
          return;
        }
        irPara(alvo);
      }
    },
    tema: {
      desc: "alterna claro/escuro",
      run: function () {
        var novo = LAM.alternarTema ? LAM.alternarTema() : "";
        imprimir(["tema alterado para: " + novo]);
      }
    },
    ls: {
      desc: "lista os arquivos",
      run: function () {
        imprimir(["sobre.txt  habilidades/  formacao/  projetos/  contato.sh  curriculo.pdf"]);
      }
    },
    clear: {
      desc: "limpa a tela",
      run: function () { saida.textContent = ""; }
    },
    sair: {
      desc: "fecha o terminal",
      run: function () { LAM.fecharJanela(janela); }
    }
  };

  // Atalhos e brincadeiras
  var APELIDOS = { exit: "sair", cls: "clear", cv: "curriculo", "?": "help", cd: "ir", cat: "sobre" };

  function executar(texto) {
    var limpo = texto.trim();
    ecoarComando(texto);
    if (!limpo) return;

    historico.push(limpo);
    posHistorico = historico.length;

    var partes = limpo.split(/\s+/);
    var nome = partes[0].toLowerCase();
    var args = partes.slice(1);
    nome = APELIDOS[nome] || nome;

    if (nome === "sudo") {
      imprimir([["[sudo] permissão negada: este incidente será reportado. 😉", "t-erro"]]);
      return;
    }

    var comando = COMANDOS[nome];
    if (comando) {
      comando.run(args);
    } else {
      imprimir([["comando não encontrado: " + partes[0] + " — digite \"help\"", "t-erro"]]);
    }
  }

  function boasVindas() {
    imprimir([
      ["LAM-OS v2.0 — terminal de Lucas Andrade Martins", "t-verde"],
      ["Digite \"help\" para ver os comandos. Ex.: whoami, projetos, curriculo", "t-fraco"]
    ]);
  }

  /* ---- Eventos ---- */
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var texto = entrada.value;
    entrada.value = "";
    executar(texto);
    corpo.scrollTop = corpo.scrollHeight;
  });

  entrada.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowUp") {
      if (!historico.length) return;
      evento.preventDefault();
      posHistorico = Math.max(0, posHistorico - 1);
      entrada.value = historico[posHistorico];
    } else if (evento.key === "ArrowDown") {
      if (!historico.length) return;
      evento.preventDefault();
      posHistorico = Math.min(historico.length, posHistorico + 1);
      entrada.value = historico[posHistorico] || "";
    } else if (evento.key === "Tab") {
      var parcial = entrada.value.trim().toLowerCase();
      if (!parcial || parcial.indexOf(" ") !== -1) return;
      evento.preventDefault();
      var opcoes = Object.keys(COMANDOS).filter(function (c) { return c.indexOf(parcial) === 0; });
      if (opcoes.length === 1) {
        entrada.value = opcoes[0] + " ";
      } else if (opcoes.length > 1) {
        ecoarComando(entrada.value);
        imprimir([opcoes.join("  ")]);
      }
    }
  });

  // Clicar em qualquer parte do terminal coloca o foco na linha de comando
  corpo.addEventListener("click", function () {
    if (!window.getSelection().toString()) entrada.focus();
  });

  janela.addEventListener("lam:aberta", function () {
    if (!iniciado) {
      boasVindas();
      iniciado = true;
    }
    setTimeout(function () { entrada.focus(); }, 30);
  });
})();
