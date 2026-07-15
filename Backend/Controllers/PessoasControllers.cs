using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

/// Endpoints para gerenciamento de pessoas: criação, listagem, atualização e exclusão.
/// A exclusão remove também, em cascata, todas as transações da pessoa (ver AppDbContext).

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context) => _context = context;

    // GET /api/pessoas -> lista todas as pessoas cadastradas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaDto>>> Listar()
    {
        var pessoas = await _context
            .Pessoas.Select(p => new PessoaDto(p.Id, p.Nome, p.Idade))
            .ToListAsync();

        return Ok(pessoas);
    }

    // POST /api/pessoas -> cria uma nova pessoa
    // A validação de Nome/Idade é feita automaticamente pelo ASP.NET Core
    // através dos DataAnnotations definidos em CriarPessoaDto.
    [HttpPost]
    public async Task<ActionResult<PessoaDto>> Criar(CriarPessoaDto dto)
    {
        var pessoa = new Pessoa { Nome = dto.Nome, Idade = dto.Idade };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        var resultado = new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
        return CreatedAtAction(nameof(Listar), new { id = pessoa.Id }, resultado);
    }

    // DELETE /api/pessoas/{id} -> remove a pessoa; suas transações são apagadas em cascata pelo banco
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null)
            return NotFound("Pessoa não encontrada.");

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT /api/pessoas/{id} -> atualiza nome e idade de uma pessoa existente.
// Funcionalidade extra além do exigido na especificação original (que pedia
// apenas criação, listagem e exclusão).
[HttpPut("{id}")]
public async Task<ActionResult<PessoaDto>> Atualizar(Guid id, AtualizarPessoaDto dto)
{
    var pessoa = await _context.Pessoas
        .Include(p => p.Transacoes)
        .FirstOrDefaultAsync(p => p.Id == id);

    if (pessoa is null)
        return NotFound("Pessoa não encontrada.");

    // Regra de negócio: se a idade for reduzida para menor de 18 anos,
    // a pessoa não pode ficar com receitas já cadastradas, pois isso violaria
    // a mesma regra aplicada na criação de transações (menores só podem ter despesas).
    var possuiReceitas = pessoa.Transacoes.Any(t => t.Tipo == TipoTransacao.Receita);
    if (dto.Idade < 18 && possuiReceitas)
    {
        return BadRequest(
            "Não é possível definir idade menor que 18 anos: esta pessoa já possui receitas cadastradas."
        );
    }

    pessoa.Nome = dto.Nome;
    pessoa.Idade = dto.Idade;

    await _context.SaveChangesAsync();

    return Ok(new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade));
}
}
