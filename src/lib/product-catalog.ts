// Catalogo completo de produtos Vibranihil
// Fonte: Tabela de precos FM-7.2.4.1 (Agosto/2023)

export type ProductCategory =
  | "ame_3hz"
  | "ame_5hz"
  | "base_inercia"
  | "coxim"
  | "am_tcb"
  | "imb"
  | "batente"
  | "am_pn"
  | "amf"
  | "isodoble"
  | "patim"
  | "kpad"
  | "pad"
  | "castanhola";

export const PRODUCT_CATEGORIES: { key: ProductCategory; label: string; description: string }[] = [
  { key: "ame_3hz", label: "AME 3Hz", description: "Amortecedor em molas helicoidais - 3Hz" },
  { key: "ame_5hz", label: "AME 5Hz", description: "Amortecedor em molas helicoidais - 5Hz" },
  { key: "base_inercia", label: "Base de Inercia", description: "Base anti-vibratoria para equipamentos" },
  { key: "coxim", label: "Coxim (CB)", description: "Isoladores metal-borracha" },
  { key: "am_tcb", label: "AM TCB", description: "Amortecedor para equipamentos embarcados" },
  { key: "imb", label: "IMB", description: "Isolador de vibracao IMB" },
  { key: "batente", label: "Batente", description: "Batente anti-vibracao" },
  { key: "am_pn", label: "AM PN", description: "Pe isolador com nivelador" },
  { key: "amf", label: "AMF", description: "Amortecedor com suporte estrutural" },
  { key: "isodoble", label: "IsoDoble", description: "Isolador acustico para parede e teto" },
  { key: "patim", label: "Patim", description: "Patim anti-vibracao para motores" },
  { key: "kpad", label: "K-PAD", description: "Placas polietileno + PAD para piscinas" },
  { key: "pad", label: "PAD", description: "Placas de borracha de alta durabilidade" },
  { key: "castanhola", label: "Castanhola", description: "Castanhola anti-vibracao" },
];

export interface CatalogProduct {
  code: string;
  name: string;
  category: ProductCategory;
  hardness: string;
  unit_price: number;
  needs_quote: boolean;
  weight_kg: number;
  ipi_percent: number;
  unit: string;
}

// Produtos com preco = 0 e needs_quote = true sao itens "sob consulta"
export const PRODUCT_CATALOG: CatalogProduct[] = [
  // ===== AME 3Hz =====
  { code: "0130", name: "AME-3-11 S/PARAF.", category: "ame_3hz", hardness: "", unit_price: 0, needs_quote: true, weight_kg: 0.44, ipi_percent: 5, unit: "un" },
  { code: "0131", name: "AME-3-11 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 171, needs_quote: false, weight_kg: 0.44, ipi_percent: 5, unit: "un" },
  { code: "0140", name: "AME-3-16 S/PARAF.", category: "ame_3hz", hardness: "", unit_price: 0, needs_quote: true, weight_kg: 0.52, ipi_percent: 5, unit: "un" },
  { code: "0141", name: "AME-3-16 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 188, needs_quote: false, weight_kg: 0.52, ipi_percent: 5, unit: "un" },
  { code: "0151", name: "AME-3-21 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 203, needs_quote: false, weight_kg: 0.6, ipi_percent: 5, unit: "un" },
  { code: "0161", name: "AME-3-31 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 217, needs_quote: false, weight_kg: 0.92, ipi_percent: 5, unit: "un" },
  { code: "0171", name: "AME-3-41 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 230, needs_quote: false, weight_kg: 0.92, ipi_percent: 5, unit: "un" },
  { code: "0181", name: "AME-3-51 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 238, needs_quote: false, weight_kg: 0.93, ipi_percent: 5, unit: "un" },
  { code: "0191", name: "AME-3-61 PARAF. 5/16\"x38", category: "ame_3hz", hardness: "", unit_price: 245, needs_quote: false, weight_kg: 0.94, ipi_percent: 5, unit: "un" },
  { code: "0192", name: "AME-3-71 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 280, needs_quote: false, weight_kg: 1.67, ipi_percent: 5, unit: "un" },
  { code: "0201", name: "AME-3-91 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 317, needs_quote: false, weight_kg: 1.6, ipi_percent: 5, unit: "un" },
  { code: "0211", name: "AME-3-121 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 328, needs_quote: false, weight_kg: 1.96, ipi_percent: 5, unit: "un" },
  { code: "0221", name: "AME-3-151 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 345, needs_quote: false, weight_kg: 1.87, ipi_percent: 5, unit: "un" },
  { code: "0231", name: "AME-3-201 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 354, needs_quote: false, weight_kg: 2, ipi_percent: 5, unit: "un" },
  { code: "0232", name: "AME-3-201 ROSCA M12", category: "ame_3hz", hardness: "", unit_price: 354, needs_quote: false, weight_kg: 2, ipi_percent: 5, unit: "un" },
  { code: "0241", name: "AME-3-271 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 379, needs_quote: false, weight_kg: 2.1, ipi_percent: 5, unit: "un" },
  { code: "0242", name: "AME-3-271 ROSCA M12", category: "ame_3hz", hardness: "", unit_price: 379, needs_quote: false, weight_kg: 2.1, ipi_percent: 5, unit: "un" },
  { code: "0251", name: "AME-3-351 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 516, needs_quote: false, weight_kg: 2.3, ipi_percent: 5, unit: "un" },
  { code: "0252", name: "AME-3-351 ROSCA M12", category: "ame_3hz", hardness: "", unit_price: 516, needs_quote: false, weight_kg: 2.3, ipi_percent: 5, unit: "un" },
  { code: "0261", name: "AME-3-511 PARAF. 1/2\"x75", category: "ame_3hz", hardness: "", unit_price: 575, needs_quote: false, weight_kg: 2.4, ipi_percent: 5, unit: "un" },
  { code: "AME-3-701", name: "AME-3-701", category: "ame_3hz", hardness: "", unit_price: 603, needs_quote: false, weight_kg: 0, ipi_percent: 5, unit: "un" },
  { code: "AME-3-901", name: "AME-3-901", category: "ame_3hz", hardness: "", unit_price: 652, needs_quote: false, weight_kg: 0, ipi_percent: 5, unit: "un" },

  // ===== AME 5Hz =====
  { code: "0271", name: "AME-5-6 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 134, needs_quote: false, weight_kg: 0.44, ipi_percent: 5, unit: "un" },
  { code: "0281", name: "AME-5-11 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 135, needs_quote: false, weight_kg: 0.42, ipi_percent: 5, unit: "un" },
  { code: "0291", name: "AME-5-16 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 136, needs_quote: false, weight_kg: 0.44, ipi_percent: 5, unit: "un" },
  { code: "0301", name: "AME-5-21 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 139, needs_quote: false, weight_kg: 0.435, ipi_percent: 5, unit: "un" },
  { code: "0301-01", name: "AME-5-21 S/BASE", category: "ame_5hz", hardness: "", unit_price: 108, needs_quote: false, weight_kg: 0.195, ipi_percent: 5, unit: "un" },
  { code: "0311", name: "AME-5-31 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 142, needs_quote: false, weight_kg: 0.515, ipi_percent: 5, unit: "un" },
  { code: "0321", name: "AME-5-41 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 164, needs_quote: false, weight_kg: 1.432, ipi_percent: 5, unit: "un" },
  { code: "0322", name: "AME-5-41 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 164, needs_quote: false, weight_kg: 1.34, ipi_percent: 5, unit: "un" },
  { code: "0331", name: "AME-5-51 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 152, needs_quote: false, weight_kg: 0.45, ipi_percent: 5, unit: "un" },
  { code: "0341", name: "AME-5-71 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 189, needs_quote: false, weight_kg: 1.61, ipi_percent: 5, unit: "un" },
  { code: "0342", name: "AME-5-71 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 189, needs_quote: false, weight_kg: 1.61, ipi_percent: 5, unit: "un" },
  { code: "0351", name: "AME-5-121 PARAF. 5/16\"x38", category: "ame_5hz", hardness: "", unit_price: 207, needs_quote: false, weight_kg: 1.61, ipi_percent: 5, unit: "un" },
  { code: "0352", name: "AME-5-121 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 207, needs_quote: false, weight_kg: 1.6, ipi_percent: 5, unit: "un" },
  { code: "0361", name: "AME-5-181 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 260, needs_quote: false, weight_kg: 1.65, ipi_percent: 5, unit: "un" },
  { code: "0362", name: "AME-5-181 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 260, needs_quote: false, weight_kg: 1.71, ipi_percent: 5, unit: "un" },
  { code: "0371", name: "AME-5-281 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 343, needs_quote: false, weight_kg: 1.9, ipi_percent: 5, unit: "un" },
  { code: "0372", name: "AME-5-281 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 343, needs_quote: false, weight_kg: 1.76, ipi_percent: 5, unit: "un" },
  { code: "0381", name: "AME-5-381 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 405, needs_quote: false, weight_kg: 2.045, ipi_percent: 5, unit: "un" },
  { code: "0382", name: "AME-5-381 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 405, needs_quote: false, weight_kg: 2.045, ipi_percent: 5, unit: "un" },
  { code: "0391", name: "AME-5-491 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 460, needs_quote: false, weight_kg: 2.4, ipi_percent: 5, unit: "un" },
  { code: "0391-02", name: "AME-5-491 ROSCA M12", category: "ame_5hz", hardness: "", unit_price: 460, needs_quote: false, weight_kg: 2.4, ipi_percent: 5, unit: "un" },
  { code: "0393", name: "AME-5-701 PARAF. 1/2\"x75", category: "ame_5hz", hardness: "", unit_price: 553, needs_quote: false, weight_kg: 5.7, ipi_percent: 5, unit: "un" },
  { code: "AME-5-901", name: "AME-5-901", category: "ame_5hz", hardness: "", unit_price: 582, needs_quote: false, weight_kg: 0, ipi_percent: 5, unit: "un" },

  // ===== Base de Inercia =====
  { code: "BI-400x400", name: "Base Inercia 400x400x100mm", category: "base_inercia", hardness: "", unit_price: 548, needs_quote: false, weight_kg: 61, ipi_percent: 0, unit: "un" },
  { code: "BI-400x600", name: "Base Inercia 400x600x100mm", category: "base_inercia", hardness: "", unit_price: 619, needs_quote: false, weight_kg: 81, ipi_percent: 0, unit: "un" },
  { code: "BI-600x600", name: "Base Inercia 600x600x100mm", category: "base_inercia", hardness: "", unit_price: 690, needs_quote: false, weight_kg: 111, ipi_percent: 0, unit: "un" },
  { code: "BI-800x400", name: "Base Inercia 800x400x100mm", category: "base_inercia", hardness: "", unit_price: 699, needs_quote: false, weight_kg: 101, ipi_percent: 0, unit: "un" },
  { code: "BI-800x600", name: "Base Inercia 800x600x100mm", category: "base_inercia", hardness: "", unit_price: 768, needs_quote: false, weight_kg: 141, ipi_percent: 0, unit: "un" },
  { code: "BI-800x800", name: "Base Inercia 800x800x100mm", category: "base_inercia", hardness: "", unit_price: 849, needs_quote: false, weight_kg: 181, ipi_percent: 0, unit: "un" },
  { code: "BI-1000x400", name: "Base Inercia 1000x400x100mm", category: "base_inercia", hardness: "", unit_price: 844, needs_quote: false, weight_kg: 121, ipi_percent: 0, unit: "un" },
  { code: "BI-1000x600", name: "Base Inercia 1000x600x100mm", category: "base_inercia", hardness: "", unit_price: 858, needs_quote: false, weight_kg: 171, ipi_percent: 0, unit: "un" },
  { code: "BI-1000x800", name: "Base Inercia 1000x800x100mm", category: "base_inercia", hardness: "", unit_price: 937, needs_quote: false, weight_kg: 221, ipi_percent: 0, unit: "un" },
  { code: "BI-1000x1000", name: "Base Inercia 1000x1000x100mm", category: "base_inercia", hardness: "", unit_price: 1026, needs_quote: false, weight_kg: 271, ipi_percent: 0, unit: "un" },
  { code: "BI-1200x600", name: "Base Inercia 1200x600x100mm", category: "base_inercia", hardness: "", unit_price: 955, needs_quote: false, weight_kg: 201, ipi_percent: 0, unit: "un" },
  { code: "BI-1200x800", name: "Base Inercia 1200x800x100mm", category: "base_inercia", hardness: "", unit_price: 1036, needs_quote: false, weight_kg: 261, ipi_percent: 0, unit: "un" },
  { code: "BI-1200x1000", name: "Base Inercia 1200x1000x100mm", category: "base_inercia", hardness: "", unit_price: 1124, needs_quote: false, weight_kg: 321, ipi_percent: 0, unit: "un" },
  { code: "BI-1200x1200", name: "Base Inercia 1200x1200x100mm", category: "base_inercia", hardness: "", unit_price: 1199, needs_quote: false, weight_kg: 381, ipi_percent: 0, unit: "un" },
  { code: "BI-1400x600", name: "Base Inercia 1400x600x100mm", category: "base_inercia", hardness: "", unit_price: 1062, needs_quote: false, weight_kg: 231, ipi_percent: 0, unit: "un" },
  { code: "BI-1400x800", name: "Base Inercia 1400x800x100mm", category: "base_inercia", hardness: "", unit_price: 1141, needs_quote: false, weight_kg: 301, ipi_percent: 0, unit: "un" },
  { code: "BI-1400x1000", name: "Base Inercia 1400x1000x100mm", category: "base_inercia", hardness: "", unit_price: 1229, needs_quote: false, weight_kg: 371, ipi_percent: 0, unit: "un" },
  { code: "BI-1400x1200", name: "Base Inercia 1400x1200x100mm", category: "base_inercia", hardness: "", unit_price: 1327, needs_quote: false, weight_kg: 441, ipi_percent: 0, unit: "un" },
  { code: "BI-1400x1400", name: "Base Inercia 1400x1400x100mm", category: "base_inercia", hardness: "", unit_price: 1433, needs_quote: false, weight_kg: 511, ipi_percent: 0, unit: "un" },
  { code: "BI-1600x800", name: "Base Inercia 1600x800x100mm", category: "base_inercia", hardness: "", unit_price: 1257, needs_quote: false, weight_kg: 341, ipi_percent: 0, unit: "un" },
  { code: "BI-1600x1000", name: "Base Inercia 1600x1000x100mm", category: "base_inercia", hardness: "", unit_price: 1345, needs_quote: false, weight_kg: 421, ipi_percent: 0, unit: "un" },
  { code: "BI-1600x1200", name: "Base Inercia 1600x1200x100mm", category: "base_inercia", hardness: "", unit_price: 1443, needs_quote: false, weight_kg: 501, ipi_percent: 0, unit: "un" },
  { code: "BI-1600x1400", name: "Base Inercia 1600x1400x100mm", category: "base_inercia", hardness: "", unit_price: 1548, needs_quote: false, weight_kg: 581, ipi_percent: 0, unit: "un" },
  { code: "BI-1600x1600", name: "Base Inercia 1600x1600x100mm", category: "base_inercia", hardness: "", unit_price: 1664, needs_quote: false, weight_kg: 661, ipi_percent: 0, unit: "un" },
  { code: "BI-1500x1900", name: "Base Inercia 1500x1900x100mm", category: "base_inercia", hardness: "", unit_price: 2085, needs_quote: false, weight_kg: 733, ipi_percent: 0, unit: "un" },
  { code: "BI-2200x2200", name: "Base Inercia 2200x2200x100mm", category: "base_inercia", hardness: "", unit_price: 2568, needs_quote: false, weight_kg: 1231, ipi_percent: 0, unit: "un" },
  { code: "BI-2800x1000", name: "Base Inercia 2800x1000x100mm", category: "base_inercia", hardness: "", unit_price: 2568, needs_quote: false, weight_kg: 721, ipi_percent: 0, unit: "un" },

  // ===== Coxim (CB) =====
  { code: "0599", name: "CB-14-2P ROSCA M4", category: "coxim", hardness: "40 Sh.A", unit_price: 29.4, needs_quote: false, weight_kg: 0.006, ipi_percent: 18, unit: "un" },
  { code: "0600", name: "CB-14-2P ROSCA M4", category: "coxim", hardness: "60 Sh.A", unit_price: 29.6, needs_quote: false, weight_kg: 0.006, ipi_percent: 18, unit: "un" },
  { code: "0603", name: "CB-80x30-2P ROSCA M14", category: "coxim", hardness: "40 Sh.A", unit_price: 178.4, needs_quote: false, weight_kg: 0.483, ipi_percent: 18, unit: "un" },
  { code: "0604", name: "CB-80x30-2P ROSCA M14", category: "coxim", hardness: "60 Sh.A", unit_price: 178.6, needs_quote: false, weight_kg: 0.483, ipi_percent: 18, unit: "un" },
  { code: "0605", name: "CB-30-RP ROSCA M8", category: "coxim", hardness: "40 Sh.A", unit_price: 48.4, needs_quote: false, weight_kg: 0.37, ipi_percent: 18, unit: "un" },
  { code: "0606", name: "CB-30-RP ROSCA M8", category: "coxim", hardness: "60 Sh.A", unit_price: 48.6, needs_quote: false, weight_kg: 0.37, ipi_percent: 18, unit: "un" },
  { code: "0608", name: "CB-25-RP ROSCA M6", category: "coxim", hardness: "60 Sh.A", unit_price: 39.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0610", name: "CB-17-2P ROSCA M4", category: "coxim", hardness: "40 Sh.A", unit_price: 33.4, needs_quote: false, weight_kg: 0.012, ipi_percent: 18, unit: "un" },
  { code: "0611", name: "CB-40x30-RP ROSCA M8", category: "coxim", hardness: "40 Sh.A", unit_price: 42.4, needs_quote: false, weight_kg: 0.065, ipi_percent: 18, unit: "un" },
  { code: "0612", name: "CB-40x30-RP ROSCA M8", category: "coxim", hardness: "60 Sh.A", unit_price: 42.6, needs_quote: false, weight_kg: 0.066, ipi_percent: 18, unit: "un" },
  { code: "0613", name: "CB-40x30-2P ROSCA M8", category: "coxim", hardness: "40 Sh.A", unit_price: 42.4, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0614", name: "CB-40x30-2P ROSCA M8", category: "coxim", hardness: "60 Sh.A", unit_price: 42.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0620", name: "CB-20-2P ROSCA M4", category: "coxim", hardness: "40 Sh.A", unit_price: 39.4, needs_quote: false, weight_kg: 0.08, ipi_percent: 18, unit: "un" },
  { code: "0621", name: "CB-20-2P ROSCA M4", category: "coxim", hardness: "60 Sh.A", unit_price: 39.6, needs_quote: false, weight_kg: 0.08, ipi_percent: 18, unit: "un" },
  { code: "0624", name: "CB-20-RP ROSCA M6", category: "coxim", hardness: "40 Sh.A", unit_price: 39.4, needs_quote: false, weight_kg: 0.01, ipi_percent: 18, unit: "un" },
  { code: "0625", name: "CB-20-RP ROSCA M6", category: "coxim", hardness: "60 Sh.A", unit_price: 39.6, needs_quote: false, weight_kg: 0.01, ipi_percent: 18, unit: "un" },
  { code: "0626", name: "CB-25-2P ROSCA M6", category: "coxim", hardness: "60 Sh.A", unit_price: 39.6, needs_quote: false, weight_kg: 0.032, ipi_percent: 18, unit: "un" },
  { code: "0627", name: "CB-25-2P ROSCA M6", category: "coxim", hardness: "40 Sh.A", unit_price: 39.4, needs_quote: false, weight_kg: 0.032, ipi_percent: 18, unit: "un" },
  { code: "0628", name: "CB-65 ROSCA M8xM8", category: "coxim", hardness: "40 Sh.A", unit_price: 116.4, needs_quote: false, weight_kg: 0.24, ipi_percent: 18, unit: "un" },
  { code: "0629", name: "CB-65 ROSCA M8xM8", category: "coxim", hardness: "60 Sh.A", unit_price: 116.6, needs_quote: false, weight_kg: 0.24, ipi_percent: 18, unit: "un" },
  { code: "0632", name: "CB-25-2P ROSCA M8", category: "coxim", hardness: "40 Sh.A", unit_price: 39.4, needs_quote: false, weight_kg: 0.032, ipi_percent: 18, unit: "un" },
  { code: "0633", name: "CB-25-2P ROSCA M8", category: "coxim", hardness: "60 Sh.A", unit_price: 39.6, needs_quote: false, weight_kg: 0.032, ipi_percent: 18, unit: "un" },
  { code: "0634", name: "CB-25-RP ROSCA M8xM8", category: "coxim", hardness: "40 Sh.A", unit_price: 39.4, needs_quote: false, weight_kg: 0.05, ipi_percent: 18, unit: "un" },
  { code: "0635", name: "CB-25-RP ROSCA M8xM8", category: "coxim", hardness: "60 Sh.A", unit_price: 39.6, needs_quote: false, weight_kg: 0.05, ipi_percent: 18, unit: "un" },
  { code: "0640", name: "CB-36 ROSCA M8xM8", category: "coxim", hardness: "40 Sh.A", unit_price: 33.4, needs_quote: false, weight_kg: 0.048, ipi_percent: 18, unit: "un" },
  { code: "0641", name: "CB-36 ROSCA M8xM8", category: "coxim", hardness: "60 Sh.A", unit_price: 33.6, needs_quote: false, weight_kg: 0.048, ipi_percent: 18, unit: "un" },
  { code: "0642", name: "CB-36 ROSCA M8x5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 33.4, needs_quote: false, weight_kg: 0.048, ipi_percent: 18, unit: "un" },
  { code: "0643", name: "CB-36 ROSCA M8x5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 33.6, needs_quote: false, weight_kg: 0.048, ipi_percent: 18, unit: "un" },
  { code: "0644", name: "CB-36-B ROSCA 5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 42.4, needs_quote: false, weight_kg: 0.298, ipi_percent: 18, unit: "un" },
  { code: "0645", name: "CB-36-B ROSCA 5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 42.6, needs_quote: false, weight_kg: 0.298, ipi_percent: 18, unit: "un" },
  { code: "0649", name: "CB-36 ROSCA 5/16x5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 33.4, needs_quote: false, weight_kg: 0.298, ipi_percent: 18, unit: "un" },
  { code: "0650", name: "CB-36 ROSCA 5/16x5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 33.6, needs_quote: false, weight_kg: 0.298, ipi_percent: 18, unit: "un" },
  { code: "0655", name: "CB-38-2P ROSCA 3/8", category: "coxim", hardness: "60 Sh.A", unit_price: 42.6, needs_quote: false, weight_kg: 0.11, ipi_percent: 18, unit: "un" },
  { code: "0657", name: "CB-42 ROSCA M8xM8", category: "coxim", hardness: "40 Sh.A", unit_price: 38.4, needs_quote: false, weight_kg: 0.097, ipi_percent: 18, unit: "un" },
  { code: "0658", name: "CB-42 ROSCA M8x5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 38.4, needs_quote: false, weight_kg: 0.097, ipi_percent: 18, unit: "un" },
  { code: "0659", name: "CB-42 ROSCA M8x5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 38.6, needs_quote: false, weight_kg: 0.097, ipi_percent: 18, unit: "un" },
  { code: "0660", name: "CB-42 ROSCA 5/16x5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 38.4, needs_quote: false, weight_kg: 0.097, ipi_percent: 18, unit: "un" },
  { code: "0661", name: "CB-42 ROSCA 5/16x5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 38.6, needs_quote: false, weight_kg: 0.097, ipi_percent: 18, unit: "un" },
  { code: "0662", name: "CB-42-B ROSCA 5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 43.4, needs_quote: false, weight_kg: 0.336, ipi_percent: 18, unit: "un" },
  { code: "0663", name: "CB-42-B ROSCA 5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 43.6, needs_quote: false, weight_kg: 0.336, ipi_percent: 18, unit: "un" },
  { code: "0667", name: "CB-42 ROSCA M8xM8", category: "coxim", hardness: "60 Sh.A", unit_price: 38.6, needs_quote: false, weight_kg: 0.097, ipi_percent: 18, unit: "un" },
  { code: "0668", name: "CB-50X20-2P ROSCA M8", category: "coxim", hardness: "40 Sh.A", unit_price: 71.4, needs_quote: false, weight_kg: 0.115, ipi_percent: 18, unit: "un" },
  { code: "0669", name: "CB-50X20-2P ROSCA M8", category: "coxim", hardness: "60 Sh.A", unit_price: 71.6, needs_quote: false, weight_kg: 0.115, ipi_percent: 18, unit: "un" },
  { code: "0670", name: "CB-51 ROSCA 5/16x5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 58.4, needs_quote: false, weight_kg: 0.151, ipi_percent: 18, unit: "un" },
  { code: "0671", name: "CB-51 ROSCA 5/16x5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 58.6, needs_quote: false, weight_kg: 0.151, ipi_percent: 18, unit: "un" },
  { code: "0674", name: "CB-51-B ROSCA 5/16", category: "coxim", hardness: "40 Sh.A", unit_price: 66.4, needs_quote: false, weight_kg: 0.421, ipi_percent: 18, unit: "un" },
  { code: "0675", name: "CB-51-B ROSCA 5/16", category: "coxim", hardness: "60 Sh.A", unit_price: 66.6, needs_quote: false, weight_kg: 0.421, ipi_percent: 18, unit: "un" },
  { code: "0680", name: "CB-65 ROSCA 3/8", category: "coxim", hardness: "40 Sh.A", unit_price: 116.4, needs_quote: false, weight_kg: 0.238, ipi_percent: 18, unit: "un" },
  { code: "0681", name: "CB-65 ROSCA 3/8", category: "coxim", hardness: "60 Sh.A", unit_price: 116.6, needs_quote: false, weight_kg: 0.238, ipi_percent: 18, unit: "un" },
  { code: "0683", name: "CB-65-B ROSCA 3/8", category: "coxim", hardness: "40 Sh.A", unit_price: 124.4, needs_quote: false, weight_kg: 0.501, ipi_percent: 18, unit: "un" },
  { code: "0684", name: "CB-65-B ROSCA 3/8", category: "coxim", hardness: "60 Sh.A", unit_price: 124.6, needs_quote: false, weight_kg: 0.501, ipi_percent: 18, unit: "un" },
  { code: "0690", name: "CB-78 ROSCA 1/2x1/2", category: "coxim", hardness: "40 Sh.A", unit_price: 163.4, needs_quote: false, weight_kg: 0.488, ipi_percent: 18, unit: "un" },
  { code: "0691", name: "CB-78 ROSCA 1/2x1/2", category: "coxim", hardness: "60 Sh.A", unit_price: 163.6, needs_quote: false, weight_kg: 0.488, ipi_percent: 18, unit: "un" },
  { code: "0693", name: "CB-78-B ROSCA 1/2", category: "coxim", hardness: "40 Sh.A", unit_price: 171.4, needs_quote: false, weight_kg: 1.16, ipi_percent: 18, unit: "un" },
  { code: "0694", name: "CB-78-B ROSCA 1/2", category: "coxim", hardness: "60 Sh.A", unit_price: 171.6, needs_quote: false, weight_kg: 1.16, ipi_percent: 18, unit: "un" },
  { code: "0698", name: "CB-150-B ROSCA 1/2", category: "coxim", hardness: "60 Sh.A", unit_price: 317.6, needs_quote: false, weight_kg: 3.89, ipi_percent: 18, unit: "un" },
  { code: "0699", name: "CB-100-54-2P ROSCA M16", category: "coxim", hardness: "60 Sh.A", unit_price: 230.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0700", name: "CB-100 ROSCA 1/2x1/2", category: "coxim", hardness: "60 Sh.A", unit_price: 248.6, needs_quote: false, weight_kg: 1.024, ipi_percent: 18, unit: "un" },
  { code: "0701", name: "CB-100-B ROSCA 1/2", category: "coxim", hardness: "60 Sh.A", unit_price: 268.6, needs_quote: false, weight_kg: 1.85, ipi_percent: 18, unit: "un" },
  { code: "0703", name: "CB-100-36 ROSCA M12xM12", category: "coxim", hardness: "50 Sh.A", unit_price: 106.5, needs_quote: false, weight_kg: 0.56, ipi_percent: 18, unit: "un" },
  { code: "0704", name: "CB-100-36 ROSCA 1/2x1/2", category: "coxim", hardness: "60 Sh.A", unit_price: 106.5, needs_quote: false, weight_kg: 0.56, ipi_percent: 18, unit: "un" },

  // ===== AM TCB =====
  { code: "0400", name: "AM-100-TCB PARAF. 3/8\"X75", category: "am_tcb", hardness: "40 Sh.A", unit_price: 167.4, needs_quote: false, weight_kg: 0.85, ipi_percent: 5, unit: "un" },
  { code: "0401", name: "AM-100-TCB PARAF. 3/8\"X75", category: "am_tcb", hardness: "60 Sh.A", unit_price: 167.6, needs_quote: false, weight_kg: 0.85, ipi_percent: 5, unit: "un" },
  { code: "0420", name: "AM-500-TCB PARAF. 1/2\"X75", category: "am_tcb", hardness: "40 Sh.A", unit_price: 469.4, needs_quote: false, weight_kg: 4.1, ipi_percent: 5, unit: "un" },
  { code: "0421", name: "AM-500-TCB PARAF. 1/2\"X75", category: "am_tcb", hardness: "60 Sh.A", unit_price: 469.6, needs_quote: false, weight_kg: 4.1, ipi_percent: 5, unit: "un" },
  { code: "0422", name: "AM-500-TCB PARAF. 1/2\"X75", category: "am_tcb", hardness: "70 Sh.A", unit_price: 469.7, needs_quote: false, weight_kg: 4.1, ipi_percent: 5, unit: "un" },
  { code: "0432", name: "AM-500-TCB 5G DC 1/2\"X75", category: "am_tcb", hardness: "60 Sh.A", unit_price: 500.6, needs_quote: false, weight_kg: 4.1, ipi_percent: 5, unit: "un" },
  { code: "0441", name: "AM-1000-TCB PARAF. 3/4\"X100", category: "am_tcb", hardness: "40 Sh.A", unit_price: 656.4, needs_quote: false, weight_kg: 12.8, ipi_percent: 5, unit: "un" },
  { code: "0451", name: "AM-1000-TCB PARAF. 3/4\"X100", category: "am_tcb", hardness: "60 Sh.A", unit_price: 656.6, needs_quote: false, weight_kg: 12.8, ipi_percent: 5, unit: "un" },
  { code: "0453", name: "AM-1000-TCB PARAF. 1\" ESPECIAL", category: "am_tcb", hardness: "60 Sh.A", unit_price: 1439.6, needs_quote: false, weight_kg: 15, ipi_percent: 5, unit: "un" },

  // ===== IMB =====
  { code: "1200-01", name: "CJ. IMB-100-B PARAF. 5/16X38mm", category: "imb", hardness: "40 Sh.A", unit_price: 86.4, needs_quote: false, weight_kg: 0, ipi_percent: 5, unit: "un" },
  { code: "1202", name: "CJ. IMB-100 5/16X5/16", category: "imb", hardness: "60 Sh.A", unit_price: 86.6, needs_quote: false, weight_kg: 0, ipi_percent: 5, unit: "un" },
  { code: "1204-01", name: "CJ. IMB-400-B PARAF. 3/8X50mm", category: "imb", hardness: "40 Sh.A", unit_price: 120.4, needs_quote: false, weight_kg: 0.47, ipi_percent: 5, unit: "un" },
  { code: "1206-01", name: "CJ. IMB-400-B PARAF. 3/8X50mm", category: "imb", hardness: "60 Sh.A", unit_price: 120.6, needs_quote: false, weight_kg: 0.47, ipi_percent: 5, unit: "un" },
  { code: "1208-01", name: "CJ. IMB-700-B PARAF. 1/2X75mm", category: "imb", hardness: "40 Sh.A", unit_price: 232.4, needs_quote: false, weight_kg: 1.6, ipi_percent: 5, unit: "un" },
  { code: "1210-01", name: "CJ. IMB-700-B PARAF. 1/2X75mm", category: "imb", hardness: "60 Sh.A", unit_price: 232.6, needs_quote: false, weight_kg: 1.6, ipi_percent: 5, unit: "un" },
  { code: "1212", name: "CJ. IMB-700-B 5/8", category: "imb", hardness: "40 Sh.A", unit_price: 232.4, needs_quote: false, weight_kg: 1.6, ipi_percent: 5, unit: "un" },
  { code: "1213", name: "CJ. IMB-700-B 5/8", category: "imb", hardness: "60 Sh.A", unit_price: 232.6, needs_quote: false, weight_kg: 1.6, ipi_percent: 5, unit: "un" },

  // ===== Batente =====
  { code: "0598-B", name: "CB-125-B Max Batente", category: "batente", hardness: "60 Sh.A", unit_price: 343.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "0599-B", name: "CB-160-B Max Batente", category: "batente", hardness: "40 Sh.A", unit_price: 500.4, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "0600-B", name: "CB-200-B Max Batente", category: "batente", hardness: "60 Sh.A", unit_price: 560.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },

  // ===== AM PN =====
  { code: "AM-100-PN-40", name: "AM-100-TCB PARAF. 3/8\"X75", category: "am_pn", hardness: "40 Sh.A", unit_price: 130.4, needs_quote: false, weight_kg: 0.85, ipi_percent: 0, unit: "un" },
  { code: "AM-100-PN-60", name: "AM-100-TCB PARAF. 3/8\"X75", category: "am_pn", hardness: "60 Sh.A", unit_price: 130.6, needs_quote: false, weight_kg: 0.85, ipi_percent: 0, unit: "un" },
  { code: "AM-500-PN-40", name: "AM-500-TCB PARAF. 1/2\"X75", category: "am_pn", hardness: "40 Sh.A", unit_price: 367.4, needs_quote: false, weight_kg: 4.1, ipi_percent: 0, unit: "un" },
  { code: "AM-500-PN-60", name: "AM-500-TCB PARAF. 1/2\"X75", category: "am_pn", hardness: "60 Sh.A", unit_price: 367.6, needs_quote: false, weight_kg: 4.1, ipi_percent: 0, unit: "un" },
  { code: "AM-500-PN-70", name: "AM-500-TCB PARAF. 1/2\"X75", category: "am_pn", hardness: "70 Sh.A", unit_price: 367.7, needs_quote: false, weight_kg: 0.85, ipi_percent: 0, unit: "un" },
  { code: "0432-PN", name: "AM-500-TCB 5G DC 1/2\"X75", category: "am_pn", hardness: "60 Sh.A", unit_price: 381.6, needs_quote: false, weight_kg: 4.1, ipi_percent: 0, unit: "un" },
  { code: "0441-PN", name: "AM-1000-TCB PARAF. 3/4\"X100", category: "am_pn", hardness: "40 Sh.A", unit_price: 470.4, needs_quote: false, weight_kg: 12.8, ipi_percent: 0, unit: "un" },
  { code: "0451-PN", name: "AM-1000-TCB PARAF. 3/4\"X100", category: "am_pn", hardness: "60 Sh.A", unit_price: 470.6, needs_quote: false, weight_kg: 12.8, ipi_percent: 0, unit: "un" },
  { code: "0453-PN", name: "AM-1000-TCB PARAF. 1\"", category: "am_pn", hardness: "60 Sh.A", unit_price: 631.6, needs_quote: false, weight_kg: 12.8, ipi_percent: 0, unit: "un" },
  { code: "0460", name: "AM-500-PN PARAF. 3/8\"X75", category: "am_pn", hardness: "", unit_price: 73, needs_quote: false, weight_kg: 0.6, ipi_percent: 0, unit: "un" },
  { code: "0480", name: "AM-500-SN SEM NIVELADOR", category: "am_pn", hardness: "", unit_price: 62, needs_quote: false, weight_kg: 0.46, ipi_percent: 0, unit: "un" },
  { code: "0500", name: "AM-2000-PN PARAF. 1/2\"X75", category: "am_pn", hardness: "", unit_price: 179, needs_quote: false, weight_kg: 1.75, ipi_percent: 0, unit: "un" },
  { code: "0520", name: "AM-2000-PN PARAF. 5/8\"X75", category: "am_pn", hardness: "", unit_price: 179, needs_quote: false, weight_kg: 1.78, ipi_percent: 0, unit: "un" },
  { code: "0540", name: "AM-2000-SN SEM NIVELADOR", category: "am_pn", hardness: "", unit_price: 181, needs_quote: false, weight_kg: 1, ipi_percent: 0, unit: "un" },
  { code: "0560", name: "AM-5000-PN PARAF. 3/4\"X100", category: "am_pn", hardness: "", unit_price: 350, needs_quote: false, weight_kg: 10.6, ipi_percent: 0, unit: "un" },
  { code: "0590", name: "AM-500-PIE-PP SOB CONSULTA", category: "am_pn", hardness: "", unit_price: 270, needs_quote: false, weight_kg: 0.7, ipi_percent: 0, unit: "un" },
  { code: "0403", name: "AM-500-P PARAF. 1/2X75", category: "am_pn", hardness: "", unit_price: 61, needs_quote: false, weight_kg: 0.75, ipi_percent: 0, unit: "un" },
  { code: "0408", name: "AM-50-RR M8", category: "am_pn", hardness: "40 Sh.A", unit_price: 38, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "0408-01", name: "AM-50-RR M8", category: "am_pn", hardness: "60 Sh.A", unit_price: 38, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "0591", name: "AM-50-1P PARAF. 5/16", category: "am_pn", hardness: "40 Sh.A", unit_price: 38, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "0591-01", name: "AM-50-1P PARAF. 5/16", category: "am_pn", hardness: "60 Sh.A", unit_price: 38, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },

  // ===== AMF =====
  { code: "0901", name: "AMF-3510 PARAF. 5/16\"x50 CAB. CH.", category: "amf", hardness: "40 Sh.A", unit_price: 36.4, needs_quote: false, weight_kg: 0.073, ipi_percent: 0, unit: "un" },
  { code: "0902", name: "AMF-3510 PARAF. 5/16\"x50 CAB. CH.", category: "amf", hardness: "60 Sh.A", unit_price: 36.6, needs_quote: false, weight_kg: 0.075, ipi_percent: 0, unit: "un" },
  { code: "0903", name: "AMF-3510-C PRISION. 5/16\"X120", category: "amf", hardness: "40 Sh.A", unit_price: 49.4, needs_quote: false, weight_kg: 0.21, ipi_percent: 0, unit: "un" },
  { code: "0904", name: "AMF-3510-C PRISION. 5/16\"X120", category: "amf", hardness: "60 Sh.A", unit_price: 49.6, needs_quote: false, weight_kg: 0.21, ipi_percent: 0, unit: "un" },
  { code: "0905", name: "AMF-3510-L PRISION. 5/16\"X120", category: "amf", hardness: "40 Sh.A", unit_price: 49.4, needs_quote: false, weight_kg: 0.215, ipi_percent: 0, unit: "un" },
  { code: "0906", name: "AMF-3510-L PRISION. 5/16\"X120", category: "amf", hardness: "60 Sh.A", unit_price: 49.6, needs_quote: false, weight_kg: 0.215, ipi_percent: 0, unit: "un" },
  { code: "0907", name: "AMF-3510-U PRISION. 5/16\"X120", category: "amf", hardness: "40 Sh.A", unit_price: 49.4, needs_quote: false, weight_kg: 0.245, ipi_percent: 0, unit: "un" },
  { code: "0908", name: "AMF-3510-U PRISION. 5/16\"X120", category: "amf", hardness: "60 Sh.A", unit_price: 49.6, needs_quote: false, weight_kg: 0.245, ipi_percent: 0, unit: "un" },
  { code: "0909", name: "AMF-3510-Z PRISION. 5/16\"X120", category: "amf", hardness: "40 Sh.A", unit_price: 49.4, needs_quote: false, weight_kg: 0.195, ipi_percent: 0, unit: "un" },
  { code: "0910", name: "AMF-3510-Z PRISION. 5/16\"X120", category: "amf", hardness: "60 Sh.A", unit_price: 49.6, needs_quote: false, weight_kg: 0.195, ipi_percent: 0, unit: "un" },
  { code: "0911", name: "AMF-5015-LL PARAF. 5/16\"X50", category: "amf", hardness: "40 Sh.A", unit_price: 62.4, needs_quote: false, weight_kg: 0.595, ipi_percent: 0, unit: "un" },
  { code: "0912", name: "AMF-5015-LL PARAF. 5/16\"X50", category: "amf", hardness: "60 Sh.A", unit_price: 62.6, needs_quote: false, weight_kg: 0.595, ipi_percent: 0, unit: "un" },
  { code: "0916", name: "AMF-2510 INOX ROSCA M8", category: "amf", hardness: "60 Sh.A", unit_price: 47.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "0919", name: "AMF-5015", category: "amf", hardness: "60 Sh.A", unit_price: 49.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },

  // ===== IsoDoble =====
  { code: "ISODOBLE-25", name: "IsoDoble 25", category: "isodoble", hardness: "40 Sh.A", unit_price: 78.4, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "ISODOBLE-50", name: "IsoDoble 50", category: "isodoble", hardness: "40 Sh.A", unit_price: 96.4, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },

  // ===== Patim =====
  { code: "2197", name: "PATIM 71 ROSCA M6", category: "patim", hardness: "60 Sh.A", unit_price: 225, needs_quote: false, weight_kg: 1.5, ipi_percent: 0, unit: "un" },
  { code: "2198", name: "PATIM 80 ROSCA M8", category: "patim", hardness: "60 Sh.A", unit_price: 260, needs_quote: false, weight_kg: 1.5, ipi_percent: 0, unit: "un" },
  { code: "2199", name: "PATIM 90 S ROSCA M8", category: "patim", hardness: "60 Sh.A", unit_price: 286, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2200", name: "PATIM 90 L ROSCA M8", category: "patim", hardness: "60 Sh.A", unit_price: 286, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2201", name: "PATIM 100 L ROSCA M10", category: "patim", hardness: "60 Sh.A", unit_price: 295, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2202", name: "PATIM 112 M ROSCA M10", category: "patim", hardness: "60 Sh.A", unit_price: 339, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2203", name: "PATIM 132 S ROSCA M10", category: "patim", hardness: "60 Sh.A", unit_price: 429, needs_quote: false, weight_kg: 2.5, ipi_percent: 0, unit: "un" },
  { code: "2204", name: "PATIM 132 M ROSCA M10", category: "patim", hardness: "60 Sh.A", unit_price: 429, needs_quote: false, weight_kg: 2.5, ipi_percent: 0, unit: "un" },
  { code: "2205", name: "PATIM 160 M ROSCA M12", category: "patim", hardness: "60 Sh.A", unit_price: 521, needs_quote: false, weight_kg: 6.5, ipi_percent: 0, unit: "un" },
  { code: "2206", name: "PATIM 160 L ROSCA M12", category: "patim", hardness: "60 Sh.A", unit_price: 521, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2207", name: "PATIM 180 M ROSCA M12", category: "patim", hardness: "60 Sh.A", unit_price: 594, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2208", name: "PATIM 180 L ROSCA M12", category: "patim", hardness: "60 Sh.A", unit_price: 594, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2209", name: "PATIM 200 L ROSCA M16", category: "patim", hardness: "60 Sh.A", unit_price: 671, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "2210", name: "PATIM 225 S ROSCA M16", category: "patim", hardness: "60 Sh.A", unit_price: 759, needs_quote: false, weight_kg: 9, ipi_percent: 0, unit: "un" },
  { code: "2211", name: "PATIM 225 M ROSCA M16", category: "patim", hardness: "60 Sh.A", unit_price: 759, needs_quote: false, weight_kg: 9, ipi_percent: 0, unit: "un" },
  { code: "2212", name: "PATIM 250 M ROSCA M20", category: "patim", hardness: "60 Sh.A", unit_price: 814, needs_quote: false, weight_kg: 13, ipi_percent: 0, unit: "un" },

  // ===== K-PAD =====
  { code: "KPAD-X-500x500-0", name: "K-PAD X 500x500 s/ cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 38, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-4", name: "K-PAD X 500x500 c/ 4 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 46.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-6", name: "K-PAD X 500x500 c/ 6 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 52.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-9", name: "K-PAD X 500x500 c/ 9 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 57.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-12", name: "K-PAD X 500x500 c/ 12 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 61.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-20", name: "K-PAD X 500x500 c/ 20 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 83.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-30", name: "K-PAD X 500x500 c/ 30 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 106.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-48", name: "K-PAD X 500x500 c/ 48 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 131.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x500-60", name: "K-PAD X 500x500 c/ 60 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 149.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x250-0", name: "K-PAD X 500x250 s/ cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 33, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x250-6", name: "K-PAD X 500x250 c/ 6 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 43.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x250-12", name: "K-PAD X 500x250 c/ 12 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 53.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-X-500x250-20", name: "K-PAD X 500x250 c/ 20 cones", category: "kpad", hardness: "40/60 Sh.A", unit_price: 75.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "KPAD-RODAPE", name: "K-PAD Rodape 10000x100x10mm (rolo)", category: "kpad", hardness: "", unit_price: 186, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "rolo" },

  // ===== PAD =====
  { code: "0770", name: "PAD 260x160x20 C/60 CONES", category: "pad", hardness: "40 Sh.A", unit_price: 95.4, needs_quote: false, weight_kg: 0.614, ipi_percent: 18, unit: "un" },
  { code: "0771", name: "PAD 260x160x20 C/60 CONES", category: "pad", hardness: "60 Sh.A", unit_price: 95.6, needs_quote: false, weight_kg: 0.692, ipi_percent: 18, unit: "un" },
  { code: "0772", name: "PAD Calco 100x100x25 LISA", category: "pad", hardness: "60 Sh.A", unit_price: 51.6, needs_quote: false, weight_kg: 0.181, ipi_percent: 18, unit: "un" },
  { code: "0773", name: "PAD 260x160x13 C/60 CONES", category: "pad", hardness: "60 Sh.A", unit_price: 51.6, needs_quote: false, weight_kg: 0.3, ipi_percent: 18, unit: "un" },
  { code: "0774", name: "PAD 260x160x13 C/60 CONES", category: "pad", hardness: "40 Sh.A", unit_price: 51.4, needs_quote: false, weight_kg: 0.3, ipi_percent: 18, unit: "un" },
  { code: "0776", name: "PAD 200X100X40", category: "pad", hardness: "40 Sh.A", unit_price: 79.4, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0781", name: "PAD 260X160X13 C/60 CONES", category: "pad", hardness: "60 Sh.A", unit_price: 87.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0782", name: "PAD 260X160X40 C/60 CONES", category: "pad", hardness: "40 Sh.A", unit_price: 161.4, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0783", name: "PAD 260X160X40 C/60 CONES", category: "pad", hardness: "60 Sh.A", unit_price: 161.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0786", name: "PAD 197X197X25 C/16 CONES", category: "pad", hardness: "40 Sh.A", unit_price: 143.4, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0787", name: "PAD 197X197X25 C/16 CONES", category: "pad", hardness: "60 Sh.A", unit_price: 143.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0792", name: "PAD 100X100X50 32F", category: "pad", hardness: "50 Sh.A", unit_price: 66.5, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0800", name: "PAD 100X100X50 32F", category: "pad", hardness: "40 Sh.A", unit_price: 66.4, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "0801", name: "PAD 100X100X50 32F", category: "pad", hardness: "60 Sh.A", unit_price: 66.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "PAD-200x200x30", name: "Placa de Borracha 200x200x30mm", category: "pad", hardness: "60 Sh.A", unit_price: 114.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "PAD-100x100x30", name: "Placa de Borracha 100x100x30mm", category: "pad", hardness: "60 Sh.A", unit_price: 51.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },
  { code: "PAD-50x50x25", name: "PAD 50x50x25mm", category: "pad", hardness: "60 Sh.A", unit_price: 37.6, needs_quote: false, weight_kg: 0, ipi_percent: 18, unit: "un" },

  // ===== Castanhola =====
  { code: "3413-M", name: "Castanhola 3413 Macho", category: "castanhola", hardness: "60 Sh.A", unit_price: 47.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "3413-MF", name: "Castanhola 3413 Macho + Femea", category: "castanhola", hardness: "60 Sh.A", unit_price: 53.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "5917-M", name: "Castanhola 5917 Macho", category: "castanhola", hardness: "60 Sh.A", unit_price: 70.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
  { code: "5917-MF", name: "Castanhola 5917 Macho + Femea", category: "castanhola", hardness: "60 Sh.A", unit_price: 77.6, needs_quote: false, weight_kg: 0, ipi_percent: 0, unit: "un" },
];
