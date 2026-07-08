import { defineField, defineType } from 'sanity'

export const produtoSchema = defineType({
  name: 'produto',
  title: 'Produtos',
  type: 'document',
  fields: [

    // ─── IDENTIFICAÇÃO ────────────────────────────────────────────────
    defineField({
      name: 'nome',
      title: 'Nome do Produto',
      type: 'string',
      description: 'Ex: Duoglass — Vidro Duplo Termoacústico',
      validation: (Rule: any) => Rule.required().max(80),
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Número que define a posição no grid (1 = primeiro). Use para reordenar.',
      validation: (Rule: any) => Rule.required().integer().positive(),
    }),

    // ─── TEXTOS ───────────────────────────────────────────────────────
    defineField({
      name: 'tagline',
      title: 'Tagline (frase curta para o card)',
      type: 'string',
      description: 'Máx. 100 caracteres. Aparece no card do grid.',
      validation: (Rule: any) => Rule.required().max(100),
    }),

    defineField({
      name: 'descricaoCompleta',
      title: 'Descrição Completa',
      type: 'array',
      of: [{ type: 'block' }],  // Texto rico (negrito, links, parágrafos)
      description: 'Texto completo exibido na página do produto.',
      validation: (Rule: any) => Rule.required(),
    }),

    // ─── ESPECIFICAÇÕES TÉCNICAS ──────────────────────────────────────
    defineField({
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
    }),

    // ─── NORMAS ABNT ──────────────────────────────────────────────────
    defineField({
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
    }),

    // ─── APLICAÇÕES ───────────────────────────────────────────────────
    defineField({
      name: 'aplicacoes',
      title: 'Aplicações Típicas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: Fachadas Residenciais, Coberturas, Divisórias...',
    }),

    // ─── IMAGENS ──────────────────────────────────────────────────────
    defineField({
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
    }),
    defineField({
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
      description: 'Mínimo 2 fotos. No campo SEO utilize uma descrição válida ou simplesmente "Teste".',
      validation: (Rule: any) => Rule.min(2),
    }),

    // ─── MODELO 3D ────────────────────────────────────────────────────
    defineField({
      name: 'modelo3d',
      title: 'Modelo 3D (.glb)',
      type: 'file',
      description: 'Arquivo .glb do modelo 3D do produto. Máx. recomendado: 2MB.',
      options: {
        accept: '.glb',  // restringe o upload apenas a arquivos .glb
      },
      validation: (Rule: any) => Rule.required(),
    }),

    // ─── SEO ──────────────────────────────────────────────────────────
    defineField({
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
    }),

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
})
