import { useState } from "react";
import CadastroPessoa from "./components/CadastroPessoas";
import ListaPessoas from "./components/ListaPessoas";
import CadastroTransacao from "./components/CadastroTransacao";
import ListaTransacoes from "./components/ListaTransacoes";
import ConsultaTotais from "./components/ConsultaTotais";
import "./App.css";

type Aba = "pessoas" | "transacoes" | "totais";

/**
 * Componente raiz da aplicação.
 *
 * Controla um "atualizarChave" incremental: sempre que uma pessoa ou transação
 * é criada/excluída, essa chave é incrementada, forçando os componentes de
 * listagem e totais (que dependem dela via useEffect) a recarregar os dados
 * mais recentes da API.
 *
 * Também controla o tema (claro/escuro), aplicado via classe CSS "dark"
 * na div raiz, que altera as variáveis de cor definidas em index.css.
 */
function App() {
  const [atualizarChave, setAtualizarChave] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState<Aba>("pessoas");
  const [temaEscuro, setTemaEscuro] = useState(false);

  const forcarAtualizacao = () => setAtualizarChave((prev) => prev + 1);

  const abas: { id: Aba; label: string }[] = [
    { id: "pessoas", label: "Pessoas" },
    { id: "transacoes", label: "Transações" },
    { id: "totais", label: "Totais" },
  ];

  return (
    <div className={`app ${temaEscuro ? "dark" : ""}`}>
      <header className="app-header">
        <div className="app-header-conteudo">
          <div>
            <h1>Controle de Gastos Residenciais</h1>
            <p className="app-subtitulo">Gerencie pessoas, transações e acompanhe os totais</p>
          </div>
          <button className="btn-tema" onClick={() => setTemaEscuro((prev) => !prev)}>
            {temaEscuro ? " Modo claro" : " Modo escuro"}
          </button>
        </div>
      </header>

      <nav className="tabs">
        {abas.map((aba) => (
          <button
            key={aba.id}
            className={`tab ${abaAtiva === aba.id ? "tab-ativa" : ""}`}
            onClick={() => setAbaAtiva(aba.id)}
          >
            {aba.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {abaAtiva === "pessoas" && (
          <section className="secao">
            <div className="grid-duas-colunas">
              <CadastroPessoa aoCadastrar={forcarAtualizacao} />
              <ListaPessoas atualizarChave={atualizarChave} aoDeletar={forcarAtualizacao} />
            </div>
          </section>
        )}

        {abaAtiva === "transacoes" && (
          <section className="secao">
            <div className="grid-duas-colunas">
              <CadastroTransacao aoCadastrar={forcarAtualizacao} atualizarChave={atualizarChave} />
              <ListaTransacoes atualizarChave={atualizarChave} />
            </div>
          </section>
        )}

        {abaAtiva === "totais" && (
          <section className="secao">
            <ConsultaTotais atualizarChave={atualizarChave} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;