"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { LogIn } from "lucide-react";

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isSignUp) {
      const err = await signUp(email, password);
      if (err) setError(err);
      else setSuccess("Conta criada! Verifique seu email para confirmar.");
    } else {
      const err = await signIn(email, password);
      if (err) setError(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">VIBRANIHIL</h1>
          <p className="text-text-secondary text-sm mt-1">CRM de Prospecção</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">{isSignUp ? "Criar Conta" : "Entrar"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">{success}</p>}

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              <LogIn size={18} />
              {loading ? "Aguarde..." : isSignUp ? "Criar Conta" : "Entrar"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }} className="text-sm text-primary hover:underline">
              {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
