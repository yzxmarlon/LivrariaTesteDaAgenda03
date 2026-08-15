(function () {
  "use strict";

  var CHAVE_STORAGE = "livraria-online-favoritos";
  var pagina = document.body.getAttribute("data-pagina");
  var listaLivros = document.getElementById("lista-livros");
  var avisoVazio = document.getElementById("aviso-vazio");
  var statusFavoritos = document.getElementById("status-favoritos");
  var resumoEscolhas = document.getElementById("resumo-escolhas");
  var btnRevisar = document.getElementById("btn-revisar");
  var dialogo = document.getElementById("dialogo-confirmacao");
  var listaRevisao = document.getElementById("lista-revisao");
  var dialogoTitulo = document.getElementById("dialogo-titulo");
  var dialogoTexto = document.getElementById("dialogo-texto");
  var dialogoSucesso = document.getElementById("dialogo-sucesso");
  var btnContinuar = document.getElementById("btn-continuar-escolhendo");
  var btnConfirmar = document.getElementById("btn-confirmar");
  var btnVerFavoritos = document.getElementById("btn-ver-favoritos");

  function estadoPadrao() {
    return { titulos: [], confirmado: false };
  }

  function lerEstado() {
    try {
      var bruto = localStorage.getItem(CHAVE_STORAGE);
      if (!bruto) {
        return estadoPadrao();
      }
      var dados = JSON.parse(bruto);
      if (!dados || !Array.isArray(dados.titulos)) {
        return estadoPadrao();
      }
      return {
        titulos: dados.titulos,
        confirmado: Boolean(dados.confirmado)
      };
    } catch (erro) {
      return estadoPadrao();
    }
  }

  function salvarEstado(estado) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado));
  }

  function titulosSelecionadosNaPagina() {
    var itens = listaLivros.querySelectorAll("li.selecionado");
    var titulos = [];
    itens.forEach(function (item) {
      titulos.push(item.textContent.trim());
    });
    return titulos;
  }

  function atualizarResumo(estado) {
    var quantidade = estado.titulos.length;

    if (quantidade === 0) {
      resumoEscolhas.textContent = "Nenhum livro selecionado.";
      btnRevisar.disabled = true;
      return;
    }

    btnRevisar.disabled = false;

    if (quantidade === 1) {
      resumoEscolhas.textContent = estado.confirmado
        ? "1 título confirmado: " + estado.titulos[0] + "."
        : "1 título selecionado. Revise e confirme para garantir a escolha.";
      return;
    }

    resumoEscolhas.textContent = estado.confirmado
      ? quantidade + " títulos confirmados."
      : quantidade + " títulos selecionados. Revise e confirme para garantir as escolhas.";
  }

  function atualizarStatus(estado) {
    if (!statusFavoritos) {
      return;
    }

    if (estado.titulos.length === 0) {
      statusFavoritos.textContent = "";
      return;
    }

    statusFavoritos.textContent = estado.confirmado
      ? "Estes são os favoritos que você confirmou."
      : "Estas escolhas ainda não foram confirmadas. Revise os títulos e confirme para não ter dúvida.";
  }

  function montarListaFavoritos(estado) {
    listaLivros.innerHTML = "";

    estado.titulos.forEach(function (titulo) {
      var item = document.createElement("li");
      item.className = "selecionado";
      item.textContent = titulo;
      listaLivros.appendChild(item);
    });

    if (avisoVazio) {
      avisoVazio.hidden = estado.titulos.length > 0;
    }
  }

  function marcarLivrosDaBiblioteca(estado) {
    var itens = listaLivros.querySelectorAll("li");
    itens.forEach(function (item) {
      var titulo = item.textContent.trim();
      if (estado.titulos.indexOf(titulo) !== -1) {
        item.classList.add("selecionado");
      } else {
        item.classList.remove("selecionado");
      }
    });
  }

  function preencherRevisao(titulos) {
    listaRevisao.innerHTML = "";
    titulos.forEach(function (titulo) {
      var item = document.createElement("li");
      item.textContent = titulo;
      listaRevisao.appendChild(item);
    });
  }

  function mostrarModoRevisao(estado) {
    dialogoTitulo.textContent = "Confirme seus favoritos";
    dialogoTexto.hidden = false;
    dialogoSucesso.hidden = true;
    btnContinuar.hidden = false;
    btnContinuar.textContent = "Continuar escolhendo";
    btnConfirmar.hidden = false;
    btnVerFavoritos.hidden = true;
    preencherRevisao(estado.titulos);
    btnConfirmar.disabled = estado.titulos.length === 0;
  }

  function mostrarModoSucesso(estado) {
    dialogoTitulo.textContent = "Escolhas confirmadas";
    dialogoTexto.hidden = true;
    dialogoSucesso.hidden = false;
    btnConfirmar.hidden = true;
    preencherRevisao(estado.titulos);

    if (pagina === "biblioteca") {
      btnContinuar.hidden = true;
      btnVerFavoritos.hidden = false;
    } else {
      btnContinuar.textContent = "Fechar";
      btnContinuar.hidden = false;
      btnVerFavoritos.hidden = true;
    }
  }

  function abrirDialogo() {
    var estado = lerEstado();
    mostrarModoRevisao(estado);
    if (typeof dialogo.showModal === "function") {
      dialogo.showModal();
    } else {
      dialogo.setAttribute("open", "");
    }
  }

  function fecharDialogo() {
    if (typeof dialogo.close === "function") {
      dialogo.close();
    } else {
      dialogo.removeAttribute("open");
    }
  }

  if (pagina === "biblioteca") {
    marcarLivrosDaBiblioteca(lerEstado());

    listaLivros.addEventListener("click", function (evento) {
      var item = evento.target.closest("li");
      if (!item || !listaLivros.contains(item)) {
        return;
      }

      item.classList.toggle("selecionado");

      var estado = {
        titulos: titulosSelecionadosNaPagina(),
        confirmado: false
      };
      salvarEstado(estado);
      atualizarResumo(estado);
    });
  }

  if (pagina === "favoritos") {
    montarListaFavoritos(lerEstado());
    atualizarStatus(lerEstado());
  }

  atualizarResumo(lerEstado());

  btnRevisar.addEventListener("click", function () {
    abrirDialogo();
  });

  btnContinuar.addEventListener("click", function () {
    fecharDialogo();
  });

  btnConfirmar.addEventListener("click", function () {
    var estado = lerEstado();
    if (estado.titulos.length === 0) {
      return;
    }

    estado.confirmado = true;
    salvarEstado(estado);
    atualizarResumo(estado);
    atualizarStatus(estado);
    mostrarModoSucesso(estado);
  });
})();
