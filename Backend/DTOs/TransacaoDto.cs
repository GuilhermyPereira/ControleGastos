using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs;

/// Dados necessários para criar uma nova transação.
/// Regras que dependem do banco (pessoa existir, regra do menor de idade)
/// continuam validadas manualmente no controller, pois DataAnnotations
/// não têm acesso ao banco de dados.
public record CriarTransacaoDto(
    [Required(ErrorMessage = "Descrição é obrigatória.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Descrição deve ter entre 1 e 200 caracteres.")]
    string Descricao,

    [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero.")]
    decimal Valor,

    TipoTransacao Tipo,

    [Required(ErrorMessage = "Pessoa é obrigatória.")]
    Guid PessoaId
);

/// Representação de uma transação retornada pela API.
public record TransacaoDto(Guid Id, string Descricao, decimal Valor, TipoTransacao Tipo, Guid PessoaId);