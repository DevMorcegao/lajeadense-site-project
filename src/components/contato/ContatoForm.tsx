"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface Produto {
  _id: string;
  nome: string;
  slug: string;
}

function ContatoFormContent({ produtos }: { produtos: Produto[] }) {
  const searchParams = useSearchParams();
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [assuntos, setAssuntos] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [isMessageEdited, setIsMessageEdited] = useState(false);
  
  // Controle de Submissão e Limites
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Inicializa a partir do Query Param de produto e verifica Rate Limit
  useEffect(() => {
    // 1. Verificar Rate Limit no LocalStorage (Limite de 2 envios por dia)
    const checkRateLimit = () => {
      try {
        const rawSubmissions = localStorage.getItem('lajeadense_submissions');
        if (rawSubmissions) {
          const submissions: number[] = JSON.parse(rawSubmissions);
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          
          // Filtra envios que ocorreram há menos de 24 horas
          const activeSubmissions = submissions.filter(t => t > oneDayAgo);
          
          // Atualiza o local storage apenas com os ativos
          localStorage.setItem('lajeadense_submissions', JSON.stringify(activeSubmissions));
          
          if (activeSubmissions.length >= 2) {
            setIsRateLimited(true);
            setSubmitStatus('error');
            setErrorMessage('Limite de envios diário excedido. Por motivos de segurança contra spam, você pode enviar no máximo 2 formulários por dia. Caso precise de suporte urgente, por favor nos contate pelo telefone ou WhatsApp.');
          }
        }
      } catch (e) {
        console.error('Erro ao acessar LocalStorage:', e);
      }
    };
    
    checkRateLimit();

    // 2. Pré-selecionar produto se vier query param
    const produtoSlug = searchParams.get('produto');
    if (produtoSlug) {
      const prod = produtos.find(p => p.slug === produtoSlug);
      if (prod) {
        setAssuntos([prod.nome]);
        setMensagem(`Olá! Gostaria de solicitar um orçamento para o produto ${prod.nome}. Aguardo retorno.`);
      }
    }
  }, [searchParams, produtos]);

  // Formata o Telefone de forma inteligente: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove caracteres não-numéricos
    if (value.length > 11) value = value.slice(0, 11);
    
    // Aplica a máscara
    if (value.length > 10) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setTelefone(value);
  };

  // Reseta o formulário e verifica se bateu o rate-limit
  const handleResetForm = () => {
    try {
      const rawSubmissions = localStorage.getItem('lajeadense_submissions') || '[]';
      const submissions: number[] = JSON.parse(rawSubmissions);
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const activeSubmissions = submissions.filter(t => t > oneDayAgo);
      
      if (activeSubmissions.length >= 2) {
        setIsRateLimited(true);
        setSubmitStatus('error');
        setErrorMessage('Limite de envios diário excedido. Por motivos de segurança contra spam, você pode enviar no máximo 2 formulários por dia. Caso precise de suporte urgente, por favor nos contate pelo telefone ou WhatsApp.');
      } else {
        setSubmitStatus('idle');
      }
    } catch (e) {
      setSubmitStatus('idle');
    }
  };

  // Atualiza a mensagem dinamicamente conforme os assuntos mudam (se o usuário não tiver digitado nada customizado)
  const updateDynamicMessage = (novosAssuntos: string[]) => {
    if (isMessageEdited) return;
    
    if (novosAssuntos.length === 0) {
      setMensagem('');
    } else if (novosAssuntos.length === 1) {
      if (novosAssuntos[0] === 'Outros') {
        setMensagem('');
      } else {
        setMensagem(`Olá! Gostaria de solicitar um orçamento para o produto ${novosAssuntos[0]}. Aguardo retorno.`);
      }
    } else {
      const produtosFiltrados = novosAssuntos.filter(a => a !== 'Outros');
      if (produtosFiltrados.length === 0) {
        setMensagem('');
      } else {
        const lista = produtosFiltrados.map(p => ` - ${p}`).join('\n');
        setMensagem(`Olá! Gostaria de solicitar um orçamento para os seguintes produtos:\n${lista}\n\nAguardo retorno.`);
      }
    }
  };

  // Gerencia cliques nos botões/pills de seleção múltipla de Assuntos
  const toggleAssunto = (nomeAssunto: string) => {
    let novosAssuntos: string[];
    if (assuntos.includes(nomeAssunto)) {
      novosAssuntos = assuntos.filter(a => a !== nomeAssunto);
    } else {
      novosAssuntos = [...assuntos, nomeAssunto];
    }
    setAssuntos(novosAssuntos);
    updateDynamicMessage(novosAssuntos);
  };

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;
    if (submitStatus === 'loading') return;

    if (!nome.trim() || !email.trim() || !telefone.trim() || !mensagem.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, preencha todos os campos obrigatórios (Nome, E-mail, Telefone e Mensagem).');
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          assuntos,
          mensagem
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro desconhecido ao enviar e-mail.');
      }

      // Adicionar nova submissão ao LocalStorage para controle do limite
      try {
        const rawSubmissions = localStorage.getItem('lajeadense_submissions') || '[]';
        const submissions: number[] = JSON.parse(rawSubmissions);
        submissions.push(Date.now());
        localStorage.setItem('lajeadense_submissions', JSON.stringify(submissions));
        
        // Verifica se a partir desse envio já bateu o limite
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const activeSubmissions = submissions.filter(t => t > oneDayAgo);
        if (activeSubmissions.length >= 2) {
          setIsRateLimited(true);
        }
      } catch (e) {
        console.error('LocalStorage não acessível ao registrar submissão:', e);
      }

      setSubmitStatus('success');
      // Limpa os campos após sucesso
      setNome('');
      setEmail('');
      setTelefone('');
      setAssuntos([]);
      setMensagem('');
      setIsMessageEdited(false);
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Houve uma falha ao enviar sua mensagem. Por favor, tente novamente ou fale conosco por WhatsApp/Telefone.');
    }
  };

  return (
    <div className="relative bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-3xl p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <AnimatePresence mode="wait">
        {submitStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
              <CheckCircle size={36} strokeWidth={1.5} />
            </div>
            <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white mb-4">
              Mensagem Enviada!
            </h3>
            <p className="font-body text-neutral-400 text-sm leading-relaxed max-w-sm mb-8">
              Agradecemos seu contato. Seu orçamento foi direcionado para nossa equipe técnica e retornaremos o mais breve possível no seu e-mail ou telefone.
            </p>
            <button
              onClick={handleResetForm}
              className="px-6 py-2.5 text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                backgroundColor: '#C8102E',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(200,16,46,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A50D25';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C8102E';
              }}
            >
              Enviar Outra Mensagem
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Cabeçalho do Formulário */}
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-2">
                Solicitar Orçamento
              </h2>
              <p className="font-body text-neutral-400 text-xs md:text-sm">
                Selecione os produtos de interesse e preencha as informações para receber uma proposta personalizada.
              </p>
            </div>

            {/* Error Banner */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs md:text-sm flex items-start gap-3"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p className="font-body leading-relaxed">{errorMessage}</p>
              </motion.div>
            )}

            {/* Nome Completo */}
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider">
                Nome Completo <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={isRateLimited}
                placeholder="Seu nome"
                className="w-full bg-[#161616]/60 border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C8102E] transition-colors font-body"
                required
              />
            </div>

            {/* E-mail e Telefone em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider">
                  E-mail de Contato <span className="text-[#C8102E]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isRateLimited}
                  placeholder="exemplo@email.com"
                  className="w-full bg-[#161616]/60 border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C8102E] transition-colors font-body"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="telefone" className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider">
                  Telefone / WhatsApp <span className="text-[#C8102E]">*</span>
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  disabled={isRateLimited}
                  placeholder="(51) 99999-9999"
                  className="w-full bg-[#161616]/60 border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C8102E] transition-colors font-body"
                  required
                />
              </div>
            </div>

            {/* Assunto / Produtos (Pills de Múltipla Escolha) */}
            <div className="flex flex-col gap-3">
              <span className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                Produtos de Interesse <span className="text-neutral-600 font-normal lowercase">(seleção múltipla)</span>
              </span>
              
              <div className="flex flex-wrap gap-2.5">
                {produtos.map((p) => {
                  const isSelected = assuntos.includes(p.nome);
                  return (
                    <button
                      key={p._id}
                      type="button"
                      disabled={isRateLimited}
                      onClick={() => toggleAssunto(p.nome)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold font-body transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#C8102E] border-[#C8102E] text-white shadow-[0_2px_10px_rgba(200,16,46,0.3)]'
                          : 'bg-[#161616]/50 border-[#262626] text-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      {p.nome}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={isRateLimited}
                  onClick={() => toggleAssunto('Outros')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold font-body transition-all duration-200 border cursor-pointer ${
                    assuntos.includes('Outros')
                      ? 'bg-[#C8102E] border-[#C8102E] text-white shadow-[0_2px_10px_rgba(200,16,46,0.3)]'
                      : 'bg-[#161616]/50 border-[#262626] text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  Outros Assuntos
                </button>
              </div>
            </div>

            {/* Mensagem */}
            <div className="flex flex-col gap-2">
              <label htmlFor="mensagem" className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider">
                Detalhes da Mensagem <span className="text-[#C8102E]">*</span>
              </label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => {
                  setMensagem(e.target.value);
                  setIsMessageEdited(true);
                }}
                disabled={isRateLimited}
                rows={5}
                placeholder="Descreva seu projeto, dimensões aproximadas ou dúvidas..."
                className="w-full bg-[#161616]/60 border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#C8102E] transition-colors font-body resize-none leading-relaxed"
                required
              />
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isRateLimited || submitStatus === 'loading'}
              className="w-full text-white font-semibold py-3.5 px-6 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm mt-4"
              style={{
                fontFamily: 'var(--font-body)',
                backgroundColor: '#C8102E',
                borderRadius: '8px',
                boxShadow: '0 2px 12px rgba(200,16,46,0.35)',
              }}
              onMouseEnter={(e) => {
                if (!isRateLimited && submitStatus !== 'loading') {
                  e.currentTarget.style.backgroundColor = '#A50D25';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRateLimited && submitStatus !== 'loading') {
                  e.currentTarget.style.backgroundColor = '#C8102E';
                }
              }}
            >
              {submitStatus === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processando solicitação...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Solicitar Orçamento</span>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContatoForm({ produtos }: { produtos: Produto[] }) {
  return (
    <Suspense fallback={
      <div className="bg-[#111111]/80 border border-[#222222] rounded-3xl p-6 md:p-10 min-h-[500px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C8102E]/30 border-t-[#C8102E] rounded-full animate-spin" />
      </div>
    }>
      <ContatoFormContent produtos={produtos} />
    </Suspense>
  );
}
