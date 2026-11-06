// Array que guarda os alunos em memória (os dados somem ao recarregar a página)
let alunos = [];

// Posição do aluno em edição (null = cadastro novo)
let indiceEdicao = null;

// Valida os dados; retorna mensagem de erro ou null se estiver tudo certo
function validarAluno(nome, idadeTxt, notaTxt) {
  // Nome: só letras (\p{L} aceita acentos), separadas por espaço, hífen ou apóstrofo
  if (!/^\p{L}+(?:[ '\-]\p{L}+)*$/u.test(nome)) {
    return "O nome deve conter apenas letras (sem números ou símbolos).";
  }

  // Number() é mais rígido que parseInt: "12abc" vira NaN em vez de 12
  const idade = Number(idadeTxt);
  if (idadeTxt === "" || !Number.isInteger(idade) || idade < 1 || idade > 120) {
    return "A idade deve ser um número inteiro entre 1 e 120.";
  }

  const nota = Number(notaTxt);
  if (notaTxt === "" || isNaN(nota) || nota < 0 || nota > 10) {
    return "A nota final deve ser um número entre 0 e 10.";
  }

  return null;
}

// Cadastra ou edita um aluno, conforme o modo atual
function salvarAluno() {
  const nome = document.getElementById("nome").value.trim();
  const idadeTxt = document.getElementById("idade").value;
  const curso = document.getElementById("curso").value;
  const notaTxt = document.getElementById("nota").value;

  const erro = validarAluno(nome, idadeTxt, notaTxt);
  if (erro) {
    alert(erro);
    return;
  }

  // Objeto simples (a classe Aluno só aparece no Exercício 2)
  const aluno = {
    nome,
    idade: Number(idadeTxt),
    curso,
    notaFinal: Number(notaTxt)
  };

  if (indiceEdicao === null) {
    alunos.push(aluno);            // cadastro novo
  } else {
    alunos[indiceEdicao] = aluno;  // edição: substitui o aluno
    indiceEdicao = null;
    document.getElementById("btn-salvar").textContent = "Cadastrar";
  }

  document.getElementById("form-aluno").reset();
  renderizarTabela();
}

// Joga os dados do aluno de volta no formulário para edição
function editarAluno(indice) {
  const aluno = alunos[indice];
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("idade").value = aluno.idade;
  document.getElementById("curso").value = aluno.curso;
  document.getElementById("nota").value = aluno.notaFinal;

  indiceEdicao = indice;
  document.getElementById("btn-salvar").textContent = "Salvar alteração";
}

// Exclui o aluno e cancela a edição, se houver uma em andamento
function excluirAluno(indice) {
  alunos.splice(indice, 1);

  if (indiceEdicao !== null) {
    indiceEdicao = null;
    document.getElementById("form-aluno").reset();
    document.getElementById("btn-salvar").textContent = "Cadastrar";
  }

  renderizarTabela();
}

// Desenha a tabela com base no array de alunos
function renderizarTabela() {
  const tbody = document.getElementById("tabela-alunos");
  tbody.innerHTML = "";

  for (let i = 0; i < alunos.length; i++) {
    const a = alunos[i];
    tbody.innerHTML += `
      <tr>
        <td>${a.nome}</td>
        <td>${a.idade}</td>
        <td>${a.curso}</td>
        <td>${a.notaFinal}</td>
        <td>
          <button onclick="editarAluno(${i})">Editar</button>
          <button onclick="excluirAluno(${i})">Excluir</button>
        </td>
      </tr>`;
  }
}