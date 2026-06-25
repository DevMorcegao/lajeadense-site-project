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

// Query para buscar as categorias e fotos do Portfólio do Sanity
export const PORTFOLIO_QUERY = `
  *[_type == "portfolio"] | order(ordem asc) {
    _id,
    titulo,
    "slug": slug.current,
    descricao,
    imagens[] {
      "id": _key,
      alt,
      imagem {
        asset->{url, _id},
        hotspot,
        crop
      },
      produto-> {
        nome,
        "slug": slug.current
      }
    }
  }
`

// Query simplificada de produtos para o formulário de contato
export const PRODUTOS_CONTATO_QUERY = `
  *[_type == "produto"] | order(nome asc) {
    _id,
    nome,
    "slug": slug.current
  }
`

