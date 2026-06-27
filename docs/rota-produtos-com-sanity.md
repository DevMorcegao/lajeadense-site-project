# Rota de Produtos + Sanity CMS — Guia Completo de Implementação
**Lajeadense Vidros · Design System v1 · Stack: Next.js + Sanity v3**

> Define arquitetura, schema de dados, setup, integração e implementação completa da rota `/produtos` e `/produtos/[slug]` com conteúdo gerenciado pelo cliente via Sanity Studio. Siga na ordem exata — cada etapa depende da anterior.

---

## ÍNDICE

1. [Entendendo o Sanity — Conceitos Antes de Começar](#1-entendendo-o-sanity--conceitos-antes-de-começar)
2. [Setup Inicial do Sanity](#2-setup-inicial-do-sanity)
3. [Schema dos Produtos](#3-schema-dos-produtos)
4. [Integrando o Sanity no Next.js](#4-integrando-o-sanity-no-nextjs)
5. [Cadastrando os Produtos no Studio](#5-cadastrando-os-produtos-no-studio)
6. [Arquitetura de Rotas](#6-arquitetura-de-rotas)
7. [Rota /produtos — Grid de Listagem](#7-rota-produtos--grid-de-listagem)
8. [Filtro de Categorias](#8-filtro-de-categorias)
9. [Animações Framer Motion](#9-animações-framer-motion)
10. [Rota /produtos/[slug] — Página de Produto](#10-rota-produtosslug--página-de-produto)
11. [Objeto 3D — GLB via Sanity](#11-objeto-3d--glb-via-sanity)
12. [SEO Completo](#12-seo-completo)
13. [Performance e Core Web Vitals](#13-performance-e-core-web-vitals)
14. [Mobile](#14-mobile)
15. [O Que o Cliente Consegue Editar](#15-o-que-o-cliente-consegue-editar)
16. [Checklist Final](#16-checklist-final)

---

## 1. Entendendo o Sanity — Conceitos Antes de Começar

### O que é o Sanity no contexto deste projeto

O Sanity funciona em três partes que você precisa entender antes de escrever qualquer código:

**Sanity Studio:** É o painel admin. Uma interface web onde o cliente faz login e edita os produtos — troca textos, faz upload de imagens, sobe novos arquivos `.glb`. Você não constrói esse painel — ele é gerado automaticamente a partir do schema que você define.

**Sanity Dataset:** É o banco de dados. Fica nos servidores do Sanity. Você não precisa de Supabase, PostgreSQL ou qualquer outro banco para este projeto — o Sanity armazena tudo: textos, metadados, imagens, arquivos `.glb`.

**Content Lake API (GROQ):** É como você busca os dados no Next.js. O Sanity usa uma linguagem de query própria chamada GROQ (parecida com GraphQL mas mais simples). Você escreve uma query, o Sanity devolve JSON.

```
Cliente edita no Sanity Studio
          ↓
Dados salvos no Sanity Dataset (nuvem)
          ↓
Next.js faz query GROQ via API
          ↓
Página renderiza com dados atualizados
```

### Não precisa de backend próprio

Para este projeto: **zero backend customizado**. Sem Supabase, sem PostgreSQL, sem Express, sem API routes complexas. O Sanity é o backend. Suas API routes do Next.js, se existirem, serão apenas para revalidação de cache — e mesmo isso é opcional.

### Arquivos .glb no Sanity

O Sanity tem um tipo `file` que aceita qualquer formato binário, incluindo `.glb`. O cliente faz upload pelo Studio, o Sanity armazena o arquivo na CDN deles e devolve uma URL pública. No código, você usa essa URL para carregar o modelo 3D. Funciona idêntico a uma imagem.

### Plano gratuito — o que cobre

O plano free do Sanity cobre:
- 3 usuários
- 500k API requests/mês (mais que suficiente para um site institucional)
- 20GB de bandwidth
- 20GB de storage (imagens + arquivos .glb)

Para 12 produtos com fotos e modelos 3D, o plano gratuito é mais do que suficiente.

---

## 2. Setup Inicial do Sanity

### Passo 1 — Criar conta

Acessar [sanity.io](https://sanity.io) e criar conta (pode usar login Google).

### Passo 2 — Criar o projeto Sanity

```bash
# Na raiz do projeto Next.js, rodar:
npm create sanity@latest

# O CLI vai perguntar:
# ✔ Select project to use: Create new project
# ✔ Your project name: lajeadense-vidros
# ✔ Use the default dataset configuration? Yes
# ✔ Project output path: ./sanity   ← pasta dentro do projeto Next.js
# ✔ Select project template: Clean project with no predefined schemas
# ✔ Add files to gitignore? Yes (vai adicionar .env)
```

Isso cria uma pasta `/sanity` dentro do seu projeto Next.js com o Studio configurado. O projeto fica assim:

```
meu-projeto/
├── app/                    ← Next.js (rotas, páginas)
├── sanity/                 ← Sanity Studio
│   ├── schemas/            ← Onde você define os tipos de conteúdo
│   ├── sanity.config.ts    ← Configuração do Studio
│   └── sanity.cli.ts
├── lib/
│   └── sanity.ts           ← Cliente de query (criado no Passo 5)
├── .env.local
└── package.json
```

### Passo 3 — Instalar dependências do Sanity no Next.js

```bash
npm install next-sanity @sanity/image-url
```

**Por que `next-sanity`:** É o kit oficial que integra Sanity com Next.js. Inclui o cliente configurado, helpers de ISR (revalidação automática quando o cliente edita), e o componente de live preview.

**Por que `@sanity/image-url`:** O Sanity tem uma CDN de imagens com transformação on-the-fly (resize, crop, quality). Este pacote gera as URLs otimizadas para cada uso (thumbnail, fullsize, og image).

### Passo 4 — Variáveis de ambiente

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID="seu-project-id"   # aparece no sanity.io/manage
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="seu-token"                      # criado em sanity.io/manage → API → Tokens
```

**Como obter o token:**
1. Acessar [sanity.io/manage](https://sanity.io/manage)
2. Selecionar o projeto
3. API → Tokens → Add API token
4. Nome: "Next.js Read" · Permissão: Viewer
5. Copiar o token gerado (aparece só uma vez)

### Passo 5 — Criar o cliente Sanity no Next.js

```typescript
// lib/sanity.ts
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',  // data fixa — não usar 'latest'
  useCdn: true,              // CDN para leitura (mais rápido) — true em produção
})

// Helper para gerar URLs de imagem otimizadas
const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}
```

### Passo 6 — Rodar o Studio localmente

```bash
# O Studio roda em paralelo ao Next.js
# Em um terminal:
npm run dev              # Next.js em localhost:3000

# Em outro terminal:
cd sanity && npx sanity dev   # Studio em localhost:3333
```

**Alternativa — embutir o Studio dentro do Next.js (recomendado):**

Com `next-sanity`, é possível servir o Studio em `/studio` dentro da própria aplicação Next.js. Isso significa um só deploy, uma só URL.

```typescript
// app/studio/[[...tool]]/page.tsx
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

O cliente acessa o painel em `seusite.com.br/studio`. Você protege essa rota com autenticação (o Sanity já pede login do usuário Sanity por padrão).

---

## 3. Schema dos Produtos

O schema é a definição dos campos de cada produto. É o "formulário" que o cliente vai preencher no Studio. Você cria um arquivo por tipo de conteúdo.

### Criar o arquivo de schema

```typescript
// sanity/schemas/produto.ts

export const produtoSchema = {
  name: 'produto',
  title: 'Produtos',
  type: 'document',
  fields: [

    // ─── IDENTIFICAÇÃO ────────────────────────────────────────────────
    {
      name: 'nome',
      title: 'Nome do Produto',
      type: 'string',
      description: 'Ex: Duoglass — Vidro Duplo Termoacústico',
      validation: (Rule: any) => Rule.required().max(80),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Gerado automaticamente a partir do nome. NÃO alterar após publicar.',
      options: {
        source: 'nome',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')  // remove acentos
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Segurança', value: 'seguranca' },
          { title: 'Conforto', value: 'conforto' },
          { title: 'Estética', value: 'estetica' },
          { title: 'Amplitude', value: 'amplitude' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Número que define a posição no grid (1 = primeiro). Use para reordenar.',
      validation: (Rule: any) => Rule.required().integer().positive(),
    },

    // ─── TEXTOS ───────────────────────────────────────────────────────
    {
      name: 'tagline',
      title: 'Tagline (frase curta para o card)',
      type: 'string',
      description: 'Máx. 100 caracteres. Aparece no card do grid.',
      validation: (Rule: any) => Rule.required().max(100),
    },
    {
      name: 'descricaoBreve',
      title: 'Descrição Breve',
      type: 'text',
      rows: 3,
      description: 'Máx. 200 caracteres. Aparece no card e como base do meta description.',
      validation: (Rule: any) => Rule.required().max(200),
    },
    {
      name: 'descricaoCompleta',
      title: 'Descrição Completa',
      type: 'array',
      of: [{ type: 'block' }],  // Rich text (bold, links, parágrafos)
      description: 'Texto completo exibido na página do produto.',
      validation: (Rule: any) => Rule.required(),
    },

    // ─── ESPECIFICAÇÕES TÉCNICAS ──────────────────────────────────────
    {
      name: 'especificacoes',
      title: 'Especificações Técnicas',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Campo',
              type: 'string',
              description: 'Ex: Espessuras disponíveis',
            },
            {
              name: 'valor',
              title: 'Valor',
              type: 'string',
              description: 'Ex: 6mm / 8mm / 10mm / 12mm',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'valor' },
          },
        },
      ],
    },

    // ─── NORMAS ABNT ──────────────────────────────────────────────────
    {
      name: 'normasABNT',
      title: 'Normas ABNT',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'codigo',
              title: 'Código',
              type: 'string',
              description: 'Ex: ABNT NBR 16015:2012',
            },
            {
              name: 'descricao',
              title: 'Descrição',
              type: 'string',
              description: 'Ex: Vidro insulado: requisitos e métodos de ensaio',
            },
          ],
          preview: {
            select: { title: 'codigo', subtitle: 'descricao' },
          },
        },
      ],
    },

    // ─── APLICAÇÕES ───────────────────────────────────────────────────
    {
      name: 'aplicacoes',
      title: 'Aplicações Típicas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: Fachadas Residenciais, Coberturas, Divisórias...',
    },

    // ─── IMAGENS ──────────────────────────────────────────────────────
    {
      name: 'imagemCapa',
      title: 'Imagem de Capa',
      type: 'image',
      description: 'Foto principal do produto. Aparece no card e no topo da página.',
      options: { hotspot: true },  // permite definir ponto focal para crop
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo (SEO)',
          type: 'string',
          description: 'Descreva a imagem com o nome do produto. Ex: Vidro duplo Duoglass instalado em fachada residencial',
          validation: (Rule: any) => Rule.required(),
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'galeria',
      title: 'Galeria de Fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Texto alternativo (SEO)',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
      ],
      description: 'Mínimo 4 fotos. Primeira foto aparece em destaque (largura total).',
      validation: (Rule: any) => Rule.min(4),
    },

    // ─── MODELO 3D ────────────────────────────────────────────────────
    {
      name: 'modelo3d',
      title: 'Modelo 3D (.glb)',
      type: 'file',
      description: 'Arquivo .glb do modelo 3D do produto. Máx. recomendado: 2MB.',
      options: {
        accept: '.glb',  // restringe o upload apenas a arquivos .glb
      },
      validation: (Rule: any) => Rule.required(),
    },

    // ─── SEO ──────────────────────────────────────────────────────────
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Máx. 60 caracteres. Ex: Vidro Duplo Termoacústico | Duoglass | Lajeadense',
          validation: (Rule: any) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Máx. 155 caracteres. Aparece no Google abaixo do título.',
          validation: (Rule: any) => Rule.max(155),
        },
      ],
    },

  ],

  // Preview no Studio — mostra a imagem de capa ao lado do nome na lista
  preview: {
    select: {
      title: 'nome',
      subtitle: 'categoria',
      media: 'imagemCapa',
    },
    prepare({ title, subtitle, media }: any) {
      const categorias: Record<string, string> = {
        seguranca: 'Segurança',
        conforto: 'Conforto',
        estetica: 'Estética',
        amplitude: 'Amplitude',
      }
      return {
        title,
        subtitle: categorias[subtitle] || subtitle,
        media,
      }
    },
  },
}
```

### Registrar o schema no Sanity

```typescript
// sanity/schemas/index.ts
import { produtoSchema } from './produto'

export const schemaTypes = [produtoSchema]
```

```typescript
// sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'lajeadense-vidros',
  title: 'Lajeadense Vidros — Admin',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})
```

---

## 4. Integrando o Sanity no Next.js

### Queries GROQ

GROQ é a linguagem de query do Sanity. A sintaxe é simples: `*` significa "todos os documentos", `[_type == "produto"]` filtra por tipo, `{...}` define os campos que você quer receber.

```typescript
// lib/queries.ts

// Query para o grid de listagem (/produtos)
// Busca apenas os campos necessários para o card — não buscar tudo (performance)
export const PRODUTOS_QUERY = `
  *[_type == "produto"] | order(ordem asc) {
    _id,
    nome,
    "slug": slug.current,
    categoria,
    tagline,
    descricaoBreve,
    imagemCapa {
      asset->{url, _id},
      alt,
      hotspot,
      crop
    },
    "normasResumidas": normasABNT[0..1] { codigo },
    aplicacoes[0..2]
  }
`

// Query para filtro por categoria
export const PRODUTOS_POR_CATEGORIA_QUERY = `
  *[_type == "produto" && categoria == $categoria] | order(ordem asc) {
    _id,
    nome,
    "slug": slug.current,
    categoria,
    tagline,
    descricaoBreve,
    imagemCapa {
      asset->{url, _id},
      alt,
      hotspot,
      crop
    },
    "normasResumidas": normasABNT[0..1] { codigo }
  }
`

// Query para página individual do produto (/produtos/[slug])
// Busca TUDO — é a página de detalhe
export const PRODUTO_QUERY = `
  *[_type == "produto" && slug.current == $slug][0] {
    _id,
    nome,
    "slug": slug.current,
    categoria,
    tagline,
    descricaoBreve,
    descricaoCompleta,
    especificacoes,
    normasABNT,
    aplicacoes,
    imagemCapa {
      asset->{url, _id},
      alt,
      hotspot,
      crop
    },
    galeria[] {
      asset->{url, _id},
      alt,
      hotspot,
      crop
    },
    "modelo3dUrl": modelo3d.asset->url,
    seo
  }
`

// Query para slugs (geração estática de rotas)
export const PRODUTOS_SLUGS_QUERY = `
  *[_type == "produto"] {
    "slug": slug.current
  }
`

// Query para produtos relacionados (exclui o produto atual, pega 3)
export const PRODUTOS_RELACIONADOS_QUERY = `
  *[_type == "produto" && slug.current != $slugAtual] | order(ordem asc) [0..2] {
    _id,
    nome,
    "slug": slug.current,
    categoria,
    tagline,
    imagemCapa {
      asset->{url, _id},
      alt
    }
  }
`
```

### Tipos TypeScript dos dados

```typescript
// lib/types.ts

export type ProdutoCard = {
  _id: string
  nome: string
  slug: string
  categoria: 'seguranca' | 'conforto' | 'estetica' | 'amplitude'
  tagline: string
  descricaoBreve: string
  imagemCapa: SanityImage
  normasResumidas: { codigo: string }[]
}

export type ProdutoDetalhe = ProdutoCard & {
  descricaoCompleta: any[]   // Portable Text (rich text do Sanity)
  especificacoes: { label: string; valor: string }[]
  normasABNT: { codigo: string; descricao: string }[]
  aplicacoes: string[]
  galeria: SanityImage[]
  modelo3dUrl: string
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export type SanityImage = {
  asset: { url: string; _id: string }
  alt: string
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}
```

---

## 5. Cadastrando os Produtos no Studio

Antes de implementar a página, cadastre os 12 produtos no Sanity Studio. Isso permite trabalhar com dados reais desde o início.

### Ordem de cadastro recomendada

1. Acessar o Studio (`localhost:3333` ou `seusite.com.br/studio`)
2. Clicar em "Produtos" → "New Produto"
3. Para cada produto, preencher na seguinte ordem:
   - Nome (o slug é gerado automaticamente — **revisar antes de publicar**)
   - Categoria
   - Ordem (1 a 12)
   - Tagline e descrições
   - Imagem de capa (com alt text)
   - Galeria (mín. 4 fotos)
   - Upload do `.glb`
   - Especificações técnicas
   - Normas ABNT
   - Aplicações
   - SEO (meta title e description)
4. Clicar em "Publish"

### Upload do arquivo .glb

No campo "Modelo 3D (.glb)":
1. Clicar em "Upload"
2. Selecionar o arquivo `.glb` do produto
3. O Sanity faz upload para a CDN e gera uma URL permanente
4. Essa URL é retornada como `modelo3dUrl` na query GROQ

**Atenção:** O campo `accept: '.glb'` no schema restringe o Studio a aceitar apenas arquivos `.glb`. Se o cliente tentar fazer upload de outro formato, o Studio rejeita.

---

## 6. Arquitetura de Rotas

```
/produtos                           ← listagem (dados de todos os produtos)
/produtos/duo-glass                 ← detalhe (gerado estaticamente por slug)
/produtos/wall-glass-guarda-corpo
/produtos/fort-glass-multilaminado
/produtos/habitat-protecao-solar
/produtos/box-banheiro-temperado
/produtos/vidro-laminado
/produtos/vidro-jumbo
/produtos/espelhos
/produtos/vidro-polarizado
/produtos/vidro-pintado
/produtos/vidro-extra-clear
/produtos/duplo-pinazio
```

### Estrutura de arquivos no Next.js App Router

```
app/
├── produtos/
│   ├── page.tsx                    ← /produtos (listagem)
│   ├── loading.tsx                 ← skeleton da listagem
│   └── [slug]/
│       ├── page.tsx                ← /produtos/[slug] (detalhe)
│       └── loading.tsx             ← skeleton do detalhe
```

### Geração estática com ISR

```typescript
// app/produtos/[slug]/page.tsx

import { client } from '@/lib/sanity'
import { PRODUTO_QUERY, PRODUTOS_SLUGS_QUERY } from '@/lib/queries'

// Gera as rotas estaticamente no build
export async function generateStaticParams() {
  const slugs = await client.fetch(PRODUTOS_SLUGS_QUERY)
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

// Revalida a página a cada 60 segundos (ISR)
// Quando o cliente editar no Sanity, a página atualiza em até 60s
export const revalidate = 60

export default async function PaginaProduto({ params }: { params: { slug: string } }) {
  const produto = await client.fetch(PRODUTO_QUERY, { slug: params.slug })

  if (!produto) {
    notFound()  // Redireciona para 404 se o produto não existir
  }

  return <ProdutoDetalheComponent produto={produto} />
}
```

**Por que ISR e não Server Component puro ou CSR:**
- **SSR puro** (sem cache): cada acesso faz uma query ao Sanity. Lento, caro, desnecessário para conteúdo que muda raramente.
- **CSR** (client-side): JavaScript carrega os dados no browser. Ruim para SEO — o Google crawla antes do JS executar.
- **ISR** (Incremental Static Regeneration): página gerada estaticamente (rápida, indexável), revalidada automaticamente quando o conteúdo muda. Ideal para CMS.

---

## 7. Rota /produtos — Grid de Listagem

### Implementação da página

```typescript
// app/produtos/page.tsx

import { client } from '@/lib/sanity'
import { PRODUTOS_QUERY } from '@/lib/queries'
import { ProdutosGrid } from '@/components/produtos/ProdutosGrid'
import { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Linha de Produtos | Lajeadense Vidros',
  description: 'Conheça a linha completa de vidros da Lajeadense: temperado, laminado, termoacústico, polarizado e mais. Soluções técnicas para arquitetos e construtoras no RS.',
  alternates: { canonical: 'https://lajeadensevidros.com.br/produtos' },
}

export default async function ProdutosPage() {
  const produtos = await client.fetch(PRODUTOS_QUERY)
  return <ProdutosGrid produtosIniciais={produtos} />
}
```

### Layout do Grid

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER FIXO (surface-card · shadow-sm ao scroll)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO COMPACTO (bg: action-strong · min-h: 320px desktop)      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [linha vermelha 2px] · LINHA COMPLETA · text-xs        │   │
│  │  uppercase · tracking-widest · action-primary           │   │
│  │                                                         │   │
│  │  Nossa Linha de Produtos                                │   │
│  │  Barlow Condensed · 48px · bold · text-on-dark          │   │
│  │                                                         │   │
│  │  Soluções técnicas para cada etapa do projeto.          │   │
│  │  DM Sans · 18px · text-on-dark · opacity-70             │   │
│  │                                                         │   │
│  │  padding: space-16 vertical · space-16 horizontal       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FILTRO STICKY (surface-page · border-bottom border-subtle)     │
│  [Todos] [Segurança] [Conforto] [Estética] [Amplitude]         │
│                                                                 │
│  GRID DE PRODUTOS (surface-page · padding: space-16)            │
│  3 colunas desktop · 2 tablet · 1 mobile                       │
│                                                                 │
│  CTA FINAL (surface-section)                                    │
│                                                                 │
│  FOOTER                                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Componente ProdutosGrid

```typescript
// components/produtos/ProdutosGrid.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProdutoCard } from './ProdutoCard'
import { FiltroCategorias } from './FiltroCategorias'
import { ProdutoCard as ProdutoCardType } from '@/lib/types'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }
}

export function ProdutosGrid({ produtosIniciais }: { produtosIniciais: ProdutoCardType[] }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos')

  const produtosFiltrados = categoriaAtiva === 'todos'
    ? produtosIniciais
    : produtosIniciais.filter(p => p.categoria === categoriaAtiva)

  return (
    <section className="bg-surface-page">
      <FiltroCategorias
        categoriaAtiva={categoriaAtiva}
        onChange={setCategoriaAtiva}
      />

      <div className="max-w-7xl mx-auto px-16 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {produtosFiltrados.map(produto => (
              <motion.div
                key={produto.slug}
                layout
                variants={cardVariants}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <ProdutoCard produto={produto} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
```

### Anatomia do Card de Produto

```
┌────────────────────────────────────┐
│                                    │  ← radius-none (quinas retas — obrigatório)
│         IMAGEM DE CAPA             │  ← aspect-ratio: 4/3 · object-cover
│         (obra real, sem texto)     │     next/image com sizes otimizados
│                                    │
│   ┌── HOVER OVERLAY ─────────────┐ │
│   │ bg-black/60 · opacity-0      │ │  ← group-hover:opacity-100
│   │ transition-opacity 300ms     │ │     CSS transition (não Framer Motion)
│   │                              │ │
│   │ [TAG CATEGORIA] ·top-4 left-4│ │  ← bg-action-primary · text-on-brand
│   └──────────────────────────────┘ │     text-xs · font-medium · radius-sm
│                                    │     translate-x de -8px → 0 no hover
├────────────────────────────────────┤
│  border-t-2 border-action-primary  │  ← linha vermelha: elemento técnico
│                                    │     referencia visualmente o perfil de corte
│  surface-card · padding: space-6   │
│                                    │
│  NOME DO PRODUTO                   │  ← Barlow Condensed · text-2xl · bold
│  uppercase · text-primary          │     uppercase obrigatório
│                                    │
│  TAGLINE                           │  ← DM Sans · text-sm · text-secondary
│  line-clamp-2                      │     máx. 2 linhas
│                                    │
│  BADGES DE NORMA                   │  ← surface-subtle · text-muted
│  [NBR 16015]  [NBR 15575]         │     text-xs · radius-sm
│                                    │
│  ──── border-subtle ────           │
│                                    │
│  [Ver Detalhes] [Solicitar Orç.]   │  ← Secondary · Primary
│  flex · gap-3 · cada um flex-1     │     botão orçamento com querystring
└────────────────────────────────────┘
  radius-xl · shadow-card
  hover: shadow-card-hover · translateY(-4px) via Framer Motion
```

```typescript
// components/produtos/ProdutoCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { ProdutoCard as ProdutoCardType } from '@/lib/types'

const CATEGORIA_LABELS: Record<string, string> = {
  seguranca: 'Segurança',
  conforto: 'Conforto',
  estetica: 'Estética',
  amplitude: 'Amplitude',
}

export function ProdutoCard({ produto }: { produto: ProdutoCardType }) {
  const imagemUrl = urlFor(produto.imagemCapa)
    .width(600)
    .height(450)
    .format('webp')
    .quality(85)
    .url()

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-surface-card rounded-xl overflow-hidden"
      style={{ boxShadow: 'var(--shadow-card)' }}
      onHoverStart={(e) => {
        (e.target as HTMLElement).style.boxShadow = 'var(--shadow-card-hover)'
      }}
      onHoverEnd={(e) => {
        (e.target as HTMLElement).style.boxShadow = 'var(--shadow-card)'
      }}
    >
      {/* Imagem — quinas retas obrigatórias */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <Image
          src={imagemUrl}
          alt={produto.imagemCapa.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Tag de categoria */}
        <span className="
          absolute top-4 left-4 z-10
          bg-action-primary text-on-brand
          text-xs font-medium px-3 py-1 rounded-sm
          opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
          transition-all duration-300
        ">
          {CATEGORIA_LABELS[produto.categoria]}
        </span>
      </div>

      {/* Linha vermelha de corte — elemento técnico */}
      <div className="h-0.5 bg-action-primary" />

      {/* Conteúdo */}
      <div className="p-6">
        <h3 className="font-display text-2xl font-bold text-primary uppercase tracking-tight">
          {produto.nome}
        </h3>
        <p className="mt-2 text-sm text-secondary line-clamp-2 font-body">
          {produto.tagline}
        </p>

        {/* Badges de norma */}
        {produto.normasResumidas?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {produto.normasResumidas.map(norma => (
              <span
                key={norma.codigo}
                className="bg-surface-subtle text-muted text-xs px-2 py-1 rounded-sm border border-border-subtle"
              >
                {norma.codigo}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 h-px bg-border-subtle" />

        {/* Botões */}
        <div className="mt-4 flex gap-3">
          <Link
            href={`/produtos/${produto.slug}`}
            className="
              flex-1 text-center py-2.5 px-4
              bg-action-secondary text-primary border border-border-default
              text-sm font-semibold rounded-md
              hover:bg-surface-subtle transition-colors
            "
          >
            Ver Detalhes
          </Link>
          <Link
            href={`/fale-conosco?produto=${produto.slug}`}
            className="
              flex-1 text-center py-2.5 px-4
              bg-action-primary text-on-brand
              text-sm font-semibold rounded-md
              hover:bg-action-primary-hover transition-colors
            "
            style={{ boxShadow: 'var(--shadow-button-primary)' }}
          >
            Solicitar Orçamento
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
```

---

## 8. Filtro de Categorias

```typescript
// components/produtos/FiltroCategorias.tsx
'use client'

const CATEGORIAS = [
  { value: 'todos', label: 'Todos' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'conforto', label: 'Conforto' },
  { value: 'estetica', label: 'Estética' },
  { value: 'amplitude', label: 'Amplitude' },
]

export function FiltroCategorias({
  categoriaAtiva,
  onChange
}: {
  categoriaAtiva: string
  onChange: (categoria: string) => void
}) {
  return (
    <div className="
      sticky z-40 bg-surface-page border-b border-border-subtle
      px-16 py-4
    "
    style={{ top: 'var(--header-height, 72px)' }}
    >
      <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto scrollbar-none">
        {CATEGORIAS.map(cat => (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`
              whitespace-nowrap px-5 py-2 rounded-full
              text-sm font-medium transition-all duration-200
              ${categoriaAtiva === cat.value
                ? 'bg-action-primary text-on-brand font-semibold'
                : 'bg-surface-card text-secondary border border-border-default hover:bg-surface-subtle'
              }
            `}
            style={categoriaAtiva === cat.value
              ? { boxShadow: 'var(--shadow-button-primary)' }
              : undefined
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**URL com querystring ao filtrar** (para deep linking):
```typescript
// Adicionar no onChange do FiltroCategorias dentro do ProdutosGrid:
const router = useRouter()
const searchParams = useSearchParams()

const handleFiltro = (categoria: string) => {
  setCategoriaAtiva(categoria)
  const params = new URLSearchParams(searchParams)
  if (categoria === 'todos') {
    params.delete('categoria')
  } else {
    params.set('categoria', categoria)
  }
  router.replace(`/produtos?${params.toString()}`, { scroll: false })
}
```

---

## 9. Animações Framer Motion

### Regra geral

Animações da Lajeadense devem ser precisas e limpas — como o vidro. Cada animação tem função. Animação sem função é ruído.

### ✅ O que implementar

| Onde | Animação | Valores |
|---|---|---|
| Entrada dos cards no grid | Staggered fade + rise | `opacity: 0→1`, `y: 24→0`, `duration: 0.4`, `stagger: 0.07` |
| Hover no card | Elevação | `y: -4`, `duration: 0.2`, `ease: easeOut` |
| Filtro — reposicionamento | layout prop + AnimatePresence | `mode: popLayout`, `scale: 0.95→1` |
| Hero — título e subtítulo | Fade + rise na entrada | `y: 16→0`, `delay: 0/0.15`, `duration: 0.5` |
| Lightbox da galeria | Fade overlay + scale foto | overlay: `opacity 0.2s`, foto: `scale 0.96→1` |
| Acordeão de specs (mobile) | Height animado | `height: 0→auto`, `duration: 0.25` |
| FAB de orçamento (mobile) | Fade + scale ao scroll | Aparece após 30% de scroll |

### ❌ O que nunca usar

`rotate`, `scale(1.05)` em cards com imagem, parallax na listagem, pulse/ping em badges, bounce com spring exagerado, animações em loop, fade acima de 600ms, cursor customizado, transições de rota com slide horizontal.

---

## 10. Rota /produtos/[slug] — Página de Produto

### Implementação da página

```typescript
// app/produtos/[slug]/page.tsx

import { client } from '@/lib/sanity'
import { PRODUTO_QUERY, PRODUTOS_SLUGS_QUERY, PRODUTOS_RELACIONADOS_QUERY } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch(PRODUTOS_SLUGS_QUERY)
  return slugs.map((item: { slug: string }) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const produto = await client.fetch(PRODUTO_QUERY, { slug: params.slug })
  if (!produto) return {}

  const title = produto.seo?.metaTitle || `${produto.nome} | Lajeadense Vidros`
  const description = produto.seo?.metaDescription || produto.descricaoBreve
  const imageUrl = urlFor(produto.imagemCapa).width(1200).height(630).url()

  return {
    title,
    description,
    alternates: { canonical: `https://lajeadensevidros.com.br/produtos/${params.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default async function PaginaProduto({ params }: { params: { slug: string } }) {
  const [produto, relacionados] = await Promise.all([
    client.fetch(PRODUTO_QUERY, { slug: params.slug }),
    client.fetch(PRODUTOS_RELACIONADOS_QUERY, { slugAtual: params.slug }),
  ])

  if (!produto) notFound()

  return <ProdutoDetalheView produto={produto} relacionados={relacionados} />
}
```

### Layout Desktop — Split 40/60

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER FIXO                                                        │
├─────────────────────────────────────────────────────────────────────┤
│  BREADCRUMB · surface-page · px-16 · py-4                          │
│  Início / Produtos / Duoglass · text-xs · text-muted              │
├──────────────────────────┬──────────────────────────────────────────┤
│   COLUNA ESQUERDA 40%    │   COLUNA DIREITA 60%                     │
│   pl-16 pr-12 py-16      │   (sticky · sem padding lateral)         │
│                          │                                          │
│  [linha 2px action-prim] │  ┌─ VIEWER 3D ─────────────────────┐   │
│  CATEGORIA               │  │  aspect-ratio: 16/10              │   │
│  text-xs · uppercase     │  │  bg: surface-section              │   │
│  tracking-widest         │  │  radius-none                      │   │
│                          │  │  OrbitControls · autoRotate       │   │
│  NOME DO PRODUTO         │  │  (ver seção 11)                   │   │
│  Barlow Condensed        │  └───────────────────────────────────┘  │
│  text-4xl · bold · upper │                                          │
│                          │  GALERIA · grid 2 cols · gap-2          │
│  TAGLINE                 │  ┌──────────────┐ ┌──────────────┐      │
│  text-lg · text-second.  │  │ foto 1       │ │ foto 2       │      │
│  mt-4                    │  │ (col-span-2) │ │              │      │
│                          │  └──────────────┘ └──────────────┘      │
│  ── border-subtle ──     │  ┌──────────────┐ ┌──────────────┐      │
│                          │  │ foto 3       │ │ foto 4       │      │
│  DESCRIÇÃO COMPLETA      │  └──────────────┘ └──────────────┘      │
│  PortableText            │  (clique → lightbox fullscreen)          │
│  text-base · leading-rel │                                          │
│                          │                                          │
│  ESPECIFICAÇÕES          │                                          │
│  surface-subtle·radius-lg│                                          │
│  [ícone SVG técnico]     │                                          │
│  diagrama corte transv.  │                                          │
│                          │                                          │
│  NORMAS ABNT             │                                          │
│  [linha 2px vermelha]    │                                          │
│  cards por norma         │                                          │
│                          │                                          │
│  APLICAÇÕES TÍPICAS      │                                          │
│  chips · surface-subtle  │                                          │
│                          │                                          │
│  ── border-subtle ──     │                                          │
│                          │                                          │
│  [Ver Catálogo]          │  ← Secondary                            │
│  [Solicitar Orçamento]   │  ← Primary (vermelho) · mt-8            │
│  flex-col · gap-3        │     href: /fale-conosco?produto=slug     │
│                          │                                          │
├──────────────────────────┴──────────────────────────────────────────┤
│  CTA FINAL · action-strong · full width · padding: space-20        │
│  "Pronto para especificar este produto no seu projeto?"             │
│  Barlow Condensed · text-3xl · text-on-dark · text-center          │
│  [Solicitar Orçamento] ← botão vermelho centralizado               │
├─────────────────────────────────────────────────────────────────────┤
│  PRODUTOS RELACIONADOS · surface-section                            │
│  "Outros produtos para o seu projeto"                               │
│  3 cards (mesmos do grid) · sem filtro                              │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### CSS do Split Layout com coluna direita sticky

```typescript
// Tailwind classes para o split layout
<div className="grid lg:grid-cols-[2fr_3fr] min-h-screen items-start">

  {/* Coluna esquerda — scroll normal */}
  <div className="pl-16 pr-12 py-16">
    {/* conteúdo técnico */}
  </div>

  {/* Coluna direita — sticky */}
  <div
    className="lg:sticky overflow-y-auto"
    style={{
      top: 'var(--header-height, 72px)',
      maxHeight: 'calc(100vh - var(--header-height, 72px))'
    }}
  >
    <Viewer3D modelUrl={produto.modelo3dUrl} />
    <Galeria fotos={produto.galeria} />
  </div>
</div>
```

### Renderizando o conteúdo rich text (Portable Text)

O campo `descricaoCompleta` é Portable Text (rich text do Sanity). Instalar o renderer:

```bash
npm install @portabletext/react
```

```typescript
import { PortableText } from '@portabletext/react'

// Customizar a renderização para seguir o design system
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-base text-secondary leading-relaxed mb-4 font-body">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-display text-2xl font-bold text-primary uppercase mt-8 mb-3">
        {children}
      </h2>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
  },
}

// Uso:
<PortableText value={produto.descricaoCompleta} components={portableTextComponents} />
```

### Diagrama SVG Técnico (obrigatório por produto)

O design system é explícito: cards sem diagrama técnico estão incompletos. Cada produto tem um SVG específico que representa sua estrutura. Esses SVGs são componentes React fixos no código (não editáveis pelo cliente — são técnicos e conceituais).

```typescript
// components/diagramas/DiagramaDuoGlass.tsx
// Corte transversal mostrando: vidro / câmara de ar / vidro com cotas

export function DiagramaDuoGlass() {
  return (
    <svg viewBox="0 0 280 120" className="w-full h-auto" aria-label="Diagrama de corte do Duoglass">
      {/* Vidro externo */}
      <rect x="10" y="20" width="20" height="80" fill="#C8D8E8" opacity="0.8" />
      <text x="6" y="115" fontSize="8" fill="#9B9B9B" fontFamily="DM Sans">Vidro</text>

      {/* Câmara de ar */}
      <rect x="30" y="20" width="60" height="80" fill="#EBEBEA" stroke="#DDDCDA" strokeWidth="0.5" />
      <text x="32" y="62" fontSize="7" fill="#9B9B9B" fontFamily="DM Sans">Câmara</text>
      <text x="34" y="72" fontSize="7" fill="#9B9B9B" fontFamily="DM Sans">de ar</text>

      {/* Sílica gel (espaçador) */}
      <rect x="28" y="18" width="4" height="84" fill="#4B4B4B" />
      <rect x="88" y="18" width="4" height="84" fill="#4B4B4B" />

      {/* Vidro interno */}
      <rect x="92" y="20" width="20" height="80" fill="#C8D8E8" opacity="0.8" />
      <text x="88" y="115" fontSize="8" fill="#9B9B9B" fontFamily="DM Sans">Vidro</text>

      {/* Cota espessura câmara */}
      <line x1="30" y1="10" x2="90" y2="10" stroke="#C8102E" strokeWidth="0.8" markerEnd="url(#arrow)" />
      <text x="50" y="8" fontSize="7" fill="#C8102E" fontFamily="DM Sans">6–20mm</text>

      {/* Label */}
      <text x="130" y="40" fontSize="9" fill="#0D0D0D" fontFamily="Barlow Condensed" fontWeight="700">
        CORTE TRANSVERSAL
      </text>
      <text x="130" y="55" fontSize="8" fill="#4B4B4B" fontFamily="DM Sans">
        Dupla câmara com perfil
      </text>
      <text x="130" y="67" fontSize="8" fill="#4B4B4B" fontFamily="DM Sans">
        espaçador de alumínio
      </text>
    </svg>
  )
}
```

**Mapeamento de diagramas por produto:**

```typescript
// components/diagramas/index.ts
import { DiagramaDuoGlass } from './DiagramaDuoGlass'
import { DiagramaFortGlass } from './DiagramaFortGlass'
// ... demais diagramas

export const DIAGRAMAS: Record<string, React.ComponentType> = {
  'duo-glass': DiagramaDuoGlass,
  'fort-glass-multilaminado': DiagramaFortGlass,
  'vidro-laminado': DiagramaLaminado,
  'habitat-protecao-solar': DiagramaHabitat,
  'vidro-polarizado': DiagramaPolarizado,
  'duplo-pinazio': DiagramaDuploPinazio,
  // Demais produtos: DiagramaGenerico (silhueta do produto em contexto)
}

// Uso na página de produto:
const DiagramaComponente = DIAGRAMAS[produto.slug] || DiagramaGenerico
```

---

## 11. Objeto 3D — GLB via Sanity

### Como o arquivo .glb chega do Sanity

A query GROQ já retorna a URL do arquivo:

```typescript
// Na query PRODUTO_QUERY:
"modelo3dUrl": modelo3d.asset->url

// Resultado:
produto.modelo3dUrl = "https://cdn.sanity.io/files/[projectId]/production/[hash].glb"
```

É uma URL HTTPS pública permanente. Você passa diretamente para o `useGLTF`.

### Dependências

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### Componente Viewer3D completo

```typescript
// components/produtos/Viewer3D.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'

function Modelo({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function Viewer3DSkeleton() {
  return (
    <div
      className="w-full bg-surface-section flex items-center justify-center"
      style={{ aspectRatio: '16/10' }}
    >
      <span className="text-sm text-muted font-body animate-pulse">
        Carregando modelo 3D...
      </span>
    </div>
  )
}

export function Viewer3D({ modelUrl }: { modelUrl: string }) {
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar suporte WebGL
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) setWebGLSupported(false)
  }, [])

  // Fallback: sem WebGL ou não montado
  if (!mounted || !webGLSupported) {
    return <Viewer3DSkeleton />
  }

  return (
    <div className="relative w-full" style={{ aspectRatio: '16/10', background: '#EBEBEA' }}>

      {/* Instrução de interação */}
      <div className="
        absolute bottom-3 left-0 right-0 flex justify-center z-10 pointer-events-none
      ">
        <span className="
          text-xs text-muted bg-surface-card/80 backdrop-blur-sm
          px-3 py-1 rounded-full font-body
        ">
          Arraste para rotacionar · Scroll para zoom
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          {/* Iluminação — ambiente de showroom técnico */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-3, 3, -3]} intensity={0.3} />

          {/* Environment HDRI — reflexos realistas no vidro */}
          <Environment preset="warehouse" />

          {/* Modelo .glb da URL do Sanity */}
          <Modelo url={modelUrl} />

          {/* Sombra de contato — ancora o modelo */}
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.3}
            scale={4}
            blur={2}
            far={1.5}
          />

          {/* Controles de câmera */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={1.5}
            maxDistance={6}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            autoRotate={true}
            autoRotateSpeed={0.8}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

### Carregamento lazy do Viewer (obrigatório para LCP)

```typescript
// O Canvas NÃO deve bloquear o LCP da imagem de capa
// Carregar com lazy import apenas quando a coluna direita estiver no viewport

import dynamic from 'next/dynamic'

const Viewer3D = dynamic(
  () => import('@/components/produtos/Viewer3D').then(mod => mod.Viewer3D),
  {
    ssr: false,                       // Three.js não funciona no servidor
    loading: () => <Viewer3DSkeleton />
  }
)
```

### Pré-carregamento do modelo (performance)

```typescript
// Na página do produto, pré-carregar o .glb assim que o slug é conhecido
// Reduz o tempo de exibição do skeleton
useGLTF.preload(produto.modelo3dUrl)
```

---

## 12. SEO Completo

### Meta tags dinâmicas (geradas a partir dos dados do Sanity)

```typescript
// app/produtos/[slug]/page.tsx — função generateMetadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const produto = await client.fetch(PRODUTO_QUERY, { slug: params.slug })

  // Fallback inteligente: se o cliente não preencher o SEO no Sanity,
  // usa os campos de conteúdo como fallback
  const title = produto.seo?.metaTitle
    || `${produto.nome} | Lajeadense Vidros`

  const description = produto.seo?.metaDescription
    || produto.descricaoBreve

  return {
    title,
    description,
    alternates: {
      canonical: `https://lajeadensevidros.com.br/produtos/${params.slug}`
    },
    openGraph: {
      title,
      description,
      images: [{ url: urlFor(produto.imagemCapa).width(1200).height(630).url() }],
      type: 'website',
      locale: 'pt_BR',
    },
    other: {
      'og:site_name': 'Lajeadense Vidros',
    }
  }
}
```

### Schema JSON-LD dinâmico

```typescript
// components/produtos/ProdutoJsonLd.tsx
export function ProdutoJsonLd({ produto }: { produto: ProdutoDetalhe }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.nome,
    description: produto.descricaoBreve,
    brand: { '@type': 'Brand', name: 'Lajeadense Vidros' },
    category: produto.categoria,
    url: `https://lajeadensevidros.com.br/produtos/${produto.slug}`,
    image: produto.galeria.map(foto => foto.asset.url),
    manufacturer: {
      '@type': 'Organization',
      name: 'Lajeadense Vidros',
      url: 'https://lajeadensevidros.com.br',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'BRL',
      seller: { '@type': 'Organization', name: 'Lajeadense Vidros' },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

### BreadcrumbList Schema

```typescript
export function BreadcrumbJsonLd({ produto }: { produto: ProdutoDetalhe }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://lajeadensevidros.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://lajeadensevidros.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: produto.nome, item: `https://lajeadensevidros.com.br/produtos/${produto.slug}` },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

### Hierarquia de Headings

```
/produtos
  H1: "Nossa Linha de Produtos" (único H1 da página)
  H2: nome de cada categoria (se renderizados como títulos)
  H3: nome de cada produto nos cards

/produtos/[slug]
  H1: nome do produto (ex: "Duoglass — Vidro Duplo Termoacústico")
  H2: "Especificações Técnicas"
  H2: "Normas e Certificações"
  H2: "Aplicações Típicas"
  H2: "Produtos Relacionados"
```

### Alt text — regras para o cliente

Os campos `alt` são obrigatórios no schema do Sanity (`validation: Rule.required()`). No Studio, o cliente vê a instrução: *"Descreva a imagem com o nome do produto. Ex: Vidro duplo Duoglass instalado em fachada residencial"*.

### Sitemap dinâmico

```typescript
// app/sitemap.ts
import { client } from '@/lib/sanity'
import { PRODUTOS_SLUGS_QUERY } from '@/lib/queries'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await client.fetch(PRODUTOS_SLUGS_QUERY)

  const produtoUrls = slugs.map(({ slug }: { slug: string }) => ({
    url: `https://lajeadensevidros.com.br/produtos/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://lajeadensevidros.com.br', priority: 1.0 },
    { url: 'https://lajeadensevidros.com.br/produtos', changeFrequency: 'monthly', priority: 0.9 },
    ...produtoUrls,
  ]
}
```

---

## 13. Performance e Core Web Vitals

### LCP (meta: < 2.5s)

```typescript
// Imagem de capa com priority — carrega antes do JS (crítico para LCP)
<Image
  src={urlFor(produto.imagemCapa).width(1200).height(900).format('webp').quality(85).url()}
  alt={produto.imagemCapa.alt}
  fill
  priority
  sizes="(max-width: 1024px) 100vw, 60vw"
/>

// Viewer3D carregado com next/dynamic + ssr: false
// Não bloqueia a renderização da imagem de capa
```

### CLS (meta: < 0.1)

```typescript
// Sempre reservar espaço antes de carregar imagens
<div className="relative" style={{ aspectRatio: '4/3' }}>
  <Image fill ... />
</div>

// Viewer3D: skeleton com mesmo aspect-ratio do Canvas
<div style={{ aspectRatio: '16/10' }}>
  <Suspense fallback={<div style={{ aspectRatio: '16/10' }} />}>
    <Viewer3D />
  </Suspense>
</div>
```

### Imagens via Sanity CDN com transformação on-the-fly

```typescript
// Thumbnail para card — 600×450px webp q85
urlFor(produto.imagemCapa).width(600).height(450).format('webp').quality(85).url()

// Capa na página de produto — 1200×900px webp q85
urlFor(produto.imagemCapa).width(1200).height(900).format('webp').quality(85).url()

// Open Graph — proporção específica 1200×630
urlFor(produto.imagemCapa).width(1200).height(630).format('webp').quality(85).url()
```

A CDN do Sanity processa essas transformações automaticamente. Você não precisa de nenhuma configuração adicional de processamento de imagem.

---

## 14. Mobile

### Rota /produtos no mobile

```
BREADCRUMB
HERO COMPACTO (min-h: 220px · bg: action-strong)
FILTRO STICKY (scroll horizontal · chips · scrollbar: none)
GRID 1 COLUNA (cards em coluna única · aspect: 16/9 na imagem)
  Botões: flex-row · flex-1 cada
CTA FINAL
FOOTER
```

### Rota /produtos/[slug] no mobile

```
BREADCRUMB
NOME + CATEGORIA (Barlow Condensed · text-3xl)
VIEWER 3D (100vw · aspecto 1/1 · sangra as bordas · margem negativa)
GALERIA (1 coluna)
DESCRIÇÃO COMPLETA
ESPECIFICAÇÕES (acordeão animado via Framer Motion)
NORMAS ABNT
APLICAÇÕES (chips em wrapping)
[Solicitar Orçamento] (100% largura)
PRODUTOS RELACIONADOS (scroll horizontal — não stack vertical)
FAB flutuante de orçamento (aparece após 30% de scroll)
```

### Acordeão nas especificações

```typescript
// components/produtos/EspecificacoesAcordiao.tsx — apenas mobile
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function EspecificacoesAcordiao({ especificacoes }: { especificacoes: { label: string; valor: string }[] }) {
  const [aberto, setAberto] = useState(true)  // primeiro item aberto por padrão

  return (
    <div className="lg:hidden">  {/* só aparece no mobile */}
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full flex justify-between items-center py-4 text-left"
      >
        <span className="text-xs uppercase tracking-widest font-semibold text-action-primary">
          Especificações Técnicas
        </span>
        <span className="text-muted">{aberto ? '−' : '+'}</span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: aberto ? 'auto' : 0, opacity: aberto ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ overflow: 'hidden' }}
      >
        {especificacoes.map(spec => (
          <div key={spec.label} className="flex justify-between py-2 border-b border-border-subtle">
            <span className="text-sm text-muted">{spec.label}</span>
            <span className="text-sm text-primary font-medium">{spec.valor}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
```

---

## 15. O Que o Cliente Consegue Editar

Esta seção é para documentar ao cliente o que ele pode e não pode alterar no Sanity Studio.

### ✅ Editável pelo cliente no Sanity Studio

| Campo | O que é | Como editar |
|---|---|---|
| Nome do produto | Texto | Campo de texto simples |
| Tagline | Texto curto | Campo de texto (máx. 100 chars) |
| Descrição breve | Texto médio | Campo de texto (máx. 200 chars) |
| Descrição completa | Rich text | Editor visual (negrito, parágrafos, listas) |
| Especificações técnicas | Pares label/valor | Adicionar, editar, remover, reordenar |
| Normas ABNT | Código + descrição | Adicionar, editar, remover |
| Aplicações | Lista de texto | Adicionar, editar, remover |
| Imagem de capa | Foto | Upload (jpg/png/webp) · ponto focal ajustável |
| Galeria de fotos | Múltiplas fotos | Upload, reordenar, remover |
| Modelo 3D | Arquivo .glb | Upload (substituir o arquivo) |
| Categoria | Seleção | Radio button (4 opções) |
| Ordem de exibição | Número | Campo numérico |
| Meta title (SEO) | Texto | Campo de texto (máx. 60 chars) |
| Meta description (SEO) | Texto | Campo de texto (máx. 155 chars) |

### ❌ Não editável pelo cliente (definido no código)

| Elemento | Por que não editável |
|---|---|
| Slug/URL | Mudança pós-indexação quebra SEO |
| Diagrama SVG técnico | É um componente React por produto — editar precisaria de desenvolvimento |
| Layout e design | É estrutura de código |
| Esquema de cores | Definido no design system |
| Animações | Definidas no código |

### Como o cliente acessa o Studio

URL de produção: `https://lajeadensevidros.com.br/studio`

O cliente precisa de uma conta no Sanity com acesso ao projeto. Para criar:
1. Acessar [sanity.io/manage](https://sanity.io/manage)
2. Selecionar o projeto → Members → Invite
3. Inserir o email do cliente
4. Permissão: **Editor** (pode criar e editar, mas não configura o projeto)

---

## 16. Checklist Final de Implementação

### Fase 1 — Setup Sanity (antes de qualquer código de UI)
- [ ] Conta Sanity criada em sanity.io
- [ ] Projeto criado via `npm create sanity@latest` na raiz do Next.js
- [ ] Schema `produto.ts` criado com todos os campos definidos
- [ ] Schema registrado no `sanity.config.ts`
- [ ] Dependências instaladas: `next-sanity`, `@sanity/image-url`
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Cliente Sanity criado em `lib/sanity.ts`
- [ ] Studio embutido no Next.js em `app/studio/[[...tool]]/page.tsx`
- [ ] Studio acessível em `localhost:3000/studio`
- [ ] 12 produtos cadastrados e publicados no Studio com todos os campos

### Fase 2 — Rota /produtos
- [ ] Queries GROQ criadas em `lib/queries.ts`
- [ ] Tipos TypeScript criados em `lib/types.ts`
- [ ] `revalidate = 60` na página
- [ ] Hero compacto em `action-strong` com Barlow Condensed
- [ ] Filtro sticky com AnimatePresence + layout prop
- [ ] URL atualiza com `?categoria=` ao filtrar
- [ ] `noindex` em URLs com querystring
- [ ] Grid 3/2/1 colunas
- [ ] Cards com `radius-none` nas imagens, `radius-xl` no card
- [ ] Borda-top vermelha 2px no card
- [ ] Hover overlay com tag de categoria (CSS transition)
- [ ] Hover elevação via Framer Motion
- [ ] Staggered animation na entrada dos cards (`once: true`)
- [ ] Botão orçamento com `?produto=slug` na querystring
- [ ] Meta tags da listagem
- [ ] Canonical apontando para `/produtos`

### Fase 3 — Rota /produtos/[slug]
- [ ] `generateStaticParams` com todos os slugs do Sanity
- [ ] `generateMetadata` com fallback inteligente
- [ ] `revalidate = 60`
- [ ] `notFound()` para slugs inexistentes
- [ ] Split layout 40/60 com coluna direita sticky
- [ ] H1 com nome técnico do produto
- [ ] Linha vermelha + categoria + nome + tagline na coluna esquerda
- [ ] PortableText renderizado com estilos do design system
- [ ] Diagrama SVG técnico específico por produto
- [ ] Especificações com `surface-subtle` e ícones
- [ ] Normas ABNT com linha vermelha
- [ ] Aplicações em chips
- [ ] CTAs (Ver Catálogo + Solicitar Orçamento) no final da coluna esquerda
- [ ] Viewer3D com `dynamic` import (`ssr: false`)
- [ ] Viewer3D: skeleton com mesmo aspect-ratio, fallback sem WebGL
- [ ] Galeria: primeira foto col-span-2, restantes em grid 2 cols
- [ ] Lightbox com Framer Motion
- [ ] CTA final em `action-strong`
- [ ] Produtos relacionados (3 cards)
- [ ] JSON-LD Product schema
- [ ] BreadcrumbList schema
- [ ] Alt text em todas as imagens (`priority` na capa)
- [ ] Aspect-ratio definido em todos os containers de imagem (CLS)
- [ ] Mobile: acordeão nas specs, viewer 100vw, FAB

### Fase 4 — SEO e Performance
- [ ] Sitemap dinâmico em `app/sitemap.ts`
- [ ] `robots.txt` correto
- [ ] Imagens servidas via `urlFor()` com `.format('webp').quality(85)`
- [ ] `<Image priority />` na imagem de destaque de cada produto
- [ ] LCP < 2.5s verificado no Lighthouse
- [ ] CLS < 0.1 verificado no Lighthouse
- [ ] Schema JSON-LD validado em [schema.org/validator](https://validator.schema.org)

---

*Documento de referência interno — Lajeadense Vidros · Versão 2.0 (com Sanity CMS)*
*Versão anterior: rota-produtos-lajeadense.md (sem Sanity — descontinuado)*
