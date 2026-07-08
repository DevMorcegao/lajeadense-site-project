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

const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

function ContatoFormContent({ produtos }: { produtos: Produto[] }) {
  const searchParams = useSearchParams();
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isMessageEdited, setIsMessageEdited] = useState(false);
  
  // Estados da API de Cidades do IBGE
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [fallbackCidade, setFallbackCidade] = useState(false);

  // Estados de Validação em Tempo Real
  const [touched, setTouched] = useState<Record<string, boolean>>({
    nome: false,
    email: false,
    telefone: false,
    estado: false,
    cidade: false,
    mensagem: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Controle de Submissão e Limites
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Função de Validação do Formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validação Nome Completo
    const trimmedNome = nome.trim();
    if (!trimmedNome) {
      newErrors.nome = 'O nome completo é obrigatório.';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(trimmedNome)) {
      newErrors.nome = 'O nome deve conter apenas letras e espaços.';
    } else {
      const parts = trimmedNome.split(/\s+/);
      const prepositions = ['de', 'da', 'do', 'dos', 'das', 'e'];
      const mainParts = parts.filter(part => !prepositions.includes(part.toLowerCase()));

      if (mainParts.length < 2) {
        newErrors.nome = 'Por favor, insira seu nome e sobrenome completo.';
      } else if (mainParts.some(part => part.length < 4)) {
        newErrors.nome = 'Cada nome/sobrenome deve conter pelo menos 4 letras.';
      } else if (prepositions.includes(parts[parts.length - 1].toLowerCase())) {
        newErrors.nome = 'O nome completo não pode terminar com uma preposição.';
      }
    }

    // Validação E-mail
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(trimmedEmail)) {
      newErrors.email = 'Por favor, insira um e-mail válido (exemplo@dominio.com).';
    } else {
      const lowerEmail = trimmedEmail.toLowerCase();
      const domain = lowerEmail.split('@')[1];
      
      const commonTypos: Record<string, string> = {
        'gmails.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'gmai.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'hotmial.com': 'hotmail.com',
        'hormail.com': 'hotmail.com',
        'hotmaill.com': 'hotmail.com',
        'hotmails.com': 'hotmail.com',
        'hotamil.com': 'hotmail.com',
        'hotmail.co': 'hotmail.com',
        'outlok.com': 'outlook.com',
        'outlook.co': 'outlook.com',
        'yahoo.co': 'yahoo.com',
        'yaho.co': 'yahoo.com'
      };

      const localPart = lowerEmail.split('@')[0];
      const domainParts = domain.split('.');
      const mainDomainPart = domainParts[0];

      if (commonTypos[domain]) {
        newErrors.email = `E-mail inválido. Você quis dizer @${commonTypos[domain]}?`;
      } else if (!/[a-z]/i.test(mainDomainPart)) {
        newErrors.email = 'O domínio do e-mail não pode conter apenas números.';
      } else if (/^\d+$/.test(localPart) && localPart.length < 5) {
        newErrors.email = 'A parte antes do @ não pode conter apenas números curtos.';
      } else if (
        lowerEmail.includes('teste@') ||
        lowerEmail.endsWith('@teste.com') ||
        lowerEmail.endsWith('@test.com') ||
        lowerEmail.endsWith('@example.com') ||
        lowerEmail.endsWith('@domain.com') ||
        lowerEmail.endsWith('.test')
      ) {
        newErrors.email = 'Por favor, evite e-mails de teste ou temporários.';
      }
    }

    // Validação Telefone
    const rawTel = telefone.replace(/\D/g, '');
    if (!telefone.trim()) {
      newErrors.telefone = 'O telefone é obrigatório.';
    } else if (rawTel.length < 10) {
      newErrors.telefone = 'Por favor, insira um telefone válido com DDD (mínimo 10 dígitos).';
    }

    // Validação Estado
    if (!estado) {
      newErrors.estado = 'O estado é obrigatório.';
    }

    // Validação Cidade
    if (!cidade.trim()) {
      newErrors.cidade = 'A cidade é obrigatória.';
    }

    // Validação Mensagem
    const trimmedMsg = mensagem.trim();
    if (!trimmedMsg) {
      newErrors.mensagem = 'A mensagem é obrigatória.';
    } else if (trimmedMsg.length < 10) {
      newErrors.mensagem = 'A mensagem deve conter pelo menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Efeito de Validação em Tempo Real
  useEffect(() => {
    validateForm();
  }, [nome, email, telefone, estado, cidade, mensagem]);

  // Efeito para Buscar Cidades do IBGE dinamicamente baseando-se no Estado
  useEffect(() => {
    if (!estado) {
      setCidades([]);
      setCidade('');
      return;
    }

    const fetchCidades = async () => {
      setLoadingCidades(true);
      setFallbackCidade(false);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`);
        if (!response.ok) throw new Error('Erro na requisição');
        
        const data = await response.json();
        const listaCidades = data.map((item: any) => item.nome);
        setCidades(listaCidades);
      } catch (err) {
        console.error('Falha ao buscar cidades do IBGE:', err);
        setFallbackCidade(true);
      } finally {
        setLoadingCidades(false);
      }
    };

    fetchCidades();
  }, [estado]);

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
    setTouched(prev => ({ ...prev, telefone: true }));
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
    
    setNome('');
    setEmail('');
    setTelefone('');
    setEstado('');
    setCidade('');
    setMensagem('');
    setIsMessageEdited(false);
    setTouched({
      nome: false,
      email: false,
      telefone: false,
      estado: false,
      cidade: false,
      mensagem: false
    });
    setErrors({});
  };

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited) return;
    if (submitStatus === 'loading') return;

    // Marca todos os campos como tocados para disparar as validações na tela
    setTouched({
      nome: true,
      email: true,
      telefone: true,
      estado: true,
      cidade: true,
      mensagem: true
    });

    const isValid = validateForm();
    if (!isValid) {
      setSubmitStatus('error');
      setErrorMessage('Por favor, preencha todos os campos obrigatórios corretamente.');
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
          cidade,
          estado,
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
        
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const activeSubmissions = submissions.filter(t => t > oneDayAgo);
        if (activeSubmissions.length >= 2) {
          setIsRateLimited(true);
        }
      } catch (e) {
        console.error('LocalStorage não acessível ao registrar submissão:', e);
      }

      setSubmitStatus('success');
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
                Preencha as informações abaixo para receber uma proposta técnica e comercial personalizada.
              </p>
            </div>

            {/* Error Banner */}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs md:text-sm flex items-start gap-3 w-full"
              >
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="font-body leading-relaxed text-left w-full">
                  {isRateLimited ? (
                    <div className="flex flex-col gap-2">
                      <p>
                        Limite de envios diário excedido. Por motivos de segurança contra spam, você pode enviar no máximo 2 formulários por dia.
                      </p>
                      <p className="text-white font-medium">
                        Caso precise de suporte urgente, por favor fale conosco pelo Telefone{' '}
                        <a href="tel:+555137144799" className="font-bold text-[#C8102E] hover:text-white transition-colors whitespace-nowrap">
                          (51) 3714-4799
                        </a>{' '}
                        ou WhatsApp{' '}
                        <a
                          href="https://wa.me/555194086098"
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#C8102E] hover:text-white transition-colors whitespace-nowrap"
                        >
                          (51) 9408-6098
                        </a>.
                      </p>
                    </div>
                  ) : (
                    <p>{errorMessage}</p>
                  )}
                </div>
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
                onChange={(e) => {
                  setNome(e.target.value);
                  setTouched(prev => ({ ...prev, nome: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, nome: true }))}
                disabled={isRateLimited}
                placeholder="Ex: Carlos Silva"
                className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-body ${
                  touched.nome && errors.nome ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                }`}
              />
              {touched.nome && errors.nome && (
                <span className="text-rose-500 text-xs font-body animate-pulse">{errors.nome}</span>
              )}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTouched(prev => ({ ...prev, email: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  disabled={isRateLimited}
                  placeholder="exemplo@email.com"
                  className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-body ${
                    touched.email && errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                  }`}
                />
                {touched.email && errors.email && (
                  <span className="text-rose-500 text-xs font-body animate-pulse">{errors.email}</span>
                )}
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
                  onBlur={() => setTouched(prev => ({ ...prev, telefone: true }))}
                  disabled={isRateLimited}
                  placeholder="(51) 99999-9999"
                  className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-body ${
                    touched.telefone && errors.telefone ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                  }`}
                />
                {touched.telefone && errors.telefone && (
                  <span className="text-rose-500 text-xs font-body animate-pulse">{errors.telefone}</span>
                )}
              </div>
            </div>

            {/* Estado e Cidade em Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="estado" className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider">
                  Estado <span className="text-[#C8102E]">*</span>
                </label>
                <select
                  id="estado"
                  value={estado}
                  onChange={(e) => {
                    setEstado(e.target.value);
                    setTouched(prev => ({ ...prev, estado: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, estado: true }))}
                  disabled={isRateLimited}
                  className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-body cursor-pointer appearance-none ${
                    touched.estado && errors.estado ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="" className="bg-[#111]">Selecione o estado</option>
                  {ESTADOS_BRASIL.map((est) => (
                    <option key={est.sigla} value={est.sigla} className="bg-[#111]">
                      {est.nome} ({est.sigla})
                    </option>
                  ))}
                </select>
                {touched.estado && errors.estado && (
                  <span className="text-rose-500 text-xs font-body animate-pulse">{errors.estado}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="cidade" className="font-display font-medium text-xs text-neutral-400 uppercase tracking-wider">
                  Cidade <span className="text-[#C8102E]">*</span>
                </label>
                {loadingCidades ? (
                  <div className="w-full bg-[#161616]/60 border border-[#262626] rounded-xl px-4 py-3 text-sm text-neutral-400 font-body flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
                    <span>Buscando cidades...</span>
                  </div>
                ) : fallbackCidade ? (
                  <input
                    type="text"
                    id="cidade"
                    value={cidade}
                    onChange={(e) => {
                      setCidade(e.target.value);
                      setTouched(prev => ({ ...prev, cidade: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, cidade: true }))}
                    disabled={isRateLimited}
                    placeholder="Digite sua cidade"
                    className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-body ${
                      touched.cidade && errors.cidade ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                    }`}
                  />
                ) : (
                  <select
                    id="cidade"
                    value={cidade}
                    onChange={(e) => {
                      setCidade(e.target.value);
                      setTouched(prev => ({ ...prev, cidade: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, cidade: true }))}
                    disabled={isRateLimited || !estado}
                    className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-body cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed appearance-none ${
                      touched.cidade && errors.cidade ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      backgroundSize: '16px'
                    }}
                  >
                    <option value="" className="bg-[#111]">
                      {!estado ? 'Selecione o estado primeiro' : 'Selecione a cidade'}
                    </option>
                    {cidades.map((c) => (
                      <option key={c} value={c} className="bg-[#111]">
                        {c}
                      </option>
                    ))}
                  </select>
                )}
                {touched.cidade && errors.cidade && (
                  <span className="text-rose-500 text-xs font-body animate-pulse">{errors.cidade}</span>
                )}
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
                  setTouched(prev => ({ ...prev, mensagem: true }));
                }}
                onBlur={() => setTouched(prev => ({ ...prev, mensagem: true }))}
                disabled={isRateLimited}
                rows={5}
                placeholder="Descreva seu projeto, dimensões aproximadas ou dúvidas..."
                className={`w-full bg-[#161616]/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors font-body resize-none leading-relaxed ${
                  touched.mensagem && errors.mensagem ? 'border-rose-500 focus:border-rose-500' : 'border-[#262626] focus:border-[#C8102E]'
                }`}
              />
              {touched.mensagem && errors.mensagem && (
                <span className="text-rose-500 text-xs font-body animate-pulse">{errors.mensagem}</span>
              )}
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
