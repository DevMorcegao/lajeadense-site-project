# Design System — Lajeadense Vidros

> Identidade clean e premium para empresa do ramo vidreiro (construção civil e prédios).
> Mobile-first · Tokens semânticos · Vermelho como cor de ação.

---

## 1. Visão Geral

**Marca:** Lajeadense Vidros
**Setor:** Vidros para construção civil e arquitetura
**Personalidade:** Premium · Técnica · Confiável · Sólida
**Abordagem visual:** Minimalismo sofisticado, paleta neutra de base quente com vermelho como único acento cromático forte. Tipografia com peso e presença. Espaço negativo generoso.

---

## 2. Paleta de Cores

### Referência da Marca (da Logo)

| Papel          | Valor Real  | Descrição                              |
|----------------|-------------|----------------------------------------|
| Preto Marca    | `#0D0D0D`   | Fundo escuro da logo                   |
| Vermelho Marca | `#C8102E`   | Vermelho crimson da logo (cor de ação) |
| Cinza Marca    | `#9B9B9B`   | Cinza neutro do segundo elemento       |
| Branco         | `#FFFFFF`   | Texto sobre escuro                     |

---

### Mapeamento de Tokens

#### Texto

| Token            | Valor Real  | Uso                                          |
|------------------|-------------|----------------------------------------------|
| `text-primary`   | `#0D0D0D`   | Títulos, texto principal                     |
| `text-secondary` | `#4B4B4B`   | Parágrafos de apoio, descrições              |
| `text-muted`     | `#9B9B9B`   | Placeholders, hints, texto desabilitado      |
| `text-on-dark`   | `#FFFFFF`   | Texto sobre fundos escuros e seções escuras  |
| `text-on-brand`  | `#FFFFFF`   | Texto sobre botões vermelhos (action-primary)|

#### Superfícies

| Token              | Valor Real  | Uso                                             |
|--------------------|-------------|-------------------------------------------------|
| `surface-page`     | `#F5F4F2`   | Fundo principal da página (off-white quente)    |
| `surface-section`  | `#EBEBEA`   | Seções alternadas, listras de conteúdo          |
| `surface-card`     | `#FFFFFF`   | Fundo de cards e painéis                        |
| `surface-subtle`   | `#F0EFED`   | Áreas de destaque leve, hover de rows           |
| `surface-elevated` | `#FFFFFF`   | Elementos com sombra (modais, dropdowns)        |

> **Nota:** A página tem base quase branca com toque levemente quente, evitando o branco puro que remete a sites genéricos. O contraste entre `surface-page` e `surface-card` é sutil mas presente.

#### Ações

| Token                   | Valor Real  | Uso                                      |
|-------------------------|-------------|------------------------------------------|
| `action-primary`        | `#C8102E`   | Botões principais, links de ação, CTAs   |
| `action-primary-hover`  | `#A50D25`   | Hover do botão primário (10% escurecido) |
| `action-primary-active` | `#8C0B1F`   | Estado pressed (20% escurecido)          |
| `action-secondary`      | `#F5F4F2`   | Botão secundário (fundo sutil)           |
| `action-strong`         | `#0D0D0D`   | CTAs escuros de alta conversão           |
| `action-strong-hover`   | `#1F1F1F`   | Hover do CTA escuro                      |

#### Bordas

| Token            | Valor Real  | Uso                                      |
|------------------|-------------|------------------------------------------|
| `border-default` | `#DDDCDA`   | Bordas padrão de inputs e cards          |
| `border-subtle`  | `#EBEBEA`   | Bordas muito sutis, divisores internos   |
| `border-focus`   | `#C8102E`   | Focus ring (acessibilidade)              |

#### Status

| Token             | Valor Real  | Uso                                   |
|-------------------|-------------|---------------------------------------|
| `status-success`  | `#1A6B3C`   | Confirmações, pedido enviado, ok       |
| `status-warning`  | `#C47A15`   | Alertas, atenção, prazo               |
| `status-error`    | `#C8102E`   | Erros, campos inválidos               |

> **Nota:** `status-error` coincide com `action-primary` (vermelho da marca). Isso é intencional e consistente com a linguagem visual — o vermelho sempre sinaliza "ação" ou "atenção".

---

## 3. Tipografia

### Fontes

| Papel          | Família             | Fonte sugerida (Google Fonts)             |
|----------------|---------------------|-------------------------------------------|
| Display/Título | `"Barlow Condensed"` | Títulos grandes, hero, seções             |
| Corpo/UI       | `"DM Sans"`         | Parágrafos, botões, labels, inputs        |

> **Justificativa:** Barlow Condensed tem a presença industrial e técnica que combina com vidros e construção, sem ser genérica. DM Sans é legível, moderna e clean para o corpo.

### Escala

| Token       | Tamanho | Peso típico         | Uso                              |
|-------------|---------|---------------------|----------------------------------|
| `text-xs`   | 12px    | `font-medium`       | Badges, labels de campo          |
| `text-sm`   | 14px    | `font-normal`       | Legendas, captions, texto terciário |
| `text-base` | 16px    | `font-normal`       | Corpo de texto padrão            |
| `text-lg`   | 18px    | `font-medium`       | Texto de destaque, leads         |
| `text-xl`   | 20px    | `font-semibold`     | Subtítulos de seção              |
| `text-2xl`  | 24px    | `font-semibold`     | Títulos de cards, destaques      |
| `text-3xl`  | 30px    | `font-bold`         | Títulos de seção principal       |
| `text-4xl`  | 36px    | `font-bold`         | Títulos de página                |
| `text-5xl`  | 48px    | `font-bold`         | Headlines hero (Barlow Condensed)|

---

## 4. Espaçamento

| Token      | Valor | Uso principal                                    |
|------------|-------|--------------------------------------------------|
| `space-1`  | 4px   | Gap entre ícone e label, separações mínimas      |
| `space-2`  | 8px   | Gap entre itens de lista, espaço interno pequeno |
| `space-3`  | 12px  | Padding interno de badges e chips                |
| `space-4`  | 16px  | Padding padrão de inputs, padding mobile         |
| `space-6`  | 24px  | Padding de cards, gap entre campos de form       |
| `space-8`  | 32px  | Gap entre blocos de conteúdo                     |
| `space-12` | 48px  | Padding de seções no mobile                      |
| `space-16` | 64px  | Padding de seções no desktop                     |
| `space-20` | 80px  | Seções hero, espaços dramáticos                  |

---

## 5. Bordas e Sombras

### Border Radius

| Token        | Valor  | Uso                              |
|--------------|--------|----------------------------------|
| `radius-sm`  | 6px    | Inputs, badges, chips            |
| `radius-md`  | 8px    | Botões                           |
| `radius-lg`  | 12px   | Cards pequenos, tooltips         |
| `radius-xl`  | 16px   | Cards principais                 |
| `radius-2xl` | 24px   | Cards hero, painéis destacados   |
| `radius-full`| 9999px | Avatares, pills, toggles         |

### Sombras

| Token                  | Valor CSS                                              | Uso                              |
|------------------------|--------------------------------------------------------|----------------------------------|
| `shadow-sm`            | `0 1px 3px rgba(0,0,0,0.08)`                          | Inputs, hover states sutis       |
| `shadow-md`            | `0 4px 12px rgba(0,0,0,0.10)`                         | Cards, dropdowns                 |
| `shadow-lg`            | `0 8px 32px rgba(0,0,0,0.16)`                         | Modais, popovers                 |
| `shadow-card`          | `0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)` | Cards padrão                 |
| `shadow-card-hover`    | `0 6px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)` | Hover de cards               |
| `shadow-button-primary`| `0 2px 12px rgba(200,16,46,0.35)`                     | Botão vermelho (glow sutil)      |

---

## 6. Componentes

---

### 6.1 Botão Primary

Botão de ação principal. Usado para envio de formulários, CTAs importantes, confirmações.

```
[SOLICITAR ORÇAMENTO]
```

| Propriedade   | Token                    |
|---------------|--------------------------|
| Background    | `action-primary`         |
| Texto         | `text-on-brand`          |
| Tamanho texto | `text-sm` · `font-semibold` |
| Radius        | `radius-md`              |
| Padding H     | `space-6`                |
| Padding V     | `space-3`                |
| Sombra        | `shadow-button-primary`  |

**Estados:**

| Estado     | Mudança                                         |
|------------|-------------------------------------------------|
| Default    | bg `action-primary`                             |
| Hover      | bg `action-primary-hover` · sombra levemente maior |
| Active     | bg `action-primary-active` · sem sombra         |
| Focus      | ring 2px `border-focus` offset 2px             |
| Disabled   | opacidade 40% · cursor `not-allowed`            |

---

### 6.2 Botão Secondary

Ação secundária, alternativa ou de cancelamento.

```
[ Ver Catálogo ]
```

| Propriedade   | Token                    |
|---------------|--------------------------|
| Background    | `action-secondary`       |
| Texto         | `text-primary`           |
| Borda         | 1px `border-default`     |
| Tamanho texto | `text-sm` · `font-semibold` |
| Radius        | `radius-md`              |
| Padding H     | `space-6`                |
| Padding V     | `space-3`                |

**Estados:**

| Estado   | Mudança                                           |
|----------|---------------------------------------------------|
| Default  | bg `action-secondary` · border `border-default`   |
| Hover    | bg `surface-subtle` · border `border-default`     |
| Active   | bg `surface-section`                              |
| Focus    | ring 2px `border-focus` offset 2px               |
| Disabled | opacidade 40% · cursor `not-allowed`              |

---

### 6.3 Botão Strong (CTA escuro)

CTA de alta conversão, seções escuras, destaque absoluto.

```
[▶ FALE COM UM ESPECIALISTA]
```

| Propriedade   | Token                    |
|---------------|--------------------------|
| Background    | `action-strong`          |
| Texto         | `text-on-dark`           |
| Tamanho texto | `text-sm` · `font-semibold` |
| Radius        | `radius-md`              |
| Padding H     | `space-6`                |
| Padding V     | `space-3`                |
| Sombra        | `shadow-md`              |

**Estados:**

| Estado   | Mudança                               |
|----------|---------------------------------------|
| Default  | bg `action-strong`                    |
| Hover    | bg `action-strong-hover`             |
| Active   | bg `#2A2A2A` (escurecimento mínimo)   |
| Focus    | ring 2px `border-focus` offset 2px   |
| Disabled | opacidade 40% · cursor `not-allowed`  |

---

### 6.4 Card de Produto/Serviço

Card usado para exibir linhas de produto, serviços ou cases.

```
┌──────────────────────────────┐
│  [imagem / ícone]            │
│                              │
│  Vidro Temperado             │  ← text-2xl · font-semibold
│  Para fachadas e sacadas     │  ← text-sm · text-secondary
│                              │
│  [ Saiba Mais → ]            │  ← botão secondary
└──────────────────────────────┘
```

| Propriedade  | Token                    |
|--------------|--------------------------|
| Background   | `surface-card`           |
| Radius       | `radius-xl`              |
| Sombra       | `shadow-card`            |
| Padding      | `space-6`                |
| Gap interno  | `space-4`                |

**Estados:**

| Estado   | Mudança                               |
|----------|---------------------------------------|
| Default  | `shadow-card`                         |
| Hover    | `shadow-card-hover` · translateY -2px |

---

### 6.5 Card de Destaque (Hero Card)

Para valores, diferenciais ou dados numéricos de impacto.

```
┌────────────────────────────────────┐
│                                    │
│     +2.000                         │  ← text-5xl · font-bold · text-primary
│     Projetos entregues             │  ← text-base · text-secondary
│                                    │
└────────────────────────────────────┘
```

| Propriedade  | Token                    |
|--------------|--------------------------|
| Background   | `surface-card`           |
| Radius       | `radius-2xl`             |
| Sombra       | `shadow-md`              |
| Padding      | `space-8`                |
| Acento       | borda-top 3px `action-primary` |

---

### 6.6 Input de Texto

```
Nome completo
┌────────────────────────────────────┐
│  João da Silva                     │
└────────────────────────────────────┘
```

| Propriedade      | Token                    |
|------------------|--------------------------|
| Background       | `surface-card`           |
| Borda            | 1px `border-default`     |
| Radius           | `radius-sm`              |
| Texto dentro     | `text-base` · `text-primary` |
| Placeholder      | `text-muted`             |
| Label            | `text-sm` · `font-medium` · `text-secondary` |
| Padding interno  | `space-3` vertical · `space-4` horizontal |

**Estados:**

| Estado   | Mudança                                         |
|----------|-------------------------------------------------|
| Default  | border `border-default`                         |
| Hover    | border levemente mais escura (`#C5C4C2`)         |
| Focus    | border `border-focus` · ring 2px `border-focus` com opacidade 20% |
| Erro     | border `status-error` · texto de erro `status-error` abaixo |
| Disabled | bg `surface-section` · opacidade 50%            |

---

### 6.7 Badge / Tag

```
  ● Fachada    ● Temperado    ● Laminado
```

| Propriedade   | Token                              |
|---------------|------------------------------------|
| Background    | `surface-subtle`                   |
| Texto         | `text-xs` · `font-medium` · `text-secondary` |
| Radius        | `radius-full`                      |
| Padding H     | `space-3`                          |
| Padding V     | `space-1`                          |

**Variante destaque (tag de categoria ativa):**

| Propriedade   | Token                              |
|---------------|------------------------------------|
| Background    | `action-primary`                   |
| Texto         | `text-xs` · `font-medium` · `text-on-brand` |

---

### 6.8 Navegação (Header)

```
LAJEADENSE VIDROS   Produtos  Projetos  Sobre  Contato   [Orçamento]
```

| Elemento       | Token                                    |
|----------------|------------------------------------------|
| Background     | `surface-card` (com `shadow-sm` ao rolar)|
| Logo texto     | `text-xl` · `font-bold` · `text-primary` |
| Links nav      | `text-sm` · `font-medium` · `text-secondary` |
| Link ativo     | `text-sm` · `font-semibold` · `text-primary` |
| Botão CTA nav  | Botão Primary (compacto)                 |
| Padding V      | `space-4`                                |
| Padding H      | `space-6` (mobile) · `space-12` (desktop)|

**Mobile:** hamburguer → drawer lateral com bg `surface-elevated` e `shadow-lg`.

---

### 6.9 Seção Hero

```
┌─────────────────────────────────────────────┐
│  [fundo escuro: action-strong]              │
│                                             │
│    Vidros que                               │  ← text-5xl · font-bold · text-on-dark
│    transformam espaços.                     │
│                                             │
│    Soluções em vidro para                   │  ← text-lg · text-on-dark · opacidade 80%
│    construção civil e arquitetura.          │
│                                             │
│    [Solicitar Orçamento]  [Ver Projetos]    │
│                                             │
│    Padding vertical: space-20              │
└─────────────────────────────────────────────┘
```

| Elemento        | Token                                         |
|-----------------|-----------------------------------------------|
| Background      | `action-strong`                               |
| Padding V       | `space-20`                                    |
| Padding H       | `space-4` (mobile) · `space-16` (desktop)     |
| Título          | `text-5xl` · `font-bold` · `text-on-dark`     |
| Subtítulo       | `text-lg` · `text-on-dark` (70% opacidade)   |
| Gap entre botões| `space-3`                                     |

---

### 6.10 Mensagens de Status (Feedback)

```
✓  Orçamento enviado com sucesso! Entraremos em contato em breve.
⚠  Verifique os campos destacados antes de continuar.
✕  Não foi possível enviar. Tente novamente.
```

| Variante  | Cor de fundo (10% opacidade) | Borda esq. 3px | Ícone + texto   |
|-----------|------------------------------|----------------|-----------------|
| Sucesso   | `status-success`             | `status-success` | `status-success` |
| Warning   | `status-warning`             | `status-warning` | `status-warning` |
| Erro      | `status-error`               | `status-error`   | `status-error`   |

Radius: `radius-sm` · Padding: `space-4` · Texto: `text-sm` · `font-medium`

---

## 7. Exemplos de Uso

### Página de Contato (mobile)

```
surface-page (fundo)
  space-4 (padding lateral)

  text-3xl · font-bold · text-primary
  "Fale com a gente"

  space-2

  text-base · text-secondary
  "Preencha o formulário e retornamos em até 24h."

  space-8 (gap até o form)

  [Input] Nome completo
  space-4
  [Input] E-mail
  space-4
  [Input] Telefone
  space-4
  [Textarea] Descreva seu projeto
  space-6

  [Botão Primary · largura 100%]
  "Enviar mensagem"
```

---

### Card de Produto (grid 2 colunas no mobile)

```
surface-card · radius-xl · shadow-card · space-6

  [imagem · radius-lg · altura fixa]
  space-4
  text-xl · font-semibold · text-primary
  "Vidro Laminado"
  space-2
  text-sm · text-secondary
  "Alta resistência e segurança para fachadas."
  space-4
  [Badge] "Fachada"  [Badge] "Segurança"
  space-4
  [Botão Secondary · largura 100%]
  "Saiba mais →"
```

---

### Seção de Diferenciais (fundo alternado)

```
surface-section · padding-y: space-12 · padding-x: space-4

  text-3xl · font-bold · text-primary · text-center
  "Por que escolher a Lajeadense?"

  space-2
  text-base · text-secondary · text-center
  "Qualidade e tradição em cada projeto."

  space-8

  grid 1 col (mobile) → 3 cols (desktop)
    [Card de Destaque]
    [Card de Destaque]
    [Card de Destaque]
```

---

## 8. Variáveis CSS (Implementação)

```css
:root {
  /* Texto */
  --text-primary: #0D0D0D;
  --text-secondary: #4B4B4B;
  --text-muted: #9B9B9B;
  --text-on-dark: #FFFFFF;
  --text-on-brand: #FFFFFF;

  /* Superfícies */
  --surface-page: #F5F4F2;
  --surface-section: #EBEBEA;
  --surface-card: #FFFFFF;
  --surface-subtle: #F0EFED;
  --surface-elevated: #FFFFFF;

  /* Ações */
  --action-primary: #C8102E;
  --action-primary-hover: #A50D25;
  --action-primary-active: #8C0B1F;
  --action-secondary: #F5F4F2;
  --action-strong: #0D0D0D;
  --action-strong-hover: #1F1F1F;

  /* Bordas */
  --border-default: #DDDCDA;
  --border-subtle: #EBEBEA;
  --border-focus: #C8102E;

  /* Status */
  --status-success: #1A6B3C;
  --status-warning: #C47A15;
  --status-error: #C8102E;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.16);
  --shadow-card: 0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
  --shadow-card-hover: 0 6px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
  --shadow-button-primary: 0 2px 12px rgba(200,16,46,0.35);

  /* Tipografia */
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
```

---

## 9. Regras de Ouro

1. **Vermelho é ação, não decoração.** Só use tokens `action-primary` e `status-error` para elementos interativos ou feedback crítico. Nunca como enfeite.
2. **Nunca invente valores.** Se precisar de algo que não está neste sistema, documente a necessidade e expanda os tokens antes de implementar.
3. **O neutro é o herói.** A paleta quase monocromática é o que dá sofisticação. Não quebre com gradientes coloridos ou outros acentos.
4. **Mobile-first sempre.** Todo componente começa pelo layout de 375px. Desktop é adaptação, não o original.
5. **Consistência absoluta.** Mesmo componente → mesmos tokens sempre. Sem exceções por contexto.
