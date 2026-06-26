'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'
import { Plus, Minus } from 'lucide-react'

/**
 * Sanity CDN não envia headers CORS para domínios externos.
 * Em produção, roteamos os .glb pelo proxy Next.js /api/model
 * que busca no servidor (sem restrição CORS) e repassa ao browser.
 */
function getModelUrl(url: string): string {
  if (url.startsWith('https://cdn.sanity.io/')) {
    return `/api/model?url=${encodeURIComponent(url)}`
  }
  return url
}

const CORES_PALETA = [
  { nome: 'Azul Real', hex: '#0B66C3' },
  { nome: 'Vermelho Terracota', hex: '#E25238' },
  { nome: 'Verde Vibrante', hex: '#26C26D' },
  { nome: 'Amarelo Ouro', hex: '#F6CD3B' },
  { nome: 'Preto Absoluto', hex: '#1A1A1A' },
  { nome: 'Marrom Tabaco', hex: '#8E4A23' },
]

/* ─── Modelo 3D base ─── */
function Modelo({
  url,
  colorOverride,
  isConfigurable,
  isPolarizable,
  isExtraClear,
  frosted,
}: {
  url: string
  colorOverride?: string
  isConfigurable?: boolean
  isPolarizable?: boolean
  isExtraClear?: boolean
  frosted?: boolean
}) {
  const { scene } = useGLTF(getModelUrl(url))
  const classifiedRef = useRef(false)

  useEffect(() => {
    // ── FASE 1: Classificar malhas (executa UMA VEZ por carregamento do modelo) ──
    if (!classifiedRef.current) {
      classifiedRef.current = true

      let foundPainted = false
      let extraClearIndex = 0

      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return

        const mat = child.material as THREE.Material
        const nameLower = (child.name || '').toLowerCase()
        const matNameLower = (mat.name || '').toLowerCase()

        const hasGlassName =
          nameLower.includes('glass') ||
          nameLower.includes('vidro') ||
          nameLower.includes('transp') ||
          nameLower.includes('silica') ||
          matNameLower.includes('glass') ||
          matNameLower.includes('vidro') ||
          matNameLower.includes('transp')

        const isOriginallyTransparent =
          (mat.transparent && mat.opacity < 0.9) ||
          ((mat as any).transmission && (mat as any).transmission > 0)

        let hasCustomColor = false
        if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
          const c = mat.color
          const isNeutral = Math.abs(c.r - c.g) < 0.08 && Math.abs(c.g - c.b) < 0.08 && c.r > 0.6
          if (!isNeutral) {
            hasCustomColor = true
          }
        }

        const isGlass = hasGlassName || isOriginallyTransparent

        if (isGlass) {
          if (hasCustomColor && isConfigurable) {
            child.userData.isPaintedPanel = true
            foundPainted = true
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              child.userData.originalColor = mat.color.getHexString()
            }
          } else if (isExtraClear) {
            // Para Extra Clear: primeiro vidro = extra clear, restante = vidro normal
            if (extraClearIndex === 0) {
              child.userData.isExtraClearGlass = true
            } else {
              child.userData.isTransparentGlass = true
            }
            extraClearIndex++
          } else {
            child.userData.isTransparentGlass = true
          }
        } else {
          child.userData.isOtherMesh = true
        }
      })

      // Fallback para produtos configuráveis onde o modelo não tem cores pré-saturadas:
      // promover TODAS as partes de vidro transparente a painéis pintáveis para que o seletor de cores funcione
      if (isConfigurable && !foundPainted) {
        let promoted = false
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.isTransparentGlass) {
            child.userData.isTransparentGlass = false
            child.userData.isPaintedPanel = true
            promoted = true
            const mat = child.material
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              child.userData.originalColor = mat.color.getHexString()
            } else {
              child.userData.originalColor = 'cccccc'
            }
          }
        })

        // Segundo nível de fallback: se nenhum vidro foi detectado (modelo não tem nomes de vidro
        // ou transparência), encontrar as maiores malhas e promovê-las a pintáveis
        if (!promoted) {
          const meshes: { mesh: THREE.Mesh; area: number }[] = []
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.userData.isOtherMesh) {
              const geo = child.geometry
              geo.computeBoundingBox()
              const bb = geo.boundingBox
              if (bb) {
                const size = new THREE.Vector3()
                bb.getSize(size)
                const area = size.x * size.y + size.y * size.z + size.x * size.z
                meshes.push({ mesh: child, area })
              }
            }
          })

          // Ordenar por área de superfície decrescente — as maiores malhas são os painéis de vidro
          meshes.sort((a, b) => b.area - a.area)

          // Promover as principais malhas (até metade do total, no mínimo 1) como painéis pintáveis
          const count = Math.max(1, Math.ceil(meshes.length / 2))
          for (let i = 0; i < Math.min(count, meshes.length); i++) {
            const child = meshes[i].mesh
            child.userData.isOtherMesh = false
            child.userData.isPaintedPanel = true
            const mat = child.material
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              child.userData.originalColor = mat.color.getHexString()
            } else {
              child.userData.originalColor = 'cccccc'
            }
          }
        }
      }
    }

    // ── FASE 2: Aplicar materiais (executa a cada mudança de colorOverride / fosco) ──
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      if (child.userData.isExtraClearGlass) {
        // Vidro Extra Clear — ultra transparente, sem tom esverdeado
        child.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0xfcfcfc),
          transparent: true,
          opacity: 0.2,
          roughness: 0.02,
          metalness: 0.0,
          transmission: 0.97,
          ior: 1.52,
          thickness: 0.3,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
        child.castShadow = true
        child.receiveShadow = true
      } else if (child.userData.isTransparentGlass) {
        // Para produtos polarizáveis: alternar entre transparente e fosco
        if (isPolarizable && frosted) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xf0f0f0),
            transparent: true,
            opacity: 0.92,
            roughness: 0.85,
            metalness: 0.0,
            transmission: 0.05,
            ior: 1.52,
            thickness: 0.6,
            clearcoat: 0.3,
            clearcoatRoughness: 0.6,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        } else {
          // Material de vidro premium padrão (com tom esverdeado para vidro normal)
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xd5e8eb),
            transparent: true,
            opacity: 0.45,
            roughness: 0.05,
            metalness: 0.1,
            transmission: 0.9,
            ior: 1.52,
            thickness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        }
        child.castShadow = true
        child.receiveShadow = true
      } else if (child.userData.isPaintedPanel) {
        const mat = child.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
        const targetColor = colorOverride || `#${child.userData.originalColor}`

        const clonedMat = mat.clone()
        clonedMat.color.set(targetColor)
        clonedMat.envMapIntensity = 1.8
        child.material = clonedMat
        child.castShadow = true
        child.receiveShadow = true
      } else {
        // Melhorar perfis de estrutura e não-vidro (sem substituição de cor)
        const mat = child.material as THREE.Material
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.envMapIntensity = 1.8
          child.castShadow = true
          child.receiveShadow = true
        }
      }
    })
  }, [scene, colorOverride, frosted, isConfigurable, isPolarizable, isExtraClear])

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

/* ─── Skeleton de Loading ─── */
function Viewer3DSkeleton() {
  return (
    <div
      className="w-full bg-surface-section flex items-center justify-center"
      style={{ aspectRatio: '16/10' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-action-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-text-muted font-body animate-pulse">
          Carregando modelo 3D...
        </span>
      </div>
    </div>
  )
}

/* ─── Componente Principal ─── */
export function Viewer3D({
  modelUrl,
  isConfigurable,
  isPolarizable,
  isExtraClear,
}: {
  modelUrl: string
  isConfigurable?: boolean
  isPolarizable?: boolean
  isExtraClear?: boolean
}) {
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [mounted, setMounted] = useState(false)
  // A cor só importa para produtos configuráveis (pintados) — indefinido por padrão para não colorir outros modelos
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    isConfigurable ? '#0B66C3' : undefined,
  )
  // Estado fosco para produtos polarizáveis
  const [frosted, setFrosted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<any>(null)

  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      queueMicrotask(() => setMounted(true))
    }
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) queueMicrotask(() => setWebGLSupported(false))
  }, [])

  // Desativar zoom de rolagem no canvas
  useEffect(() => {
    const stopWheelOnCanvas = (e: WheelEvent) => {
      if (e.target && containerRef.current?.contains(e.target as Node)) {
        e.stopImmediatePropagation()
        e.stopPropagation()
      }
    }
    window.addEventListener('wheel', stopWheelOnCanvas, { capture: true, passive: true })
    return () => window.removeEventListener('wheel', stopWheelOnCanvas, { capture: true })
  }, [])

  useEffect(() => {
    if (modelUrl) {
      useGLTF.preload(modelUrl)
    }
  }, [modelUrl])

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current
      const object = controls.object
      const target = controls.target

      const v = new THREE.Vector3().subVectors(object.position, target)
      v.multiplyScalar(0.8)

      const newDistance = v.length()
      if (newDistance >= controls.minDistance) {
        object.position.copy(target).add(v)
        controls.update()
      } else {
        v.setLength(controls.minDistance)
        object.position.copy(target).add(v)
        controls.update()
      }
    }
  }

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current
      const object = controls.object
      const target = controls.target

      const v = new THREE.Vector3().subVectors(object.position, target)
      v.multiplyScalar(1.2)

      const newDistance = v.length()
      if (newDistance <= controls.maxDistance) {
        object.position.copy(target).add(v)
        controls.update()
      } else {
        v.setLength(controls.maxDistance)
        object.position.copy(target).add(v)
        controls.update()
      }
    }
  }

  if (!mounted || !webGLSupported) {
    return <Viewer3DSkeleton />
  }

  const configurable = isConfigurable === true

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Contêiner do Canvas 3D */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-md border border-border-subtle shadow-sm"
        style={{
          aspectRatio: '16/10',
          background: 'radial-gradient(circle, #FCFCFA 0%, var(--color-surface-section) 100%)',
        }}
      >
        {/* ─── Painel de Paleta de Cores (Desktop — apenas Vidro Pintado) ─── */}
        {configurable && (
          <div className="hidden md:block absolute top-4 left-4 z-10 bg-surface-card/90 backdrop-blur-md border border-border-subtle p-3 rounded-lg shadow-md max-w-[280px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2 font-body select-none">
              Paleta de Cores do Vidro
            </span>
            <div className="flex gap-2">
              {CORES_PALETA.map((cor) => (
                <button
                  key={cor.hex}
                  onClick={() => setSelectedColor(cor.hex)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 ${
                    selectedColor === cor.hex
                      ? 'border-action-primary scale-105 shadow-md shadow-action-primary/10'
                      : 'border-white/80 shadow-sm'
                  }`}
                  style={{ backgroundColor: cor.hex }}
                  title={cor.nome}
                  aria-label={`Mudar cor para ${cor.nome}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── Alternador Polarizado (Desktop — apenas Vidro Polarizado) ─── */}
        {isPolarizable && (
          <div className="hidden md:flex absolute top-4 left-4 z-10 bg-surface-card/90 backdrop-blur-md border border-border-subtle p-3 rounded-lg shadow-md items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary font-body select-none whitespace-nowrap">
              Modo do Vidro
            </span>
            <div className="flex items-center bg-[#F0F0EE] rounded-full p-0.5 relative">
              <button
                onClick={() => setFrosted(false)}
                className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  !frosted
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Transparente
              </button>
              <button
                onClick={() => setFrosted(true)}
                className={`relative z-10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  frosted
                    ? 'text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Privacidade
              </button>
              {/* Indicador deslizante */}
              <div
                className="absolute top-0.5 bottom-0.5 rounded-full bg-[#0D0D0D] transition-all duration-300 ease-out"
                style={{
                  width: frosted ? '50%' : '50%',
                  left: frosted ? '50%' : '0%',
                }}
              />
            </div>
          </div>
        )}

        {/* Botões de Zoom */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 hidden md:flex">
          <button
            onClick={handleZoomIn}
            className="bg-surface-card/90 backdrop-blur-sm border border-border-subtle p-2 rounded-md hover:bg-surface-card hover:text-action-primary transition-colors text-text-secondary shadow-sm cursor-pointer"
            aria-label="Aumentar zoom"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-surface-card/90 backdrop-blur-sm border border-border-subtle p-2 rounded-md hover:bg-surface-card hover:text-action-primary transition-colors text-text-secondary shadow-sm cursor-pointer"
            aria-label="Diminuir zoom"
          >
            <Minus size={20} />
          </button>
        </div>

        {/* Instrução de interação */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <span className="text-xs text-text-muted bg-surface-card/85 backdrop-blur-md px-4 py-1.5 rounded-full font-body border border-border-subtle shadow-sm">
            <span className="hidden md:inline">Arraste para rotacionar</span>
            <span className="inline md:hidden">Arraste para rotacionar · Pinça para zoom</span>
          </span>
        </div>

        <Canvas
          camera={{ position: [0, 0.5, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-3, 3, -3]} intensity={0.4} />

            <Environment resolution={256}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.5} />
              <directionalLight position={[-5, 5, -5]} intensity={1.0} />
              {/* Painéis de iluminação de estúdio (softboxes virtuais) para reflexos de alta qualidade no vidro */}
              <mesh position={[0, 4, 2]} rotation={[Math.PI / 4, 0, 0]}>
                <planeGeometry args={[8, 3]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <mesh position={[3, 2, -3]} rotation={[0, -Math.PI / 4, 0]}>
                <planeGeometry args={[4, 8]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <mesh position={[-3, 2, -3]} rotation={[0, Math.PI / 4, 0]}>
                <planeGeometry args={[4, 8]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
            </Environment>

            {modelUrl && (
              <Modelo
                url={modelUrl}
                colorOverride={configurable ? selectedColor : undefined}
                isConfigurable={configurable}
                isPolarizable={isPolarizable}
                isExtraClear={isExtraClear}
                frosted={frosted}
              />
            )}

            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.3}
              scale={4}
              blur={2}
              far={1.5}
            />

            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={false}
              minDistance={1.5}
              maxDistance={6}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
              autoRotate={false}
              autoRotateSpeed={0.8}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ─── Painel de Cores Mobile (apenas Vidro Pintado) ─── */}
      {configurable && (
        <div className="md:hidden w-full bg-surface-card border border-border-subtle p-3.5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-3 font-body text-center select-none">
            Selecione a Cor do Vidro Pintado
          </span>
          <div className="flex justify-center gap-2.5">
            {CORES_PALETA.map((cor) => (
              <button
                key={cor.hex}
                onClick={() => setSelectedColor(cor.hex)}
                className={`w-7.5 h-7.5 rounded-full border-2 cursor-pointer transition-all duration-200 active:scale-90 shrink-0 ${
                  selectedColor === cor.hex
                    ? 'border-action-primary scale-110 shadow-md shadow-action-primary/20'
                    : 'border-white/80 shadow-sm'
                }`}
                style={{ backgroundColor: cor.hex }}
                title={cor.nome}
                aria-label={`Mudar cor para ${cor.nome}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── Alternador Polarizado Mobile (apenas Vidro Polarizado) ─── */}
      {isPolarizable && (
        <div className="md:hidden w-full bg-surface-card border border-border-subtle p-3.5 rounded-lg shadow-sm">
          <span className="text-xs uppercase font-bold tracking-wider text-text-secondary block mb-3 font-body text-center select-none">
            Modo do Vidro Inteligente
          </span>
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-[#F0F0EE] rounded-full p-0.5 relative">
              <button
                onClick={() => setFrosted(false)}
                className={`relative z-10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  !frosted ? 'text-white' : 'text-text-secondary'
                }`}
              >
                Transparente
              </button>
              <button
                onClick={() => setFrosted(true)}
                className={`relative z-10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                  frosted ? 'text-white' : 'text-text-secondary'
                }`}
              >
                Privacidade
              </button>
              <div
                className="absolute top-0.5 bottom-0.5 rounded-full bg-[#0D0D0D] transition-all duration-300 ease-out"
                style={{
                  width: '50%',
                  left: frosted ? '50%' : '0%',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

