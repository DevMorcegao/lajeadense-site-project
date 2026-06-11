import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy para arquivos .glb do Sanity CDN.
 * O browser não consegue buscar diretamente cdn.sanity.io por CORS,
 * então o servidor busca e repassa com os headers corretos.
 *
 * Uso: /api/model?url=https://cdn.sanity.io/files/...glb
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  // Validação básica de segurança — só permite URLs do Sanity CDN
  if (!url || !url.startsWith('https://cdn.sanity.io/')) {
    return new NextResponse('URL inválida', { status: 400 })
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        // Passa o token caso o arquivo seja privado
        ...(process.env.SANITY_API_TOKEN
          ? { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` }
          : {}),
      },
      // Importante: no servidor não há restrição de CORS
      cache: 'force-cache',
    })

    if (!upstream.ok) {
      return new NextResponse(`Erro ao buscar modelo: ${upstream.statusText}`, {
        status: upstream.status,
      })
    }

    const buffer = await upstream.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        // Cache agressivo — os modelos não mudam com frequência
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('[/api/model] Erro ao proxy do modelo 3D:', err)
    return new NextResponse('Erro interno', { status: 500 })
  }
}
