// >>> MUDANÇA (Exercício 2): ARQUIVO NOVO com a classe Aluno

// Classe que representa um aluno da DevTech Academy
class Aluno {
  // Construtor: chamado com "new Aluno(...)" para inicializar os atributos
  constructor(nome, idade, curso, notaFinal) {
    this.nome = nome;
    this.idade = idade;
    this.curso = curso;
    this.notaFinal = notaFinal;
  }

  // Retorna true se a nota final for 7 ou mais
  isAprovado() {
    return this.notaFinal >= 7;
  }

  // Retorna os dados do aluno em formato de texto
  toString() {
    return `${this.nome}, ${this.idade} anos, curso de ${this.curso}, nota ${this.notaFinal} (${this.isAprovado() ? "Aprovado" : "Reprovado"})`;
  }
}