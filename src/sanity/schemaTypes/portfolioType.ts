import { defineField, defineType } from 'sanity'

export const portfolioSchema = defineType({
  name: 'portfolio',
  title: 'Portfólio',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nome da Categoria',
      type: 'string',
      description: 'Ex: Cabines de Banho, Fachadas Comerciais, Coberturas',
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Defina a ordem das categorias (1 = primeiro)',
      validation: (Rule: any) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição da Categoria',
      type: 'text',
      rows: 3,
      description: 'Texto descritivo sobre esta categoria de obras. Se deixado em branco, será usado um texto padrão.',
    }),
    defineField({
      name: 'imagens',
      title: 'Fotos da Categoria',
      type: 'array',
      validation: (Rule: any) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'portfolioItem',
          title: 'Item do Portfólio',
          fields: [
            defineField({
              name: 'imagem',
              title: 'Imagem da Obra',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Texto Alternativo (SEO/Descrição)',
              type: 'string',
              description: 'Breve descrição da foto. Ex: Box de banheiro com vidro temperado em apartamento em Porto Alegre',
              validation: (Rule: any) => Rule.required(),
            }),
            defineField({
              name: 'produto',
              title: 'Produto Relacionado',
              type: 'reference',
              to: [{ type: 'produto' }],
              description: 'Selecione o produto Lajeadense utilizado nesta obra.',
              validation: (Rule: any) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'imagem',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'descricao',
      media: 'imagens.0.imagem',
    },
  },
})
