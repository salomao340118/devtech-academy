// Array em memória com as instâncias de Aluno
let alunos = [];

// Posição do aluno em edição (null = cadastro novo)
let indiceEdicao = null;

// >>> MUDANÇA (Exercício 3): ARROW FUNCTIONS de manipulação dos dados
// (substituem o alunos.push, alunos[i] = ... e alunos.splice que ficavam soltos nas funções)
const adicionarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (indice, aluno) => { alunos[indice] = aluno; };
const removerAluno = (indice) => alunos.splice(indice, 1);

// >>> MUDANÇA (Exercício 3): validarAluno virou ARROW FUNCTION (antes era "function validarAluno")
// Retorna mensagem de erro ou null se estiver tudo certo
const validarAluno = (nome, idadeTxt, notaTxt) => {
  // Nome: só letras (com acento), separadas por espaço, hífen ou apóstrofo
  if (!/^\p{L}+(?:[ '\-]\p{L}+)*$/u.test(nome)) {
    return "O nome deve conter apenas letras (sem números ou símbolos).";
  }

  // Idade: inteiro entre 1 e 120
  const idade = Number(idadeTxt);
  if (idadeTxt === "" || !Number.isInteger(idade) || idade < 1 || idade > 120) {
    return "A idade deve ser um número inteiro entre 1 e 120.";
  }

  // Nota: entre 0 e 10
  const nota = Number(notaTxt);
  if (notaTxt === "" || isNaN(nota) || nota < 0 || nota > 10) {
    return "A nota final deve ser um número entre 0 e 10.";
  }

  return null;
};

// >>> MUDANÇA (Exercício 3): referências aos elementos, buscadas uma única vez
// (necessárias para o addEventListener)
const btnSalvar = document.getElementById("btn-salvar");
const form = document.getElementById("form-aluno");

// >>> MUDANÇA (Exercício 3): nova arrow function que sai do modo edição
// (reaproveita o código que antes se repetia em salvarAluno e excluirAluno)
const cancelarEdicao = () => {
  indiceEdicao = null;
  form.reset();
  btnSalvar.textContent = "Cadastrar";
};

// >>> MUDANÇA (Exercício 3): addEventListener com FUNÇÃO ANÔNIMA
// (substitui a função salvarAluno() chamada pelo onclick do HTML)
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
    // >>> MUDANÇA (Exercício 3): mensagem ao cadastrar
    alert("Aluno cadastrado com sucesso!");
  } else {
    atualizarAluno(indiceEdicao, aluno);
    // >>> MUDANÇA (Exercício 3): mensagem ao editar
    alert("Aluno editado com sucesso!");
  }

  // >>> MUDANÇA (Exercício 3): mensagem no console do navegador (F12)
  console.log(aluno.toString());
  cancelarEdicao();
  renderizarTabela();
});

// >>> MUDANÇA (Exercício 3): editarAluno virou ARROW FUNCTION com outro nome
// (antes era "function editarAluno", chamada pelo onclick)
const preencherFormulario = (indice) => {
  const a = alunos[indice];
  document.getElementById("nome").value = a.nome;
  document.getElementById("idade").value = a.idade;
  document.getElementById("curso").value = a.curso;
  document.getElementById("nota").value = a.notaFinal;
  indiceEdicao = indice;
  btnSalvar.textContent = "Salvar alteração";
};

// >>> MUDANÇA (Exercício 3): função nova que cria um botão e registra o evento de clique nele
function criarBotao(texto, aoClicar) {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
}

// >>> MUDANÇA (Exercício 3): a tabela agora é criada via DOM (createElement), com forEach
// e arrow function, sem onclick dentro do HTML. A função excluirAluno() foi removida,
// pois a exclusão agora acontece dentro do evento do botão "Excluir".
function renderizarTabela() {
  const tbody = document.getElementById("tabela-alunos");
  tbody.innerHTML = "";

  // forEach com arrow function: "a" é o aluno e "i" é a posição dele
  alunos.forEach((a, i) => {
    const tr = document.createElement("tr");

    // Cria uma célula <td> para cada valor da linha
    [a.nome, a.idade, a.curso, a.notaFinal, a.isAprovado() ? "Aprovado" : "Reprovado"]
      .forEach((valor) => {
        const td = document.createElement("td");
        td.textContent = valor;
        tr.appendChild(td);
      });

    // Célula com os botões de ação
    const tdAcoes = document.createElement("td");

    // >>> MUDANÇA (Exercício 3): botão Editar com FUNÇÃO ANÔNIMA no evento de clique
    tdAcoes.appendChild(criarBotao("Editar", function () {
      preencherFormulario(i);
      console.log(`Editando: ${a.toString()}`);
    }));

    // >>> MUDANÇA (Exercício 3): botão Excluir com FUNÇÃO ANÔNIMA no evento de clique,
    // com mensagens por alert() e console.log()
    tdAcoes.appendChild(criarBotao("Excluir", function () {
      removerAluno(i);
      if (indiceEdicao !== null) cancelarEdicao(); // evita índice de edição inválido
      alert("Aluno excluído!");
      console.log(`Excluído: ${a.toString()}`);
      renderizarTabela();
    }));

    tr.appendChild(tdAcoes);
    tbody.appendChild(tr);
  });
}