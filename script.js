// Array em memória com as instâncias de Aluno
let alunos = [];

// Posição do aluno em edição (null = cadastro novo)
let indiceEdicao = null;

// ---------- Controle de tema (claro / escuro) ----------
const btnTema = document.getElementById("btn-tema");
const htmlElement = document.documentElement;

const aplicarTema = (tema) => {
  htmlElement.setAttribute("data-bs-theme", tema);
  localStorage.setItem("temaPreferido", tema);

  if (btnTema) {
    btnTema.textContent = tema === "dark" ? "Modo Claro" : "Modo Escuro";
  }
};

const temaSalvo = localStorage.getItem("temaPreferido") || "light";
aplicarTema(temaSalvo);

if (btnTema) {
  btnTema.addEventListener("click", () => {
    const temaAtual = htmlElement.getAttribute("data-bs-theme") || "light";
    const novoTema = temaAtual === "dark" ? "light" : "dark";
    aplicarTema(novoTema);
  });
}

// ---------- Arrow functions de manipulação dos dados ----------
const adicionarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (indice, aluno) => { alunos[indice] = aluno; };
const removerAluno = (indice) => alunos.splice(indice, 1);

// Retorna mensagem de erro ou null se estiver tudo certo
const validarAluno = (nome, idadeTxt, notaTxt) => {
  // Nome: só letras (com acento), separadas por espaço, hífen ou apóstrofo
  if (!/^\p{L}+(?:[ '\-]\p{L}+)*$/u.test(nome)) {
    return "O nome deve conter apenas letras";
  }

  // Idade: inteiro entre 1 e 120
  const idade = Number(idadeTxt);
  if (idadeTxt === "" || !Number.isInteger(idade) || idade < 1 || idade > 120) {
    return "A idade deve ser um número inteiro não negativo";
  }

  // Nota: entre 0 e 10
  const nota = Number(notaTxt);
  if (notaTxt === "" || isNaN(nota) || nota < 0 || nota > 10) {
    return "A nota final não deve ser negativa";
  }

  return null;
};

// Referências aos elementos da página, buscadas uma única vez
const btnSalvar = document.getElementById("btn-salvar");
const form = document.getElementById("form-aluno");

// Sai do modo edição: limpa o formulário e volta o botão ao texto original
const cancelarEdicao = () => {
  indiceEdicao = null;
  form.reset();
  btnSalvar.textContent = "Cadastrar";
};

// Evento de clique do botão do formulário (função anônima)
btnSalvar.addEventListener("click", function () {
  const nome = document.getElementById("nome").value.trim();
  const idadeTxt = document.getElementById("idade").value;
  const curso = document.getElementById("curso").value;
  const notaTxt = document.getElementById("nota").value;

  // Se os dados forem inválidos, avisa e para
  const erro = validarAluno(nome, idadeTxt, notaTxt);
  if (erro) {
    alert(erro);
    return;
  }

  const aluno = new Aluno(nome, Number(idadeTxt), curso, Number(notaTxt));

  if (indiceEdicao === null) {
    adicionarAluno(aluno);
    alert("Aluno cadastrado com sucesso!");
  } else {
    atualizarAluno(indiceEdicao, aluno);
    alert("Aluno editado com sucesso!");
  }

  console.log(aluno.toString()); // registra no console do navegador (F12)
  cancelarEdicao();
  renderizarTabela();
});

// Preenche o formulário com os dados do aluno escolhido (arrow function)
const preencherFormulario = (indice) => {
  const a = alunos[indice];
  document.getElementById("nome").value = a.nome;
  document.getElementById("idade").value = a.idade;
  document.getElementById("curso").value = a.curso;
  document.getElementById("nota").value = a.notaFinal;
  indiceEdicao = indice;
  btnSalvar.textContent = "Salvar alteração";
};

// Cria um botão e já associa a ele o evento de clique recebido
// >>> MUDANÇA (Bootstrap): novo parâmetro "classes" com as classes CSS do Bootstrap do botão
function criarBotao(texto, aoClicar, classes) {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.className = classes;
  botao.addEventListener("click", aoClicar);
  return botao;
}

// Redesenha a tabela criando os elementos via DOM
function renderizarTabela() {
  const tbody = document.getElementById("tabela-alunos");
  tbody.innerHTML = "";

  alunos.forEach((a, i) => {
    const tr = document.createElement("tr");

    // Cria uma célula <td> para cada valor da linha
    [a.nome, a.idade, a.curso, a.notaFinal].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    });

    // >>> MUDANÇA (Bootstrap): a situação agora é um "badge" colorido
    // (verde = aprovado, vermelho = reprovado), em vez de texto simples
    const tdSituacao = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = a.isAprovado() ? "badge text-bg-success" : "badge text-bg-danger";
    badge.textContent = a.isAprovado() ? "Aprovado" : "Reprovado";
    tdSituacao.appendChild(badge);
    tr.appendChild(tdSituacao);

    // Célula com os botões de ação
    const tdAcoes = document.createElement("td");

    // >>> MUDANÇA (Bootstrap): classes btn-warning (amarelo) e btn-sm (pequeno); me-1 = margem à direita
    tdAcoes.appendChild(criarBotao("Editar", function () {
      preencherFormulario(i);
      console.log(`Editando: ${a.toString()}`);
    }, "btn btn-warning btn-sm me-1"));

    // >>> MUDANÇA (Bootstrap): classe btn-danger (vermelho)
    tdAcoes.appendChild(criarBotao("Excluir", function () {
      removerAluno(i);
      if (indiceEdicao !== null) cancelarEdicao(); // evita índice de edição inválido
      alert("Aluno excluído!");
      console.log(`Excluído: ${a.toString()}`);
      renderizarTabela();
    }, "btn btn-danger btn-sm"));

    tr.appendChild(tdAcoes);
    tbody.appendChild(tr);
  });
}

// ================== RELATÓRIOS ==================

// Área da página onde os relatórios aparecem
const resultado = document.getElementById("resultado-relatorio");

// Mostra um relatório: um título e uma lista de linhas de texto
const mostrar = (titulo, linhas) => {
  resultado.innerHTML = ""; // limpa o relatório anterior

  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  // >>> MUDANÇA (Bootstrap): h5 = tamanho de título menor; mt-3 = margem acima
  h3.className = "h5 mt-3";
  resultado.appendChild(h3);

  // Se não há dados, avisa e encerra
  if (linhas.length === 0) {
    // >>> MUDANÇA (Bootstrap): caixa de aviso cinza
    const aviso = document.createElement("div");
    aviso.className = "alert alert-secondary";
    aviso.textContent = "Nenhum dado para exibir.";
    resultado.appendChild(aviso);
    return;
  }

  // >>> MUDANÇA (Bootstrap): a lista vira um "list-group" (itens com borda, empilhados)
  const ul = document.createElement("ul");
  ul.className = "list-group";
  linhas.forEach((texto) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = texto;
    ul.appendChild(li);
  });
  resultado.appendChild(ul);
};

// Alunos aprovados: filter mantém só quem passou; map transforma cada aluno em texto
document.getElementById("btn-aprovados").addEventListener("click", () => {
  const aprovados = alunos.filter((a) => a.isAprovado());
  mostrar("Alunos aprovados", aprovados.map((a) => a.toString()));
});

// Média das notas: reduce soma todas as notas, depois divide pela quantidade
document.getElementById("btn-media-notas").addEventListener("click", () => {
  if (alunos.length === 0) return mostrar("Média das notas", []); // evita dividir por zero
  const soma = alunos.reduce((acc, a) => acc + a.notaFinal, 0);
  mostrar("Média das notas", [(soma / alunos.length).toFixed(2)]);
});

// Média das idades: mesma lógica da média das notas
document.getElementById("btn-media-idades").addEventListener("click", () => {
  if (alunos.length === 0) return mostrar("Média das idades", []);
  const soma = alunos.reduce((acc, a) => acc + a.idade, 0);
  mostrar("Média das idades", [(soma / alunos.length).toFixed(1) + " anos"]);
});

// Nomes em ordem alfabética: map extrai os nomes; sort ordena (localeCompare trata acentos)
document.getElementById("btn-ordem-alfabetica").addEventListener("click", () => {
  const nomes = alunos
    .map((a) => a.nome)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  mostrar("Nomes em ordem alfabética", nomes);
});

// Quantidade por curso: reduce monta um objeto como { Python: 2, Java: 1 }
document.getElementById("btn-por-curso").addEventListener("click", () => {
  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});

  const linhas = [];
  Object.entries(contagem).forEach(([curso, qtd]) => {
    linhas.push(`${curso}: ${qtd} aluno(s)`);
  });
  mostrar("Quantidade de alunos por curso", linhas);
});