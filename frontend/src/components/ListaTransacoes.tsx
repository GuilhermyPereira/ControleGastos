import { useEffect, useState } from "react";
import type { Pessoa, Transacao } from "../types";
import { listarTransacoes, listarPessoas } from "../services/api";
import { formatarMoeda } from "../utils/formatarMoeda";

interface Props {
  atualizarChave: number;
}

/**
 * Lista todas as transações cadastradas. Busca também a lista de pessoas
 * para exibir o nome de cada uma (o backend retorna apenas o pessoaId).
 */
export default function ListaTransacoes({ atualizarChave }: Props) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([listarTransacoes(), listarPessoas()])
      .then(([t, p]) => {
        setTransacoes(t);
        setPessoas(p);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [atualizarChave]);

  const nomeDaPessoa = (pessoaId: string) =>
    pessoas.find((p) => p.id === pessoaId)?.nome ?? "Desconhecida";

  if (carregando) return <p>Carregando transações...</p>;

  return (
    <div className="card">
      <h3>Transações</h3>
      {transacoes.length === 0 && <p>Nenhuma transação cadastrada.</p>}
      <ul className="lista">
        {transacoes.map((t) => (
          <li key={t.id}>
            <span>
              <strong>{t.descricao}</strong> — {nomeDaPessoa(t.pessoaId)} —{" "}
              <span className={t.tipo === "Receita" ? "valor-positivo" : "valor-negativo"}>
               {t.tipo === "Receita" ? "+ " : "- "}{formatarMoeda(t.valor)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}