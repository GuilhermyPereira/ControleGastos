using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

/// Dados necessários para criar uma nova pessoa.
/// A validação de formato (obrigatoriedade, limites) é feita automaticamente
/// pelo ASP.NET Core através do [ApiController], que retorna 400 quando inválido.

public record CriarPessoaDto(
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Nome deve ter entre 1 e 100 caracteres.")]
    string Nome,

    [Range(0, 130, ErrorMessage = "Idade deve estar entre 0 e 130.")]
    int Idade
);

/// Dados necessários para atualizar uma pessoa existente (funcionalidade extra,
/// além do exigido na especificação original).
public record AtualizarPessoaDto(
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Nome deve ter entre 1 e 100 caracteres.")]
    string Nome,

    [Range(0, 130, ErrorMessage = "Idade deve estar entre 0 e 130.")]
    int Idade
);

/// Representação de uma pessoa retornada pela API.
public record PessoaDto(Guid Id, string Nome, int Idade);