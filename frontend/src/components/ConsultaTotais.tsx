import { useEffect, useState } from "react";
import type { TotalGeral } from "../types";
import { obterTotais } from "../services/api";
import { formatarMoeda } from "../utils/formatarMoeda";

interface Props {
  atualizarChave: number;
}

/**
 * Exibe o total de receitas, despesas e saldo de cada pessoa,
 * além do total geral consolidado de todas as pessoas.
 */
export default function ConsultaTotais({ atualizarChave }: Props) {
  const [dados, setDados] = useState<TotalGeral | null>(null);

  useEffect(() => {
    obterTotais().then(setDados).catch(console.error);
  }, [atualizarChave]);

  if (!dados) return <p>Carregando totais...</p>;

  return (
    <div className="card">
      <h3>Totais por Pessoa</h3>
      <table className="tabela-totais">
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {dados.pessoas.map((p) => (
            <tr key={p.pessoaId}>
              <td>{p.nome}</td>
              <td className="valor-positivo">{formatarMoeda(p.totalReceitas)}</td>
              <td className="valor-negativo">{formatarMoeda(p.totalDespesas)}</td>
              <td className={p.saldo >= 0 ? "valor-positivo" : "valor-negativo"}>
                {formatarMoeda(p.saldo)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>Total Geral</strong></td>
            <td className="valor-positivo"><strong>{formatarMoeda(dados.totalReceitasGeral)}</strong></td>
            <td className="valor-negativo"><strong>{formatarMoeda(dados.totalDespesasGeral)}</strong></td>
            <td className={dados.saldoGeral >= 0 ? "valor-positivo" : "valor-negativo"}>
              <strong>{formatarMoeda(dados.saldoGeral)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}