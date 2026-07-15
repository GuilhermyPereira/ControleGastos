namespace Backend.DTOs;

//CriarPessoaDto é usado para criar uma nova pessoa, enquanto PessoaDto é usado para retornar informações de uma pessoa existente.
public record CriarPessoaDto(string Nome, int Idade);
public record PessoaDto(Guid Id, string Nome, int Idade);