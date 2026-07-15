using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers;

/// Endpoints para gerenciamento de transações: criação e listagem.
/// Não há edição/exclusão, conforme especificação do desafio.

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context) => _context = context;

    // GET /api/transacoes -> lista todas as transações cadastradas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoDto>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .Select(t => new TransacaoDto(t.Id, t.Descricao, t.Valor, t.Tipo, t.PessoaId))
            .ToListAsync();

        return Ok(transacoes);
    }

    // POST /api/transacoes -> cria uma nova transação
    // Validações de formato (Descrição, Valor) são feitas automaticamente pelos
    // DataAnnotations em CriarTransacaoDto. Aqui tratamos apenas as regras de
    // negócio que dependem de consulta ao banco.
    [HttpPost]
    public async Task<ActionResult<TransacaoDto>> Criar(CriarTransacaoDto dto)
    {
        // Regra: a pessoa informada precisa existir no cadastro
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
            return BadRequest("Pessoa informada não existe.");

        // Regra de negócio: pessoas menores de 18 anos só podem cadastrar despesas
        if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            return BadRequest("Pessoas menores de idade só podem cadastrar despesas.");

        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        var resultado = new TransacaoDto(transacao.Id, transacao.Descricao, transacao.Valor, transacao.Tipo, transacao.PessoaId);
        return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, resultado);
    }
}