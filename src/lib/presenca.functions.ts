import { createServerFn } from "@tanstack/react-start";

type Registro = {
  id: string;
  nome: string;
  acompanhantes: number;
  created_at: string;
};

export const registrarPresenca = createServerFn({ method: "POST" })
  .inputValidator((data: { nome: string; acompanhantes: number }) => {
    const nome = (data?.nome ?? "").trim().replace(/\s+/g, " ");
    const acompanhantes = Number(data?.acompanhantes ?? 0);
    if (nome.length < 3 || nome.length > 120) throw new Error("NOME_INVALIDO");
    if (![0, 1, 2, 3, 4, 5, 6].includes(acompanhantes)) throw new Error("ACOMPANHANTES_INVALIDO");
    return { nome, acompanhantes };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("presencas").insert({
      nome: data.nome,
      acompanhantes: data.acompanhantes,
    });
    if (error) {
      if (error.code === "23505") return { ok: false as const, motivo: "duplicado" as const };
      return { ok: false as const, motivo: "erro" as const };
    }
    return { ok: true as const };
  });

export const listarPresencas = createServerFn({ method: "POST" })
  .inputValidator((data: { senha: string }) => ({ senha: String(data?.senha ?? "") }))
  .handler(async ({ data }) => {
    if (data.senha !== (process.env["ADMIN_PASSWORD"] ?? "Educativa2026")) {
      return { ok: false as const, registros: [] as Registro[] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("presencas")
      .select("id, nome, acompanhantes, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { ok: true as const, registros: (rows ?? []) as Registro[] };
  });
