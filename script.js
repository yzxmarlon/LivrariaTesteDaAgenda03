/**
 * Manipulando DOM — Meus contatos
 * Aplicativo simples sem persistência: os dados vivem só na memória
 * enquanto a página estiver aberta.
 */

(function () {
  "use strict";

  // ---- Referências aos elementos do DOM ----
  const form = document.getElementById("form-contato");
  const inputNome = document.getElementById("nome");
  const inputTelefone = document.getElementById("telefone");
  const selectTipo = document.getElementById("tipo");
  const inputEmail = document.getElementById("email");
  const listaContatos = document.getElementById("lista-contatos");
  const btnLimpar = document.getElementById("btn-limpar");
  const mensagemErro = document.getElementById("mensagem-erro");
  const radiosTema = document.querySelectorAll('input[name="tema"]');

  // ---- Tema (claro / escuro) ----
  function aplicarTema(tema) {
    if (tema === "escuro") {
      document.body.classList.add("tema-escuro");
    } else {
      document.body.classList.remove("tema-escuro");
    }
  }

  radiosTema.forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (radio.checked) {
        aplicarTema(radio.value);
      }
    });
  });

  // ---- Máscara simples de telefone brasileiro ----
  function formatarTelefone(valor) {
    var numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length === 0) {
      return "";
    }
    if (numeros.length <= 2) {
      return "(" + numeros;
    }
    if (numeros.length <= 7) {
      return "(" + numeros.slice(0, 2) + ")" + numeros.slice(2);
    }
    return (
      "(" +
      numeros.slice(0, 2) +
      ")" +
      numeros.slice(2, 7) +
      "-" +
      numeros.slice(7)
    );
  }

  inputTelefone.addEventListener("input", function () {
    inputTelefone.value = formatarTelefone(inputTelefone.value);
  });

  // ---- Validação ----
  function limparErrosVisuais() {
    inputNome.classList.remove("campo-invalido");
    inputTelefone.classList.remove("campo-invalido");
    selectTipo.classList.remove("campo-invalido");
    inputEmail.classList.remove("campo-invalido");
    mensagemErro.hidden = true;
    mensagemErro.textContent = "";
  }

  function mostrarErro(mensagem, campo) {
    mensagemErro.textContent = mensagem;
    mensagemErro.hidden = false;
    if (campo) {
      campo.classList.add("campo-invalido");
      campo.focus();
    }
  }

  function emailValido(email) {
    // Validação leve: só exige formato básico quando o campo foi preenchido
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function camposValidos() {
    limparErrosVisuais();

    var nome = inputNome.value.trim();
    var telefone = inputTelefone.value.trim();
    var tipo = selectTipo.value;
    var email = inputEmail.value.trim();

    if (!nome) {
      mostrarErro("Preencha o campo Nome antes de adicionar.", inputNome);
      return false;
    }

    if (!telefone) {
      mostrarErro("Preencha o campo Telefone antes de adicionar.", inputTelefone);
      return false;
    }

    // Exige DDD + número (mínimo 10 dígitos)
    var apenasDigitos = telefone.replace(/\D/g, "");
    if (apenasDigitos.length < 10) {
      mostrarErro(
        "Informe um telefone válido com DDD, por exemplo (47)99999-9999.",
        inputTelefone
      );
      return false;
    }

    if (!tipo) {
      mostrarErro("Selecione o Tipo de contato antes de adicionar.", selectTipo);
      return false;
    }

    if (email && !emailValido(email)) {
      mostrarErro("Informe um e-mail válido ou deixe o campo em branco.", inputEmail);
      return false;
    }

    return true;
  }

  // ---- Manipulação do DOM: criar item da lista ----
  function criarItemContato(nome, telefone, tipo, email) {
    // Formato do enunciado: Nome [(47)99999-9999] [Amigo]
    var li = document.createElement("li");
    var textoPrincipal = nome + " [" + telefone + "] [" + tipo + "]";
    var texto = document.createTextNode(textoPrincipal);
    li.appendChild(texto);

    if (email) {
      var spanEmail = document.createElement("span");
      spanEmail.className = "contato-email";
      spanEmail.appendChild(document.createTextNode("E-mail: " + email));
      li.appendChild(spanEmail);
    }

    return li;
  }

  function limparFormulario() {
    form.reset();
    // Mantém o tema selecionado após o reset do form
    var temaAtual = document.body.classList.contains("tema-escuro")
      ? "escuro"
      : "claro";
    document.querySelector('input[name="tema"][value="' + temaAtual + '"]').checked = true;
    limparErrosVisuais();
    inputNome.focus();
  }

  // ---- Evento: Adicionar contato ----
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!camposValidos()) {
      return;
    }

    var nome = inputNome.value.trim();
    var telefone = inputTelefone.value.trim();
    var tipo = selectTipo.value;
    var email = inputEmail.value.trim();

    var item = criarItemContato(nome, telefone, tipo, email);
    listaContatos.appendChild(item);

    limparFormulario();
  });

  // ---- Evento: Limpar lista ----
  btnLimpar.addEventListener("click", function () {
    if (!listaContatos.hasChildNodes()) {
      alert("A lista de contatos já está vazia.");
      return;
    }

    var confirmar = confirm("Deseja realmente limpar toda a lista de contatos?");
    if (confirmar) {
      // removeChild em loop — prática clássica de manipulação do DOM
      while (listaContatos.firstChild) {
        listaContatos.removeChild(listaContatos.firstChild);
      }
    }
  });

  // Foco inicial no nome ao carregar a página
  window.addEventListener("load", function () {
    inputNome.focus();
  });
})();
