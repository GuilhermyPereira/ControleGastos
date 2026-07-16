using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configura o EF Core com SQLite, o arquivo gastos.db é criado na raiz do backend
// e garante que os dados persistam mesmo após fechar a aplicação.
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=gastos.db"));

// Serializa enums como texto (ex: "Receita"/"Despesa") em vez de número,
// deixando o JSON da API mais legível para quem for consumir.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Libera o acesso do front-end (React rodando em outra porta) para consumir a API.
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "PermitirFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173") // porta padrão do Vite
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

var app = builder.Build();

// Aplica as migrations automaticamente ao iniciar a aplicação,
// garantindo que o banco de dados exista e esteja atualizado.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("PermitirFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
