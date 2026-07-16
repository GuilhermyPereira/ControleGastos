import { useEffect, useState } from "react";
import type React from "react";
import type { Pessoa, TipoTransacao } from "../types";
import { listarPessoas, criarTransacao } from "../services/api";

interface Props {
  aoCadastrar: () => void;
  atualizarChave: number; // recarrega a lista de pessoas quando alguém é cadastrado/excluído em outro componente
}

/**
 * Formulário de cadastro de transação (receita ou despesa) vinculada a uma pessoa.
 * Se a pessoa selecionada for menor de idade, o campo "Receita" é desabilitado,
 * refletindo a regra de negócio também aplicada no backend.
 */
export default function CadastroTransacao({ aoCadastrar, atualizarChave }: Props) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [pessoaId, setPessoaId] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarPessoas().then(setPessoas).catch(console.error);
  }, [atualizarChave]);

  const pessoaSelecionada = pessoas.find((p) => p.id === pessoaId);
  const ehMenorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  // Se trocar para uma pessoa menor de idade enquanto "Receita" estava selecionado, força para "Despesa"
  useEffect(() => {
    if (ehMenorDeIdade && tipo === "Receita") {
      setTipo("Despesa");
    }
  }, [ehMenorDeIdade]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");

    if (!descricao.trim()) {
      setErro("Informe a descrição.");
      return;
    }
    const valorNumero = Number(valor);
    if (isNaN(valorNumero) || valorNumero <= 0) {
      setErro("Informe um valor válido maior que zero.");
      return;
    }
    if (!pessoaId) {
      setErro("Selecione uma pessoa.");
      return;
    }

    try {
      await criarTransacao({ descricao, valor: valorNumero, tipo, pessoaId });
      setDescricao("");
      setValor("");
      setTipo("Despesa");
      aoCadastrar();
    } catch (err: any) {
      // Repassa a mensagem de erro de regra de negócio vinda do backend, se houver
      const msg = err?.response?.data ?? "Erro ao cadastrar transação.";
      setErro(typeof msg === "string" ? msg : "Erro ao cadastrar transação.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Cadastrar Transação</h3>

      <div className="form-group">
        <label>Pessoa</label>
        <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
          <option value="">Selecione...</option>
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} {p.idade < 18 ? "(menor de idade)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Supermercado"
        />
      </div>

      <div className="form-group">
        <label>Valor (R$)</label>
        <input
          type="number"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="0,00"
          min={0}
        />
      </div>

      <div className="form-group">
        <label>Tipo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoTransacao)}>
          <option value="Despesa">Despesa</option>
          <option value="Receita" disabled={ehMenorDeIdade}>
            Receita {ehMenorDeIdade ? "(indisponível para menores de idade)" : ""}
          </option>
        </select>
      </div>

      {erro && <p className="erro">{erro}</p>}
      <button type="submit">Cadastrar</button>
    </form>
  );
}