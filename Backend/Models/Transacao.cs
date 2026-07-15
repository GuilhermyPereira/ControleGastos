namespace Backend.Models;

public class Transacao
{
    // Propriedades

    // Id é gerado automaticamente como um novo Guid
    public Guid Id { get; set; } = Guid.NewGuid();

    // Descricao é inicializado como uma string vazia
    public string Descricao { get; set; } = string.Empty;

    // Valor é inicializado como 0.0
    public decimal Valor { get; set; } = 0.0m;

    public TipoTransacao Tipo { get; set; }
    public Guid PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}