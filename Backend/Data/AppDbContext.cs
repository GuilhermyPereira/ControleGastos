using Microsoft.EntityFrameworkCore;
using Backend.Models;
namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Regra de negócio: ao deletar uma pessoa, todas as suas transações
        // devem ser apagadas junto (exclusão em cascata).
        modelBuilder.Entity<Pessoa>().HasMany(p => p.Transacoes).WithOne(t => t.Pessoa)
        .HasForeignKey(t => t.PessoaId).OnDelete(DeleteBehavior.Cascade);

        // Guarda o enum como texto no banco (ex: "Receita", "Despesa"),
        // o que deixa os dados mais legíveis ao inspecionar o .db diretamente.
        modelBuilder.Entity<Transacao>().Property(t => t.Tipo).HasConversion<string>();
    }
}