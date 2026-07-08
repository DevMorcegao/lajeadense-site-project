import { defineField, defineType } from 'sanity'

export const homeImagesSchema = defineType({
  name: 'homeImages',
  title: 'Imagens da Home',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de Referência',
      type: 'string',
      initialValue: 'Configuração de Imagens da Home',
      readOnly: true,
    }),
    defineField({
      name: 'imagemSobre',
      title: 'Imagem da Seção Quem Somos (Sobre)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'imagemCategoriaConforto',
      title: 'Imagem da Categoria Conforto',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'imagemCategoriaSeguranca',
      title: 'Imagem da Categoria Segurança',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'imagemCategoriaEstetica',
      title: 'Imagem da Categoria Estética',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({
      name: 'imagemCategoriaAmplitude',
      title: 'Imagem da Categoria Amplitude',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    }),
  ],
})
