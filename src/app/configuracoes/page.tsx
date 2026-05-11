"use client";

import { useState } from "react";
import { Settings, Percent, Target, AlertTriangle } from "lucide-react";
import { COMMISSION_RULES, DISCOUNT_RULES } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export default function ConfiguracoesPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  function clearAllData() {
    localStorage.clear();
    setShowClearConfirm(false);
    window.location.reload();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-text-secondary text-sm mt-1">Regras de comissao, descontos e dados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Percent size={20} className="text-primary" />
            <h2 className="font-semibold">Regras de Comissao</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span>Pedido ate R$ 50.000</span>
              <span className="font-medium">{(COMMISSION_RULES.below50k * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span>Pedido unico acima de R$ 50.000</span>
              <span className="font-medium">{(COMMISSION_RULES.above50k * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span>Bonus acima da meta mensal</span>
              <span className="font-medium">+{(COMMISSION_RULES.aboveMonthlyGoal * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-primary" />
            <h2 className="font-semibold">Metas e Descontos</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span>Meta Mensal (Mai-Set)</span>
              <span className="font-medium">{formatCurrency(COMMISSION_RULES.monthlyGoal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span>Desconto a vista</span>
              <span className="font-medium">{(DISCOUNT_RULES.cashPayment * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Desconto pedido acima de R$ 100.000</span>
              <span className="font-medium">{(DISCOUNT_RULES.above100k * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="font-semibold">Dados</h2>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Os dados sao armazenados localmente no navegador. Para uma versao com banco de dados
            compartilhado (Supabase), entre em contato.
          </p>
          {!showClearConfirm ? (
            <button className="btn-danger" onClick={() => setShowClearConfirm(true)}>Limpar Todos os Dados</button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-600 font-medium">Tem certeza? Essa acao nao pode ser desfeita.</span>
              <button className="btn-danger" onClick={clearAllData}>Sim, limpar tudo</button>
              <button className="btn-secondary" onClick={() => setShowClearConfirm(false)}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
