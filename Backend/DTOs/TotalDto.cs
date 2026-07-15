namespace Backend.DTOs;

//TotalPorPessoaDto representa o total de receitas, despesas e saldo de uma pessoa específica.
public record TotalPorPessoaDto(Guid PessoaId, string Nome, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);

//TotalGeralDto representa o total geral de receitas, despesas e saldo de todas as pessoas.
public record TotalGeralDto(List<TotalPorPessoaDto> Pessoas, decimal TotalReceitasGeral, decimal TotalDespesasGeral, decimal SaldoGeral);