-- Vibranihil CRM - Supabase Schema
-- Execute este SQL no SQL Editor do Supabase Dashboard

-- Tabela de leads
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  contact_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  segment TEXT DEFAULT 'construtora',
  stage TEXT DEFAULT 'prospectado',
  city TEXT DEFAULT '',
  state TEXT DEFAULT 'SP',
  notes TEXT DEFAULT '',
  estimated_value NUMERIC(12,2) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT DEFAULT '',
  market TEXT DEFAULT '',
  region_restriction TEXT DEFAULT '',
  unit_price NUMERIC(12,2) DEFAULT 0,
  unit TEXT DEFAULT 'un'
);

-- Tabela de orcamentos
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  lead_company TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) DEFAULT 0,
  discount_percent NUMERIC(5,4) DEFAULT 0,
  discount_value NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  payment_condition TEXT DEFAULT 'a_prazo',
  notes TEXT DEFAULT '',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Policies: usuarios autenticados podem ver/editar tudo (equipe de 3 pessoas)
CREATE POLICY "Authenticated users can read leads" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert leads" ON leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update leads" ON leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete leads" ON leads FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read quotes" ON quotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert quotes" ON quotes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete quotes" ON quotes FOR DELETE TO authenticated USING (true);

-- Inserir produtos padrao
INSERT INTO products (name, code, description, market, region_restriction, unit_price, unit) VALUES
  ('Amortecedor AME', 'AME', 'Amortecedor em molas helicoidais de aço com núcleo elastomérico. Frequências de 2Hz, 3Hz e 5Hz.', 'Construção Civil - HVAC', 'Todas, menos Sul BR, Rio, Chile, Colômbia e Paraguai', 0, 'un'),
  ('Base de Inércia', 'BI', 'Base anti-vibratória para suporte de equipamentos. Adiciona rigidez e reduz oscilações.', 'Construção Civil - HVAC', '', 0, 'un'),
  ('Base para Motobomba', 'BM', 'Base específica para instalação de motobombas com isolamento de vibração.', 'Construção Civil - HVAC', '', 0, 'un'),
  ('Coxim', 'CB', 'Isoladores de vibração metal-borracha para equipamentos acima de 1.200 RPM.', 'Construção Civil - HVAC', '', 0, 'un'),
  ('AM PN', 'AMPN', 'Pé isolador de vibração com nivelador. Permite ajuste fino de altura.', 'Todos', '', 0, 'un'),
  ('AM TCB', 'AMTCB', 'Amortecedor para equipamentos embarcados. Isolamento a partir de 22Hz.', 'Todos', '', 0, 'un'),
  ('PAD', 'PAD', 'Placas de borracha de alta durabilidade. Frequência natural de 8 a 22Hz.', 'Todos', '', 0, 'un'),
  ('AMF 3510', 'AMF3510', 'Amortecedor com suporte para aplicações estruturais.', 'Todos', '', 0, 'un'),
  ('IsoDoble', 'ISODOBLE', 'Isolador acústico para parede e teto. Desconexão total para isolamento de ruído.', 'Todos', '', 0, 'un'),
  ('SilenZi', 'SILENZI', 'Sistema de isolamento acústico para ambientes.', 'Todos', '', 0, 'un'),
  ('Apoio Simples', 'AS', 'Apoio básico para isolamento de vibração.', 'Todos', '', 0, 'un'),
  ('K-PAD', 'KPAD', 'Placas de espuma de polietileno com PAD central. Frequência de 7.8 a 22Hz. Para piscinas, helipontos, academias.', 'Exportação', 'Menos Chile, Colômbia e Paraguai', 0, 'un');

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
