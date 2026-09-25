import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import logo from "@/assets/logo-feira.jpg.asset.json";
import { registrarPresenca } from "@/lib/presenca.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lista de Presença — Feira EduSaber 2026" },
      {
        name: "description",
        content:
          "Registre sua presença na Feira Científica e Cultural EduSaber 2026 informando seu nome e quantas pessoas te acompanham.",
      },
      { property: "og:title", content: "Lista de Presença — Feira EduSaber 2026" },
      {
        property: "og:description",
        content: "Registro de visitantes da Feira Científica e Cultural EduSaber 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const OPCOES = [1, 2, 3, 4, 5, 6];

function Index() {
  const registrar = useServerFn(registrarPresenca);
  const [nome, setNome] = useState("");
  const [acompanhantes, setAcompanhantes] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [fechado, setFechado] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (nome.trim().length < 3) {
      setErro("Informe seu nome completo.");
      return;
    }
    setEnviando(true);
    try {
      const res = await registrar({
        data: { nome, acompanhantes: acompanhantes ?? 0 },
      });
      if (res.ok) setConcluido(true);
      else if (res.motivo === "duplicado") setErro("Este nome já foi registrado na lista.");
      else setErro("Não foi possível registrar. Tente novamente.");
    } catch {
      setErro("Não foi possível registrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (fechado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-fair p-6 text-center">
        <p className="font-display text-2xl text-brand-blue">Você pode fechar esta janela.</p>
      </main>
    );
  }

  if (concluido) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-fair p-6 text-center">
        <h1 className="font-display text-3xl tracking-wide text-brand-green sm:text-4xl">
          AGRADECEMOS SUA VISITA!
        </h1>
        <img
          src={logo.url}
          alt="Feira Científica e Cultural EduSaber 2026"
          className="mt-8 w-64 max-w-full sm:w-80"
        />
        <button type="button" onClick={() => setFechado(true)} className="btn-fair mt-8">
          Fechar
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-fair px-4 py-10">
      <img
        src={logo.url}
        alt="Feira Científica e Cultural EduSaber 2026"
        className="w-44 sm:w-52"
      />
      <h1 className="mt-6 max-w-xl text-center font-display text-2xl leading-tight tracking-wide text-brand-blue sm:text-3xl">
        LISTA DE PRESENÇA FEIRA EDUSABER 2026
      </h1>

      <form onSubmit={onSubmit} className="card-fair mt-8 w-full max-w-md">
        <label className="block font-display text-sm tracking-wide text-brand-green">
          NOME COMPLETO
        </label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={120}
          placeholder="Digite seu nome completo"
          className="input-fair mt-2"
        />

        <p className="mt-6 font-display text-sm tracking-wide text-brand-green">
          QUANTAS PESSOAS TE ACOMPANHAM?
        </p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {OPCOES.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setAcompanhantes(acompanhantes === n ? null : n)}
              className={acompanhantes === n ? "chip-fair chip-fair-on" : "chip-fair"}
            >
              {n}
            </button>
          ))}
        </div>

        {erro && <p className="mt-4 text-sm font-semibold text-destructive">{erro}</p>}

        <button type="submit" disabled={enviando} className="btn-fair mt-6 w-full">
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      <Link
        to="/admin"
        className="mt-8 text-sm font-semibold text-brand-blue/70 underline underline-offset-4"
      >
        Área do administrador
      </Link>
    </main>
  );
}
