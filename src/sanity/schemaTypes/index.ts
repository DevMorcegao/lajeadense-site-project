import { type SchemaTypeDefinition } from 'sanity'
import { produtoSchema } from './produtoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [produtoSchema],
}
