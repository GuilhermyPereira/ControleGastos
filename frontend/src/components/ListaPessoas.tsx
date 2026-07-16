import { useEffect, useState } from "react";
import type { Pessoa } from "../types";
import { listarPessoas, deletarPessoa, atualizarPessoa } from "../services/api";

interface Props {
  atualizarChave: number;
  aoDeletar: () => void;
}

/**
 * Lista todas as pessoas cadastradas, com opção de edição (nome/idade) e exclusão.
 * Ao excluir, o backend remove também todas as transações da pessoa (cascade).
 * A edição é uma funcionalidade extra além do exigido na especificação original.
 */
export default function ListaPessoas({ atualizarChave, aoDeletar }: Props) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [idadeEdicao, setIdadeEdicao] = useState("");
  const [erroEdicao, setErroEdicao] = useState("");

  useEffect(() => {
    carregar();
  }, [atualizarChave]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const dados = await listarPessoas();
      setPessoas(dados);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleDeletar = async (id: string, nome: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir "${nome}"? Todas as transações dessa pessoa também serão excluídas.`
    );
    if (!confirmar) return;

    try {
      await deletarPessoa(id);
      aoDeletar();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir pessoa.");
    }
  };

  const iniciarEdicao = (p: Pessoa) => {
    setEditandoId(p.id);
    setNomeEdicao(p.nome);
    setIdadeEdicao(String(p.idade));
    setErroEdicao("");
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setErroEdicao("");
  };

  const salvarEdicao = async (id: string) => {
    setErroEdicao("");

    if (!nomeEdicao.trim()) {
      setErroEdicao("Informe o nome.");
      return;
    }
    const idadeNumero = Number(idadeEdicao);
    if (isNaN(idadeNumero) || idadeNumero < 0) {
      setErroEdicao("Informe uma idade válida.");
      return;
    }

    try {
      await atualizarPessoa(id, { nome: nomeEdicao, idade: idadeNumero });
      setEditandoId(null);
      aoDeletar(); // reaproveita o callback de atualização (recarrega dados globais)
    } catch (err: any) {
      const msg = err?.response?.data ?? "Erro ao atualizar pessoa.";
      setErroEdicao(typeof msg === "string" ? msg : "Erro ao atualizar pessoa.");
    }
  };

  if (carregando) return <p>Carregando pessoas...</p>;

  return (
    <div className="card">
      <h3>Pessoas Cadastradas</h3>
      {pessoas.length === 0 && <p>Nenhuma pessoa cadastrada.</p>}
      <ul className="lista">
        {pessoas.map((p) => (
          <li key={p.id}>
            {editandoId === p.id ? (
              <div className="edicao-pessoa">
                <input
                  type="text"
                  value={nomeEdicao}
                  onChange={(e) => setNomeEdicao(e.target.value)}
                  placeholder="Nome"
                />
                <input
                  type="number"
                  value={idadeEdicao}
                  onChange={(e) => setIdadeEdicao(e.target.value)}
                  placeholder="Idade"
                  min={0}
                />
                <div className="acoes-edicao">
                  <button onClick={() => salvarEdicao(p.id)}>Salvar</button>
                  <button className="btn-secundario" onClick={cancelarEdicao}>
                    Cancelar
                  </button>
                </div>
                {erroEdicao && <p className="erro">{erroEdicao}</p>}
              </div>
            ) : (
              <>
                <span>
                  {p.nome} ({p.idade} anos)
                  {p.idade < 18 && <span className="tag-menor"> menor de idade</span>}
                </span>
                <div className="acoes-lista">
                  <button className="btn-secundario" onClick={() => iniciarEdicao(p)}>
                    Editar
                  </button>
                  <button className="btn-excluir" onClick={() => handleDeletar(p.id, p.nome)}>
                    Excluir
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}