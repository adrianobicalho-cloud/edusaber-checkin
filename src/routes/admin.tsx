import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import * as XLSX from "xlsx";
import { listarPresencas } from "@/lib/presenca.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administrador — Lista de Presença EduSaber 2026" },
      {
        name: "description",
        content:
          "Painel do administrador com todos os registros de presença da Feira EduSaber 2026 e download em XLSX ou CSV.",
      },
      { property: "og:title", content: "Administrador — Lista de Presença EduSaber 2026" },
      {
        property: "og:description",
        content: "Acompanhe os visitantes registrados na Feira EduSaber 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

type Registro = { id: string; nome: string; acompanhantes: number; created_at: string };

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

function Admin() {
  const listar = useServerFn(listarPresencas);
  const [senha, setSenha] = useState("");
  const [liberado, setLiberado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function carregar(senhaAtual: string) {
    setCarregando(true);
    setErro(null);
    try {
      const res = await listar({ data: { senha: senhaAtual } });
      if (!res.ok) {
        setErro("Senha incorreta.");
        setLiberado(false);
        return;
      }
      setRegistros(res.registros);
      setLiberado(true);
    } catch {
      setErro("Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  const totalVisitantes = registros.reduce((s, r) => s + 1 + r.acompanhantes, 0);

  function linhas() {
    return registros.map((r) => ({
      Nome: r.nome,
      Acompanhantes: r.acompanhantes,
      "Total de pessoas": 1 + r.acompanhantes,
      "Data do registro": formatarData(r.created_at),
    }));
  }

  function baixarXlsx() {
    const ws = XLSX.utils.json_to_sheet(linhas());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presenças");
    XLSX.writeFile(wb, "lista-presenca-edusaber-2026.xlsx");
  }

  function baixarCsv() {
    const ws = XLSX.utils.json_to_sheet(linhas());
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "lista-presenca-edusaber-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!liberado) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-fair px-4">
        <h1 className="text-center font-display text-2xl tracking-wide text-brand-blue">
          ÁREA DO ADMINISTRADOR
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            carregar(senha);
          }}
          className="card-fair mt-6 w-full max-w-sm"
        >
          <label className="block font-display text-sm tracking-wide text-brand-green">SENHA</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input-fair mt-2"
          />
          {erro && <p className="mt-3 text-sm font-semibold text-destructive">{erro}</p>}
          <button type="submit" disabled={carregando} className="btn-fair mt-5 w-full">
            {carregando ? "Verificando..." : "Entrar"}
          </button>
        </form>
        <Link to="/" className="mt-6 text-sm font-semibold text-brand-blue/70 underline">
          Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-fair px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl tracking-wide text-brand-blue">
          PAINEL DE PRESENÇAS — EDUSABER 2026
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="card-fair text-center">
            <p className="text-sm font-semibold text-muted-foreground">Registros</p>
            <p className="font-display text-4xl text-brand-green">{registros.length}</p>
          </div>
          <div className="card-fair text-center">
            <p className="text-sm font-semibold text-muted-foreground">Total de visitantes</p>
            <p className="font-display text-4xl text-brand-blue">{totalVisitantes}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={baixarXlsx} className="btn-fair">
            Baixar XLSX
          </button>
          <button type="button" onClick={baixarCsv} className="btn-fair btn-fair-blue">
            Baixar CSV
          </button>
          <button
            type="button"
            onClick={() => carregar(senha)}
            className="btn-fair btn-fair-ghost"
            disabled={carregando}
          >
            Atualizar
          </button>
        </div>

        <div className="card-fair mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="font-display text-xs tracking-wide text-brand-green">
                <th className="py-2">NOME</th>
                <th className="py-2">ACOMPANHANTES</th>
                <th className="py-2">TOTAL</th>
                <th className="py-2">REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2 font-medium">{r.nome}</td>
                  <td className="py-2">{r.acompanhantes}</td>
                  <td className="py-2">{1 + r.acompanhantes}</td>
                  <td className="py-2 text-muted-foreground">{formatarData(r.created_at)}</td>
                </tr>
              ))}
              {registros.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    Nenhuma presença registrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-brand-blue/70 underline">
          Voltar ao formulário
        </Link>
      </div>
    </main>
  );
}
