CREATE TABLE public.presencas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  acompanhantes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX presencas_nome_unico ON public.presencas (lower(btrim(nome)));
GRANT INSERT ON public.presencas TO anon, authenticated;
GRANT ALL ON public.presencas TO service_role;
ALTER TABLE public.presencas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer pessoa pode registrar presenca" ON public.presencas FOR INSERT TO anon, authenticated WITH CHECK (true);