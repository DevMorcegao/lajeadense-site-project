# IDENTIDADE VISUAL — Lajeadense Vidros

## Stack Técnica
- Tailwind CSS para toda estilização (NUNCA criar arquivos .css separados)
- shadcn/ui como base de componentes, customizados via className
- Todos os valores visuais definidos como TOKENS SEMÂNTICOS no tailwind.config
- NUNCA usar valores hardcoded no código — sempre tokens semânticos
- NUNCA usar cores/radius/sombras padrão do Tailwind — apenas tokens deste documento
- A IA que implementa é RESPONSÁVEL por criar SVGs originais e composições visuais únicas baseadas nas descrições abaixo — NÃO use decoração genérica (blobs, dot grids, partículas) como substituto
- A paleta usa UMA cor accent forte (vermelho crimson) + base neutra off-white quente. NÃO crie arco-íris de categorias.

## Setup Necessário

### Libs adicionais
| Lib | Pra quê | Instalação |
|---|---|---|
| `framer-motion` | Transições de entrada de seções e micro-interações de hover em cards | `npm i framer-motion` |

### Fontes (Google Fonts)
| Família | Papel | Import |
|---|---|---|
| `Barlow Condensed` | Display, títulos, headlines hero | `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap')` |
| `DM Sans` | Corpo, UI, botões, labels, inputs | `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap')` |

### Assets externos
| Asset | Pra quê | Como gerar |
|---|---|---|
| Fotos de projetos (fachadas, interiores com vidro) | Hero, cards de portfólio, página de produto | Acervo próprio da empresa ou Unsplash → buscar "glass facade architecture", "frameless glass building" → salvar em `/public/images/projects/` |
| Logo SVG vetorial | Header, footer, favicon | Exportar da identidade da marca em SVG otimizado |

---

## A Alma do App

Lajeadense Vidros não vende vidro — vende a sensação de que as paredes desaparecem. Cada superfície reflete precisão técnica e ambição arquitetônica. A interface deve sentir como o próprio material: clara, estruturada, com profundidade invisível — e quando a luz incide certo, revela algo extraordinário.

---

## Referências e Princípios

**Cinex (concorrente analisado):**
- *Estrutura:* Hero fullscreen com fotografia de obra em tela cheia, navegação global via hamburguer overlay em fundo preto absoluto, breadcrumb técnico no topo das subpáginas. Layout de produto: coluna esquerda com specs técnicas detalhadas + imagem dominante à direita (proporção 40/60).
- *Linguagem:* Tipografia condensada em caixa alta para títulos de seção (categoria, nome da linha), corpo em fonte sem-serifa leve. Cor accent laranja apenas em labels de categoria e botão de orçamento (outline vermelho). Base quase inteiramente preto e branco — o laranja aparece cirurgicamente.
- *Riqueza visual:* A riqueza NÃO vem de ilustrações — vem das fotografias de obras. Cards de produto são a foto da obra em si, sem ornamento. A textura ambiente é zero: fundo branco ou preto puros. O impacto é todo da imagem.
- **Princípio extraído:** Fotografia de qualidade é o conceito visual central do setor. A interface é um frame que valoriza a imagem da obra — quanto mais limpa a moldura, mais poderosa a foto. Não competir com a imagem — servi-la.

**Aplicação para Lajeadense:**
- Herdar a sobriedade e o respeito pela imagem fotográfica.
- DIFERENCIAR: base light (off-white quente) ao invés de preto. Mais acolhedora para construtoras, arquitetos e cliente final. Cinex é escuro e europeu; Lajeadense é sólida e brasileira — quente, técnica, confiável.
- DIFERENCIAR: adicionar conceitos visuais técnicos dentro dos cards de especificação (perfis de corte transversal, diagrama de camadas de vidro) — algo que Cinex não tem e que reforça autoridade técnica.
- Manter o vermelho crimson da logo como único acento cromático. Nunca gradiente, nunca segundo acento.

---

## Decisões de Identidade

### ESTRUTURA

#### Navegação
**O que:** Header fixo com logo à esquerda e links de navegação sem hamburguer no desktop. CTA "Solicitar Orçamento" como botão primário vermelho à direita. No mobile: hamburguer que abre overlay fullscreen em `surface-page` (não em preto como a Cinex — a Lajeadense é light mode).

**Por que:** A Cinex usa navegação preta e agressiva, coerente com seu posicionamento premium europeu. Para a Lajeadense, o overlay claro mantém o calor da marca e diferencia no mercado local.

**Como:** Header com `bg-surface-card` e `shadow-sm` ao rolar. Links: `text-sm font-medium text-secondary`. Ativo: `text-primary font-semibold` com sublinhado 2px `action-primary`. CTA: `bg-action-primary text-on-brand radius-md px-6 py-2 shadow-button-primary`.

**Nunca:** Hamburguer em header desktop. Múltiplos CTAs no header. Cor de fundo no header fora de `surface-card`.

---

#### Layout de Hero
**O que:** Hero em tela cheia com fotografia de obra ocupando 100vw × 100vh. Overlay gradiente sutil (preto, de baixo para cima, apenas na faixa inferior onde fica o texto — não cobrindo a imagem inteira). Título em Barlow Condensed bold em branco sobre a imagem. Dois botões: primary (vermelho) e secondary (outline branco). Seta de scroll no canto inferior esquerdo.

**Por que:** Replica a estratégia da Cinex de deixar a obra falar primeiro. A imagem é o produto. A interface não compete.

**Como:** `relative w-full h-screen overflow-hidden`. Foto como `object-cover object-center`. Overlay: `absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent`. Conteúdo alinhado ao `bottom-20 left-16` no desktop, `bottom-12 left-4` mobile.

**Nunca:** Overlay escuro cobrindo a imagem inteira (mata a foto). Texto centralizado no meio da imagem (genérico). Background color sólido no hero.

---

#### Layout de Produto (página de linha/produto específico)
**O que:** Split layout 40/60 — coluna esquerda estreita com nome da linha, descrição técnica, lista de especificações e dois CTAs (Acessar Revit + Solicitar Orçamento). Coluna direita dominante com a fotografia da obra. No mobile: coluna de texto primeiro, foto abaixo em largura cheia.

**Por que:** Claramente o padrão mais eficaz do setor (como a Cinex usa). A assimetria cria hierarquia: a obra valida o produto. O texto é técnico e credível, a foto é emocional e vendedora.

**Como:** Grid `grid-cols-[2fr_3fr]` no desktop. Esquerda: `pr-12 py-16`. Direita: foto com `h-full object-cover` sem padding — sangra até a borda. Specs listadas com ícone técnico pequeno (16px, cor `text-muted`) + texto `text-sm text-secondary`.

**Nunca:** Layout simétrico 50/50. Foto com padding ao redor (perde impacto). Specs em tabela formal (parece planilha, não catálogo premium).

---

#### Grid de Portfólio / Produtos
**O que:** Grid assimétrico de fotos em masonry (2-3 colunas no desktop, 1 coluna no mobile). Cards sem borda, sem sombra — a imagem ocupa o card inteiro. Ao hover: overlay sutil escuro com título do projeto e uma tag de categoria em vermelho aparecem com fade. Sem radius nos cards de imagem — quinas retas para sensação arquitetônica.

**Por que:** Radius arredondado em fotos de obra parece app de delivery. Quinas retas = editorial, arquitetura, técnica. O hover com overlay e tag vermelha usa o acento crimson com propósito narrativo: categorizar o projeto.

**Como:** `overflow-hidden` nos cards. Hover: `group-hover:opacity-100 transition-opacity duration-300`. Tag: `bg-action-primary text-on-brand text-xs font-medium px-3 py-1 radius-sm`. Título do projeto: `text-white text-xl font-bold` (Barlow Condensed).

**Nunca:** Cards com radius-xl em fotos de obra. Sombra em cards de imagem. Texto visível sem hover (entulha o grid).

---

#### Seções de Conteúdo
**O que:** Alternância entre `surface-page` (off-white quente) e `surface-section` (ligeiramente mais escura) para criar ritmo visual entre seções. Seções "escuras" especiais (CTA final, "Quem Somos") usam `action-strong` (preto profundo) como fundo com texto em branco — como a Cinex, mas pontualmente, não o tempo todo.

**Por que:** O light mode da Lajeadense não deve parecer uma página corporativa comum. A alternância de superfície + momentos de fundo escuro criam profundidade e ritmo sem abandonar o caráter quente da marca.

**Como:** Seções regulares: `bg-surface-page` ou `bg-surface-section`. Seções âncora (CTA, hero de subpágina): `bg-action-strong`. Label de seção: linha vermelha 2px + texto `text-xs font-semibold tracking-widest text-action-primary uppercase` (exatamente como a Cinex usa o laranja nos labels de categoria — Lajeadense usa vermelho).

**Nunca:** Fundo escuro em mais de 2-3 seções por página (perde o impacto do contraste). Fundo colorido que não seja os tokens definidos.

---

#### Breadcrumb
**O que:** Breadcrumb fixo abaixo do header em todas as subpáginas, com uma linha separadora sutil abaixo. Texto em `text-xs text-muted`, separador `/`, página atual em `text-xs text-primary font-medium`.

**Por que:** A Cinex usa isso e funciona bem para navegação em catálogos de produto com múltiplos níveis (Produtos > CinexArch > Esquadrias > Linha Sottile). A Lajeadense vai ter estrutura similar.

**Como:** `border-b border-subtle pb-3 pt-3 px-6 md:px-16`. Texto: `font-body text-xs`. Separador: `mx-2 text-muted`.

---

### LINGUAGEM

#### Tipografia
**O que:** Dois eixos claros: Barlow Condensed (display, técnico, autoridade) + DM Sans (corpo, UI, clareza). Barlow Condensed em CAIXA ALTA para títulos de seção e headlines — como a Cinex usa sua condensada. DM Sans em case normal para corpo.

**Por que:** Barlow Condensed tem DNA industrial e técnico que conecta ao setor de construção civil sem ser genérica. O condensed economiza espaço horizontal nos títulos de produto longos (ex: "VIDRO LAMINADO TERMOACÚSTICO"). DM Sans é a antítese da Inter — mais humanista, mais calorosa.

**Como:** `font-display: 'Barlow Condensed'` em todos os `h1, h2` e labels de seção. `font-body: 'DM Sans'` em tudo mais. Tracking extra em caixa alta: `tracking-wide` (0.05em) em labels de categoria. `tracking-normal` em títulos display grandes.

**Nunca:** Inter, Roboto, ou qualquer fonte "default". Barlow Condensed em corpo de texto (baixa legibilidade em pequenos). Mistura de mais de 2 famílias.

---

#### Cor como Sistema
**O que:** Base off-white quente `#F5F4F2` + vermelho crimson `#C8102E` como único acento vibrante. Todo o restante é escala de neutros quentes (não cinzas frios). Momentos escuros usam `#0D0D0D` (preto profundo, não preto puro).

**Por que:** O vermelho da logo da Lajeadense é forte e reconhecível. Usado cirurgicamente (botões, labels de categoria, ícone de CTA, linha decorativa de seção), ele cria identidade imediata. Neutros quentes — ao invés de cinzas frios — conectam ao material vidro/alumínio polido visto à luz natural.

**Como:** Ver Tokens de Design abaixo. Regra prática: se o elemento precisa chamar atenção → vermelho. Se precisa comunicar mas não chamar atenção → escala de neutros. Nunca azul, nunca verde, nunca amarelo como acento.

**Nunca:** Gradiente vermelho-para-X em qualquer elemento. Dois acentos cromáticos diferentes na mesma página. Cinzas frios (`gray-100`, `slate-200` do Tailwind) — sempre usar os tokens de neutros quentes.

---

#### Geometria e Bordas
**O que:** Sistema de radius deliberadamente austero. Cards de imagem: `radius-none` (quinas retas — linguagem arquitetônica). Botões: `radius-md` (8px — funcional, não "app fofo"). Inputs e badges: `radius-sm` (6px). Único elemento com radius maior: modais e painéis destacados (`radius-xl`).

**Por que:** O setor de construção civil e arquitetura premium evita formas arredondadas em excesso. Quinas retas em imagens de obra é um marcador de seriedade técnica. O radius seletivo (maior em modais, menor em inputs) cria hierarquia de "leveza" nos elementos.

**Como:** Ver tokens de geometria. Aplicar `radius-none` explicitamente em todos os `<img>` dentro de cards de portfólio/produto. `overflow-hidden` obrigatório nesses containers.

**Nunca:** `rounded-2xl` em imagens de produto. `rounded-full` em qualquer elemento que não seja avatar ou toggle pill.

---

#### Profundidade e Sombras
**O que:** Sombras muito sutis — quase imperceptíveis. A profundidade vem do contraste entre `surface-page` e `surface-card`, não de sombras pesadas. Único uso de sombra com "presença": botão primário vermelho com glow sutil `rgba(200,16,46,0.35)`.

**Por que:** O setor premium de arquitetura foge de sombras carregadas (parecem sites de e-commerce popular). Profundidade elegante = diferença sutil de superfície + linha de borda `1px` quase invisível.

**Como:** `shadow-card` para cards. `shadow-button-primary` apenas no botão vermelho. Hover de card: `shadow-card-hover` + `translateY(-2px)` — movimento imperceptível mas sensível ao toque.

**Nunca:** `shadow-lg` em cards de conteúdo. Glow colorido em qualquer elemento que não seja o botão primário. Box-shadow com cor saturada.

---

#### Iconografia
**O que:** Ícones de linha fina (1.5px stroke) do conjunto Lucide, tamanho 16-20px. Usados apenas onde há função clara — não decorativos. Nos cards de especificação técnica, ícones temáticos pequenos (ícone de régua para dimensão, ícone de peso, ícone de temperatura para desempenho térmico).

**Por que:** Ícones de linha fina combinam com a leveza técnica da tipografia DM Sans. Nada de ícones filled que parecem app mobile de consumo.

**Como:** `<Icon size={16} strokeWidth={1.5} className="text-muted">`. Em ações: `<Icon size={18} strokeWidth={1.5} className="text-action-primary">`. Nunca centralizar ícones grandes no centro de cards como elemento decorativo principal — isso é decoração genérica.

---

### RIQUEZA VISUAL

#### Textura Ambiente
**O que:** Pattern sutil de grid isométrico técnico (como planta baixa simplificada, linhas finas se cruzando em ângulo de 30°) aplicado como fundo na seção de diferenciais/numbers e na página "Quem Somos". Monocromático: linhas na cor `#0D0D0D` com opacidade 3%.

**Temática:** O grid isométrico é a linguagem visual das plantas arquitetônicas e dos projetos de engenharia. Para uma empresa de vidros que trabalha com construção civil, esse pattern conecta ao universo técnico dos seus clientes (arquitetos, construtoras) sem ser literal ou kitsch.

**Tratamento:** SVG inline como background-image no elemento `section`. Posição: fixo (não rola com o conteúdo). O pattern é um tile de ~60px, repetido. Visível apenas ao fundo da seção de números/diferenciais (onde o fundo é `surface-section`). NUNCA sobre fotos ou seções escuras. NUNCA com cor — apenas neutro escuro em opacidade 3%.

---

#### Conceitos Visuais por Componente

##### Card de Especificação Técnica (dentro da página de produto)
**Representa:** Autoridade técnica. A Lajeadense não apenas vende vidro — domina os parâmetros de desempenho. Este componente significa: "sabemos exatamente o que estamos entregando."

**Metáfora visual:** Corte transversal de perfil. Como um engenheiro ou arquiteto veria o produto em detalhe técnico — uma seção de corte mostrando as camadas.

**Cena detalhada:** No lado esquerdo da área de especificações, um diagrama SVG em linha fina mostrando o corte transversal esquemático de uma esquadria de vidro laminado: duas camadas de vidro retangulares (retângulos estreitos, ~6px de largura, separados por uma camada intermediária de ~3px com cor levemente diferente representando o PVB/SGP). Do lado, setas de cota simples (linha + seta nas pontas) indicando a espessura total. As linhas têm stroke de 1px, cor `#0D0D0D` com opacidade 15%. A camada de vidro tem fill `rgba(200,16,46,0.06)` (vermelho levíssimo — quase imperceptível, mas remete ao accent). Dimensão total do diagrama: 80px × 120px. Posicionado no canto superior direito interno do card de specs, sem competir com o texto.

**Viabilidade:** CÓDIGO PURO — linhas, retângulos e paths simples em SVG inline.

**Alternativa simplificada:** Se muito complexo, usar apenas três retângulos horizontais empilhados (representando as camadas do vidro) com alturas diferentes e opacidades distintas, sem as cotas.

---

##### Hero de Portfólio / Card de Projeto
**Representa:** Transformação de espaço. Um projeto não é apenas um vidro instalado — é um espaço que ganhou transparência, luz, conexão entre dentro e fora.

**Metáfora visual:** A linha que separa exterior e interior. O vidro como limiar.

**Cena detalhada:** No hover do card de projeto (overlay sobre a foto), além do título e tag de categoria: uma linha horizontal fina (`1px`, cor branca, opacidade 40%) que divide visualmente o card ao meio — como se fosse o plano do vidro visto de perfil. Essa linha aparece no mesmo momento do overlay (fade in, `duration-300`). É sutil, não chamativa. Posicionada exatamente no centro vertical do card. À esquerda da linha, um ponto de origem branco (círculo de 4px). À direita, outro ponto. A linha conecta os dois — como um diagrama de instalação minimalista. Essa composição está ABAIXO do texto do título (que fica na faixa inferior do overlay).

**Viabilidade:** CÓDIGO PURO — div com border-top + dois pseudo-elementos com border-radius 50%.

---

##### Section de Números / Diferenciais ("+2.000 Projetos")
**Representa:** Escala e solidez. A Lajeadense tem história e volume — esses números são a prova de que não é uma empresa nova. Significa: "confiança construída projeto a projeto."

**Metáfora visual:** Elevação de prédio — a ideia de construção acumulada, camada sobre camada.

**Cena detalhada:** Cada card de número tem, no fundo interno (não como decoração de surface — como elemento SVG dentro do card), uma silhueta geométrica extremamente abstrata e sutil de uma fachada de prédio: uma série de 5-7 retângulos verticais de alturas ligeiramente diferentes, alinhados pela base, sem detalhes — como um skyline muito simplificado visto de frente. Fill: `rgba(200,16,46,0.04)` (quase invisível). Stroke: nenhum. Posicionado no canto inferior direito do card, parcialmente cortado pelo edge do card. Dimensão: ~120px × 80px. O número grande em Barlow Condensed fica em primeiro plano, a silhueta é apenas atmosfera.

**Viabilidade:** CÓDIGO PURO — série de retângulos SVG com alturas definidas por array, fill com baixíssima opacidade.

**Alternativa simplificada:** Apenas 3 retângulos verticais de alturas 40px, 60px, 50px, fill com 3% opacidade.

---

##### Formulário de Orçamento
**Representa:** Início de uma conversa técnica. Não é um formulário genérico — é o primeiro passo de um projeto real entre profissionais.

**Metáfora visual:** A planta como ponto de partida. Arquitetos trabalham com plantas. O formulário é o "início do projeto."

**Cena detalhada:** Ao lado esquerdo do formulário (apenas no desktop, layout 40/60 como a Cinex), no lugar de uma foto qualquer, uma composição SVG original: linhas finas cinzas (stroke 0.5px, cor `#0D0D0D`, opacidade 12%) formando o outline simplificado de um plano arquitetônico — retângulos de diferentes tamanhos representando cômodos, sem preenchimento, apenas contornos. Não precisa ser uma planta real — é uma composição abstrata que REMETE a planta baixa. Sobre essa composição, três elementos vermelhos simples: um círculo de 6px (pin de localização), uma linha tracejada de 40px (indicando medida) e um pequeno quadrado de 4px (ponto de referência). Esses três elementos vermelhos têm opacidade 70% e são os únicos elementos com cor no visual. Fundo da área: `surface-subtle`. Dimensão total: ocupa 100% da altura do formulário. O conjunto cria a sensação de "estamos analisando seu projeto."

**Viabilidade:** CÓDIGO PURO — linhas e retângulos SVG com stroke fino + 3 elementos accent vermelhos.

**Alternativa simplificada:** Substituir pela foto da showroom/fábrica da Lajeadense (asset externo) como a Cinex faz em sua página de orçamento.

---

##### Card de Categoria de Produto (Vidro Temperado, Laminado, etc.)
**Representa:** Cada tipo de vidro tem uma propriedade física distinta que o torna único. Temperado = força. Laminado = segurança/contenção. Insulado = isolamento. O card deve comunicar a ESSÊNCIA física do produto.

**Metáfora visual:** Diagrama de camadas e comportamento do material.

**Cena detalhada:** No topo de cada card de categoria, antes da foto, uma faixa estreita de ~48px de altura com o diagrama conceitual do tipo de vidro:

- **Vidro Temperado:** Três retângulos horizontais estreitos (representando as camadas de compressão na superfície e tensão no núcleo), com o central mais escuro que os laterais. Linhas de tensão irradiando para os lados (4-5 linhas curtas, 8px, saindo das arestas).
- **Vidro Laminado:** Dois retângulos com uma camada intermediária em fill vermelho (0.15 opacidade) entre eles — visualizando o PVB/interlayer que é o diferencial do produto.
- **Vidro Insulado (duplo/triplo):** Dois retângulos com espaço vazio entre eles, e ondas de calor estilizadas (3 linhas curvas horizontais) no espaço — representando o isolamento térmico.

Todos esses diagramas usam: stroke 1px, cor `#0D0D0D` opacidade 20%. Fill: `surface-subtle`. Dimensão: 100% da largura do card × 48px. São pequenos, técnicos, únicos por categoria.

**Viabilidade:** CÓDIGO PURO — SVG inline por tipo de produto, usando apenas retângulos e paths simples.

---

##### Empty State / Página sem resultados de busca
**Representa:** O espaço aguardando ser preenchido. Como um vão arquitetônico antes da instalação do vidro.

**Metáfora visual:** O vão de uma janela sem vidro — o frame existe, mas o material ainda não chegou.

**Cena detalhada:** Composição SVG centralizada de ~200px × 160px. Um retângulo externo com stroke `1.5px` cor `border-default` (o frame da janela). Dentro dele, linhas diagonais cruzadas (`/` e `\`) preenchendo o espaço interior — como o símbolo técnico de "vidro a ser instalado" usado em plantas arquitetônicas. Abaixo, texto "Nenhum resultado encontrado" em `text-muted`. Abaixo do texto, botão secondary "Ver todos os produtos". As linhas diagonais têm stroke `0.5px`, opacidade 20%, e formam uma grade de losangos preenchendo o retângulo.

**Viabilidade:** CÓDIGO PURO — retângulo + linhas diagonais SVG, ambos trivialmente implementáveis.

---

## Tokens de Design

### Cores — Fundos
| Token | Valor | Uso |
|---|---|---|
| `surface-page` | `#F5F4F2` | Fundo principal da página (off-white quente) |
| `surface-section` | `#EBEBEA` | Seções alternadas, fundo de diferenciais |
| `surface-card` | `#FFFFFF` | Fundo de cards e painéis |
| `surface-subtle` | `#F0EFED` | Hover de rows, fundo de campos, áreas de destaque leve |
| `surface-elevated` | `#FFFFFF` | Modais, dropdowns (com shadow) |

### Cores — Texto
| Token | Valor | Uso |
|---|---|---|
| `text-primary` | `#0D0D0D` | Títulos, texto principal |
| `text-secondary` | `#4B4B4B` | Parágrafos de apoio, descrições |
| `text-muted` | `#9B9B9B` | Placeholders, hints, texto desabilitado, breadcrumbs |
| `text-on-dark` | `#FFFFFF` | Texto sobre fundos escuros (`action-strong`) |
| `text-on-brand` | `#FFFFFF` | Texto sobre botões vermelhos |

### Cores — Accent (UMA COR — VERMELHO CRIMSON)
| Token | Valor | Uso |
|---|---|---|
| `action-primary` | `#C8102E` | A COR da marca — botões CTAs, labels de seção, tag de categoria no hover, ícones de destaque, linha decorativa de seção, borda-top de cards âncora |
| `action-primary-hover` | `#A50D25` | Hover do botão primário (10% escurecido) |
| `action-primary-active` | `#8C0B1F` | Estado pressed (20% escurecido) |
| `action-strong` | `#0D0D0D` | CTAs escuros de alta conversão, fundo de seções âncora |
| `action-strong-hover` | `#1F1F1F` | Hover do CTA escuro |
| `action-secondary` | `#F5F4F2` | Botão secundário neutro |

### Cores — Bordas
| Token | Valor | Uso |
|---|---|---|
| `border-default` | `#DDDCDA` | Bordas padrão de inputs, cards, separadores |
| `border-subtle` | `#EBEBEA` | Bordas muito sutis, divisores internos |
| `border-focus` | `#C8102E` | Focus ring (acessibilidade) |

### Cores — Status (APENAS para feedback funcional)
| Token | Valor | Uso |
|---|---|---|
| `status-success` | `#1A6B3C` | Confirmações, formulário enviado — APENAS para feedback positivo |
| `status-warning` | `#C47A15` | Alertas, atenção — APENAS para alertas funcionais |
| `status-error` | `#C8102E` | Erros de formulário — coincide com action-primary (intencional) |

### Geometria
| Token | Valor | Uso |
|---|---|---|
| `radius-none` | `0px` | Imagens de produto/portfólio (linguagem arquitetônica) |
| `radius-sm` | `6px` | Inputs, badges, chips, tags |
| `radius-md` | `8px` | Botões |
| `radius-lg` | `12px` | Cards de conteúdo pequenos, tooltips |
| `radius-xl` | `16px` | Cards de produto, painéis de especificação |
| `radius-2xl` | `24px` | Cards hero, painéis de destaque |
| `radius-full` | `9999px` | Avatares, pills, toggles |

### Sombras
| Token | Valor CSS | Uso |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Inputs hover, header ao rolar |
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)` | Cards padrão |
| `shadow-card-hover` | `0 6px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)` | Hover de cards |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.10)` | Dropdowns, elementos flutuantes |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.16)` | Modais, popovers |
| `shadow-button-primary` | `0 2px 12px rgba(200,16,46,0.35)` | Botão vermelho (glow sutil — único glow da interface) |

### Espaçamento
| Token | Valor | Uso principal |
|---|---|---|
| `space-1` | `4px` | Gap entre ícone e label |
| `space-2` | `8px` | Gap entre itens internos |
| `space-3` | `12px` | Padding de badges, padding vertical de botões |
| `space-4` | `16px` | Padding padrão mobile, gap entre campos |
| `space-6` | `24px` | Padding de cards, padding horizontal de botões |
| `space-8` | `32px` | Gap entre blocos de conteúdo |
| `space-12` | `48px` | Padding de seções mobile |
| `space-16` | `64px` | Padding de seções desktop |
| `space-20` | `80px` | Seções hero, espaços dramáticos |

---

## Componentes Shadcn — Overrides

| Componente | Override (usando tokens) |
|---|---|
| `<Card>` | `bg-surface-card shadow-card radius-xl border border-subtle` |
| `<Button variant="default">` | `bg-action-primary text-on-brand radius-md shadow-button-primary hover:bg-action-primary-hover font-semibold text-sm` |
| `<Button variant="secondary">` | `bg-action-secondary text-primary border border-default radius-md hover:bg-surface-subtle font-semibold text-sm` |
| `<Button variant="ghost">` | `bg-transparent text-primary hover:bg-surface-subtle radius-md font-medium text-sm` |
| `<Badge>` | `bg-surface-subtle text-secondary radius-full text-xs font-medium px-3 py-1` |
| `<Badge variant="accent">` | `bg-action-primary text-on-brand radius-full text-xs font-medium px-3 py-1` |
| `<Input>` | `bg-surface-card border-border-default radius-sm text-primary placeholder:text-muted focus:border-border-focus focus:ring-2 focus:ring-action-primary/20` |
| `<Avatar>` | `radius-full border-2 border-border-subtle` |

---

## Regra de Ouro

Ao criar qualquer tela ou componente da Lajeadense Vidros:

1. **Siga as três camadas** — estrutura (layout/hierarquia definidos), linguagem (Barlow Condensed + DM Sans, vermelho único, neutros quentes, radius seletivo) e riqueza visual (conceitos técnicos em SVG, não decoração genérica)
2. **Use shadcn/ui como base**, customizado via className com os tokens deste documento
3. **APENAS tokens semânticos** — nunca `text-gray-500`, nunca `rounded-lg`, nunca `shadow-md` do Tailwind padrão — apenas os tokens nomeados acima
4. **A foto da obra é a identidade** — a interface é o frame que a valoriza. Não compete com a imagem. Quanto mais limpo o frame, mais poderosa a foto
5. **Vermelho é ação e autoridade, nunca decoração** — aparece em botões CTA, labels de categoria/seção, tags de hover em fotos, e na linha decorativa de 2px que precede títulos de seção. Nunca como background de card, nunca em gradiente
6. **Componentes técnicos têm conceito visual próprio** — diagrama de corte no card de spec, silhueta de skyline nos cards de número, layers de material no card de categoria — são SVGs técnicos e originais, não blobs nem dot grids
7. **Quinas retas em imagens de obra** — `radius-none overflow-hidden` em todo card de portfólio/produto com foto
8. **O vidro desaparece para que o espaço apareça — a interface também.**

## Teste Final

Coloque a interface ao lado de um dashboard shadcn padrão. A diferença deve ser óbvia em três níveis:

- **ESTRUTURA:** Split layout assimétrico 40/60 nas páginas de produto, grid masonry de fotos sem radius, hero fullscreen com overlay gradiente inferior, seções âncora em preto profundo — nada disso existe no shadcn padrão
- **LINGUAGEM:** Barlow Condensed em caixa alta nos títulos de seção (tipografia industrial inconfundível), neutros quentes ao invés de cinzas frios, vermelho crimson usado cirurgicamente (não espalhado), sombras quase inexistentes — o contraste de superfície faz o trabalho
- **RIQUEZA:** Card de especificação com diagrama de corte transversal SVG, cards de número com silhueta de skyline em fill 3%, card de categoria com diagrama de camadas do material específico (temperado ≠ laminado ≠ insulado), formulário com composição de planta baixa abstrata — cada componente técnico importante tem uma ilustração que conta a história do que representa

Se os cards tiverem apenas foto + texto sem nenhum diagrama técnico conceitual, está INCOMPLETO.
Se a interface usar qualquer cor vibrante além do vermelho `#C8102E`, está ERRADO.
Se as imagens de produto tiverem `rounded-xl`, está ERRADO — quinas retas são a linguagem do setor.
