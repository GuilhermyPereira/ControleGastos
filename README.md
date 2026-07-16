# Controle de Gastos Residenciais

Sistema de controle de gastos residenciais desenvolvido como desafio técnico. Permite o cadastro de pessoas, o cadastro de transações financeiras (receitas e despesas) vinculadas a essas pessoas, e a consulta de totais consolidados.

## Tecnologias

**Back-end**
- .NET 10 / ASP.NET Core Web API
- Entity Framework Core
- SQLite (persistência em arquivo local, `gastos.db`)
- Swagger / OpenAPI (documentação interativa dos endpoints)

**Front-end**
- React 19 + TypeScript
- Vite
- Axios (consumo da API)

## Estrutura do projeto

    ControleGastos/
    ├── Backend/                  # API .NET
    │   ├── Controlers/           # Endpoints HTTP (Pessoas, Transacoes, Totais)
    │   ├── Data/                 # DbContext do Entity Framework Core
    │   ├── DTOs/                 # Objetos de transferência de dados (entrada/saída da API)
    │   ├── Models/                # Entidades de domínio (Pessoa, Transacao, TipoTransacao)
    │   ├── Migrations/            # Migrations do EF Core
    │   └── Program.cs             # Configuração da aplicação (DI, CORS, Swagger, migrations automáticas)
    └── frontend/                  # SPA React
        └── src/
            ├── components/         # Componentes de UI (formulários e listagens)
            ├── services/           # Camada de comunicação com a API (axios)
            ├── types/              # Tipos TypeScript compartilhados
            └── utils/              # Funções utilitárias (ex: formatação de moeda)

## Como executar

### Pré-requisitos
- .NET SDK 8+ (https://dotnet.microsoft.com/download)
- Node.js 18+ (https://nodejs.org/)

### Back-end

```bash
cd Backend
dotnet restore
dotnet run
```

A API sobe em `http://localhost:5248` (a porta pode variar, confira no terminal). O banco SQLite (`gastos.db`) é criado automaticamente na primeira execução, e as migrations são aplicadas automaticamente ao iniciar a aplicação.

Documentação interativa (Swagger): `http://localhost:5248/swagger`

### Front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

**Importante:** o front-end está configurado para consumir a API em `http://localhost:5248` (arquivo `frontend/src/services/api.ts`) e o back-end libera CORS apenas para `http://localhost:5173` (arquivo `Backend/Program.cs`). Se as portas forem diferentes no seu ambiente, ajuste esses dois pontos.

## Funcionalidades

### Cadastro de pessoas
- Criação, listagem e exclusão
- Identificador único gerado automaticamente (GUID)
- Campos: Nome, Idade
- **Ao excluir uma pessoa, todas as suas transações são excluídas automaticamente** (exclusão em cascata configurada no nível do banco de dados, via `OnDelete(DeleteBehavior.Cascade)`)
- **Extra além do especificado:** edição de nome/idade de uma pessoa já cadastrada. Ao reduzir a idade para menor de 18 anos, a edição é bloqueada caso a pessoa já possua receitas cadastradas, para manter consistente a regra de negócio de transações (ver seção abaixo).

### Cadastro de transações
- Criação e listagem (sem edição/exclusão, conforme especificado)
- Identificador único gerado automaticamente (GUID)
- Campos: Descrição, Valor, Tipo (Receita/Despesa), Pessoa
- Validação de que a pessoa informada existe no cadastro
- **Regra de negócio:** pessoas menores de 18 anos só podem ter despesas cadastradas — validado tanto no back-end (fonte da verdade) quanto refletido na interface (opção "Receita" desabilitada no formulário)

### Consulta de totais
- Lista todas as pessoas com total de receitas, despesas e saldo (receita − despesa) de cada uma
- Exibe o total geral consolidado (receitas, despesas e saldo líquido de todas as pessoas)
- Valores exibidos formatados em moeda brasileira (ex: `R$ 1.200,00`)

## Decisões técnicas

- **SQLite**: escolhido por não exigir instalação de um servidor de banco separado, mantendo a persistência simples em um único arquivo (`gastos.db`), adequado ao escopo do desafio.
- **DTOs em vez de expor entidades diretamente**: evita ciclos de serialização (Pessoa <-> Transacao) e dá controle explícito sobre o que a API expõe.
- **DataAnnotations nos DTOs**: validações de formato (campos obrigatórios, limites de tamanho/valor) são feitas declarativamente e verificadas automaticamente pelo ASP.NET Core (`[ApiController]`), retornando 400 antes mesmo do código do controller ser executado. Regras que dependem de consulta ao banco (pessoa existir, regra do menor de idade) permanecem validadas explicitamente nos controllers.
- **Exclusão em cascata no banco**: garante a integridade mesmo se a exclusão for feita por outro meio que não a API (ex: acesso direto ao banco), em vez de depender apenas de lógica na aplicação.
- **Enum serializado como texto**: tanto no banco (`HasConversion<string>()`) quanto no JSON da API (`JsonStringEnumConverter`), para manter os dados legíveis (`"Receita"`/`"Despesa"`) em vez de números.
- **Migrations aplicadas automaticamente no startup**: simplifica a execução do projeto para avaliação, sem exigir passos manuais adicionais de setup do banco.
- **Edição de pessoa (extra)**: a especificação original não exige edição de pessoa nem de transação. Optei por implementar apenas a edição de pessoa como funcionalidade extra, mantendo transações fiéis ao especificado (criação e listagem apenas). A regra que impede reduzir a idade de uma pessoa com receitas para menor de 18 anos é uma decisão de design para manter a consistência da regra de negócio das transações, já que ela não é definida explicitamente no enunciado.

## Testando as regras de negócio

Um roteiro sugerido para validar o sistema:

1. Cadastre uma pessoa maior de idade e uma menor de idade.
2. Tente cadastrar uma Receita para a pessoa menor de idade — deve ser bloqueado.
3. Cadastre uma Despesa para a pessoa menor de idade — deve funcionar.
4. Cadastre Receitas e Despesas para a pessoa maior de idade.
5. Consulte a aba Totais e confira se os valores por pessoa e o total geral batem.
6. Tente editar a idade da pessoa maior de idade (que já tem receita) para menos de 18 — deve ser bloqueado.
7. Exclua uma pessoa e confirme que suas transações desaparecem das listagens e dos totais.
8. Feche e reabra o back-end para confirmar que os dados persistem.
