/* ===== FORMULÁRIO DE CONTATO =====
   - Máscara automática para telefone brasileiro: (00) 0000-0000 ou (00) 00000-0000
   - Contador de caracteres da mensagem
   - Validação com mensagens de erro específicas (ao sair do campo e ao enviar)
   - Envio SIMULADO: mostra a janela de confirmação, nenhuma mensagem é enviada de verdade */
(function () {
  "use strict";

  var LAM = window.LAM || {};
  var form = document.getElementById("formulario");
  if (!form) return;

  var campos = {
    nome: document.getElementById("nome"),
    telefone: document.getElementById("telefone"),
    email: document.getElementById("email"),
    mensagem: document.getElementById("mensagem")
  };
  var erros = {
    nome: document.getElementById("erroNome"),
    telefone: document.getElementById("erroTelefone"),
    email: document.getElementById("erroEmail"),
    mensagem: document.getElementById("erroMensagem")
  };
  var contador = document.getElementById("contador");
  var contadorCaixa = document.getElementById("contadorTexto");
  var botaoEnviar = document.getElementById("botaoEnviar");
  var LIMITE = Number(campos.mensagem.getAttribute("maxlength")) || 300;

  /* ---- Máscara de telefone ---- */
  function formatarTelefone(valor) {
    var n = valor.replace(/\D/g, "").slice(0, 11);
    if (!n.length) return "";
    if (n.length <= 2) return "(" + n;
    if (n.length <= 6) return "(" + n.slice(0, 2) + ") " + n.slice(2);
    if (n.length <= 10) return "(" + n.slice(0, 2) + ") " + n.slice(2, 6) + "-" + n.slice(6);
    return "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
  }

  campos.telefone.addEventListener("input", function () {
    campos.telefone.value = formatarTelefone(campos.telefone.value);
  });

  /* ---- Contador ---- */
  function atualizarContador() {
    var total = campos.mensagem.value.length;
    contador.textContent = total;
    contadorCaixa.classList.toggle("alerta", total >= LIMITE * 0.85 && total < LIMITE);
    contadorCaixa.classList.toggle("limite", total >= LIMITE);
  }
  campos.mensagem.addEventListener("input", atualizarContador);

  /* ---- Regras de validação: retornam "" se estiver tudo certo ou o texto do erro ---- */
  var regras = {
    nome: function (v) {
      v = v.trim();
      if (!v) return "Informe seu nome.";
      if (v.length < 3) return "O nome precisa ter pelo menos 3 letras.";
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(v)) return "Use apenas letras no nome.";
      return "";
    },
    telefone: function (v) {
      var n = v.replace(/\D/g, "");
      if (!n) return "Informe um telefone para contato.";
      if (n.length < 10) return "Telefone incompleto. Ex.: (31) 99999-9999.";
      if (n.charAt(0) === "0") return "DDD inválido. Use dois dígitos, sem o zero.";
      if (n.length === 11 && n.charAt(2) !== "9") return "Celulares com 11 dígitos começam com 9 após o DDD.";
      return "";
    },
    email: function (v) {
      v = v.trim();
      if (!v) return "Informe seu e-mail.";
      if (v.indexOf("@") === -1) return "O e-mail precisa ter @.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "E-mail inválido. Ex.: voce@exemplo.com.";
      return "";
    },
    mensagem: function (v) {
      v = v.trim();
      if (!v) return "Escreva uma mensagem.";
      if (v.length < 10) return "Conte um pouco mais (mínimo de 10 caracteres).";
      return "";
    }
  };

  function validar(nomeCampo) {
    var campo = campos[nomeCampo];
    var msg = regras[nomeCampo](campo.value);
    erros[nomeCampo].textContent = msg;
    campo.classList.toggle("invalido", !!msg);
    campo.classList.toggle("valido", !msg);
    campo.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function limparEstado() {
    Object.keys(campos).forEach(function (nomeCampo) {
      campos[nomeCampo].classList.remove("invalido", "valido");
      campos[nomeCampo].removeAttribute("aria-invalid");
      erros[nomeCampo].textContent = "";
      delete campos[nomeCampo].dataset.tocado;
    });
  }

  // Valida ao sair do campo; depois disso, revalida enquanto a pessoa digita
  Object.keys(campos).forEach(function (nomeCampo) {
    var campo = campos[nomeCampo];
    campo.addEventListener("blur", function () {
      if (campo.value.trim() !== "" || campo.dataset.tocado) {
        campo.dataset.tocado = "1";
        validar(nomeCampo);
      }
    });
    campo.addEventListener("input", function () {
      if (campo.dataset.tocado) validar(nomeCampo);
    });
  });

  /* ---- Envio ---- */
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var primeiroInvalido = null;
    Object.keys(campos).forEach(function (nomeCampo) {
      campos[nomeCampo].dataset.tocado = "1";
      if (!validar(nomeCampo) && !primeiroInvalido) primeiroInvalido = campos[nomeCampo];
    });

    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return;
    }

    // Simula um envio rápido para dar feedback visual no botão
    var nome = campos.nome.value.trim().split(/\s+/)[0];
    botaoEnviar.disabled = true;
    botaoEnviar.classList.add("enviando");
    botaoEnviar.querySelector(".botao-enviar-texto").textContent = "Enviando";

    setTimeout(function () {
      document.getElementById("modalNome").textContent = nome;
      if (LAM.abrirJanela) LAM.abrirJanela("modalEnviado", botaoEnviar);

      form.reset();
      limparEstado();
      atualizarContador();
      botaoEnviar.disabled = false;
      botaoEnviar.classList.remove("enviando");
      botaoEnviar.querySelector(".botao-enviar-texto").textContent = "Enviar mensagem";
    }, 700);
  });
})();
