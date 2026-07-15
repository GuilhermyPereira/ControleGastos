using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Controllers;

/// Endpoint de consulta de totais: receitas, despesas e saldo por pessoa,
/// além do total geral consolidado de todas as pessoas.

[ApiController]
[Route("api/[controller]")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context) => _context = context;

    // GET /api/totais -> retorna receitas, despesas e saldo por pessoa, além do total geral
    [HttpGet]
    public async Task<ActionResult<TotalGeralDto>> Obter()
    {
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .ToListAsync();

        var totaisPorPessoa = pessoas.Select(p =>
        {
            var receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
            return new TotalPorPessoaDto(p.Id, p.Nome, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalReceitasGeral = totaisPorPessoa.Sum(t => t.TotalReceitas);
        var totalDespesasGeral = totaisPorPessoa.Sum(t => t.TotalDespesas);

        var resultado = new TotalGeralDto(
            totaisPorPessoa,
            totalReceitasGeral,
            totalDespesasGeral,
            totalReceitasGeral - totalDespesasGeral
        );

        return Ok(resultado);
    }
}