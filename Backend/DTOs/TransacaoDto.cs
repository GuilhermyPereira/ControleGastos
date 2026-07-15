using Backend.Models;
namespace Backend.DTOs;

//criarTransacaoDto é usado para criar uma nova transação, enquanto TransacaoDto é usado para retornar informações de uma transação existente.
public record CriarTransacaoDto(string Descricao, decimal Valor, TipoTransacao Tipo, Guid PessoaId);
public record TransacaoDto(Guid Id, string Descricao, decimal Valor, TipoTransacao Tipo, Guid PessoaId);