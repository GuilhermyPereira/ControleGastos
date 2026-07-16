import { useState } from "react";
import type React from "react";
import { criarPessoa } from "../services/api";

interface Props {
  aoCadastrar: () => void; // callback para recarregar a lista após cadastro
}

/**
 * Formulário de cadastro de uma nova pessoa (nome + idade).
 */
export default function CadastroPessoas({ aoCadastrar }: Props) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) {
      setErro("Informe o nome.");
      return;
    }

    const idadeNumero = Number(idade);
    if (isNaN(idadeNumero) || idadeNumero < 0) {
      setErro("Informe uma idade válida.");
      return;
    }

    try {
      await criarPessoa({ nome, idade: idadeNumero });
      setNome("");
      setIdade("");
      aoCadastrar();
    } catch (err) {
      setErro("Erro ao cadastrar pessoa. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>Cadastrar Pessoa</h3>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
        />
      </div>
      <div className="form-group">
        <label>Idade</label>
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
          min={0}
        />
      </div>
      {erro && <p className="erro">{erro}</p>}
      <button type="submit">Cadastrar</button>
    </form>
  );
}