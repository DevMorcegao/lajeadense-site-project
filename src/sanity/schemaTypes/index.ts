import { type SchemaTypeDefinition } from 'sanity'
import { produtoSchema } from './produtoType'
import { portfolioSchema } from './portfolioType'
import { homeImagesSchema } from './homeImagesType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [produtoSchema, portfolioSchema, homeImagesSchema],
}
