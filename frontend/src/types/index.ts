// Tipos compartilhados entre os componentes, espelhando os DTOs do back-end

export type TipoTransacao = "Receita" | "Despesa";

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface CriarPessoa {
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export interface CriarTransacao {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

export interface TotalPorPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalGeral {
  pessoas: TotalPorPessoa[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoGeral: number;
}

export interface AtualizarPessoa {
  nome: string;
  idade: number;
}