# DevTech Academy – Gerenciamento de Alunos

Sistema simples (HTML + JavaScript) para cadastrar, listar, editar e excluir alunos,
com relatórios. Desenvolvido em um container Docker (Nginx).

## Como rodar
​```bash
docker compose up -d      # sobe o ambiente
# acesse http://localhost:8080
docker compose down       # para o ambiente
​```

## Evolução do projeto

| Versão | Exercício | Conteúdo |
|--------|-----------|----------|
| v0.1.0 | Ex. 1 | CRUD com formulário e tabela (array de objetos) |
| v0.2.0 | Ex. 2 | Refatoração com a classe `Aluno` |
| v0.3.0 | Ex. 3 | `addEventListener`, funções anônimas e arrow functions |
| v1.0.0 | Ex. 4 | Relatórios com `filter`, `map`, `reduce`, `sort` |

Veja as [Releases](../../releases) e os [Pull Requests](../../pulls?q=is%3Apr+is%3Aclosed).

## Fluxo de versionamento
Uma branch por exercício → Pull Request → merge na `main` → tag + release.