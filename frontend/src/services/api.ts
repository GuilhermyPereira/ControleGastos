import axios from "axios";
import type {
  Pessoa,
  CriarPessoa,
  Transacao,
  CriarTransacao,
  TotalGeral,
  AtualizarPessoa,
} from "../types";

// URL base da API do back-end (.NET rodando localmente)
const api = axios.create({
  baseURL: "http://localhost:5248/api",
});

// ---- Pessoas ----
export const listarPessoas = () =>
  api.get<Pessoa[]>("/pessoas").then((res) => res.data);

export const criarPessoa = (dto: CriarPessoa) =>
  api.post<Pessoa>("/pessoas", dto).then((res) => res.data);

export const deletarPessoa = (id: string) =>
  api.delete(`/pessoas/${id}`);

// ---- Transações ----
export const listarTransacoes = () =>
  api.get<Transacao[]>("/transacoes").then((res) => res.data);

export const criarTransacao = (dto: CriarTransacao) =>
  api.post<Transacao>("/transacoes", dto).then((res) => res.data);

// ---- Totais ----
export const obterTotais = () =>
  api.get<TotalGeral>("/totais").then((res) => res.data);

// ---- Atualizar Pessoa ----
export const atualizarPessoa = (id: string, dto: AtualizarPessoa) =>
  api.put<Pessoa>(`/pessoas/${id}`, dto).then((res) => res.data);

export default api;