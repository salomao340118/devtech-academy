// Array em memória com as instâncias de Aluno
let alunos = [];

// Posição do aluno em edição (null = cadastro novo)
let indiceEdicao = null;

// ---------- Arrow functions de manipulação dos dados ----------
const adicionarAluno = (aluno) => alunos.push(aluno);
const atualizarAluno = (indice, aluno) => { alunos[indice] = aluno; };
const removerAluno = (indice) => alunos.splice(indice, 1);

// ---------- Validação (arrow function) ----------
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

// Referências aos elementos da página, buscadas uma única vez
const btnSalvar = document.getElementById("btn-salvar");
const form = document.getElementById("form-aluno");

// Sai do modo edição: limpa o formulário e volta o botão ao texto original
const cancelarEdicao = () => {
  indiceEdicao = null;
  form.reset();
  btnSalvar.textContent = "Cadastrar";
};

// ---------- Evento de clique do botão do formulário ----------
// Função anônima (sem nome) passada para o addEventListener
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
function criarBotao(texto, aoClicar) {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
}

// Redesenha a tabela criando os elementos via DOM (sem onclick no HTML)
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

    // Botão Editar: função anônima no evento de clique
    tdAcoes.appendChild(criarBotao("Editar", function () {
      preencherFormulario(i);
      console.log(`Editando: ${a.toString()}`);
    }));

    // Botão Excluir: função anônima no evento de clique
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

// =====================================================================
// >>> MUDANÇA (Exercício 4): TUDO daqui para baixo é NOVO (relatórios)
// =====================================================================

// Área da página onde os relatórios aparecem
const resultado = document.getElementById("resultado-relatorio");

// Mostra um relatório: um título e uma lista de linhas de texto
const mostrar = (titulo, linhas) => {
  resultado.innerHTML = ""; // limpa o relatório anterior

  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  resultado.appendChild(h3);

  // Se não há dados, avisa e encerra
  if (linhas.length === 0) {
    resultado.appendChild(document.createTextNode("Nenhum dado para exibir."));
    return;
  }

  // Monta uma lista <ul> com uma linha <li> por item
  const ul = document.createElement("ul");
  linhas.forEach((texto) => {
    const li = document.createElement("li");
    li.textContent = texto;
    ul.appendChild(li);
  });
  resultado.appendChild(ul);
};

// >>> MUDANÇA (Exercício 4): relatório de aprovados, com FILTER e MAP
// filter mantém só quem passou; map transforma cada aluno em texto
document.getElementById("btn-aprovados").addEventListener("click", () => {
  const aprovados = alunos.filter((a) => a.isAprovado());
  mostrar("Alunos aprovados", aprovados.map((a) => a.toString()));
});

// >>> MUDANÇA (Exercício 4): média das notas, com REDUCE
// reduce soma todas as notas, depois divide pela quantidade
document.getElementById("btn-media-notas").addEventListener("click", () => {
  if (alunos.length === 0) return mostrar("Média das notas", []); // evita dividir por zero
  const soma = alunos.reduce((acc, a) => acc + a.notaFinal, 0);
  mostrar("Média das notas", [(soma / alunos.length).toFixed(2)]);
});

// >>> MUDANÇA (Exercício 4): média das idades, com REDUCE (mesma lógica das notas)
document.getElementById("btn-media-idades").addEventListener("click", () => {
  if (alunos.length === 0) return mostrar("Média das idades", []);
  const soma = alunos.reduce((acc, a) => acc + a.idade, 0);
  mostrar("Média das idades", [(soma / alunos.length).toFixed(1) + " anos"]);
});

// >>> MUDANÇA (Exercício 4): nomes em ordem alfabética, com MAP e SORT
// map extrai os nomes; sort ordena. localeCompare com "pt-BR" trata acentos corretamente.
document.getElementById("btn-ordem-alfabetica").addEventListener("click", () => {
  const nomes = alunos
    .map((a) => a.nome)
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  mostrar("Nomes em ordem alfabética", nomes);
});

// >>> MUDANÇA (Exercício 4): quantidade por curso, com REDUCE e FOREACH
// reduce monta um objeto como { Python: 2, Java: 1 }
document.getElementById("btn-por-curso").addEventListener("click", () => {
  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1; // soma 1 ao curso (começa em 0 se não existir)
    return acc;
  }, {});

  // Converte o objeto em linhas de texto usando forEach
  const linhas = [];
  Object.entries(contagem).forEach(([curso, qtd]) => {
    linhas.push(`${curso}: ${qtd} aluno(s)`);
  });
  mostrar("Quantidade de alunos por curso", linhas);
});