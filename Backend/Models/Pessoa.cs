namespace Backend.Models;
public class Pessoa
{
    // Propriedades

    // Id é gerado automaticamente como um novo Guid
    public Guid Id { get; set; } = Guid.NewGuid(); 

    // Nome é inicializado como uma string vazia
    public string Nome { get; set; } = string.Empty;

    // Idade é inicializado como 0
    public int Idade { get; set; } = 0;

    // Lista de transações associadas à pessoa, inicializada como uma lista vazia
    public List<Transacao> Transacoes { get; set; } = new();

}