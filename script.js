// Array em memória com os alunos
// >>> MUDANÇA (Exercício 2): agora guarda instâncias da classe Aluno (e não objetos simples)
let alunos = [];

// Posição do aluno em edição (null = cadastro novo)
let indiceEdicao = null;

// Valida os dados; retorna mensagem de erro ou null se estiver tudo certo
function validarAluno(nome, idadeTxt, notaTxt) {
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

  // >>> MUDANÇA (Exercício 2): antes era um objeto simples { nome, idade, curso, notaFinal };
  // agora o aluno é criado a partir da classe Aluno, usando o construtor
  const aluno = new Aluno(nome, Number(idadeTxt), curso, Number(notaTxt));

  if (indiceEdicao === null) {
    alunos.push(aluno);               // cadastro novo
  } else {
    alunos[indiceEdicao] = aluno;     // edição: substitui o aluno
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

// Redesenha a tabela com base no array de alunos
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
        <!-- >>> MUDANÇA (Exercício 2): nova coluna que usa o método isAprovado() da classe -->
        <td>${a.isAprovado() ? "Aprovado" : "Reprovado"}</td>
        <td>
          <button onclick="editarAluno(${i})">Editar</button>
          <button onclick="excluirAluno(${i})">Excluir</button>
        </td>
      </tr>`;
  }
}