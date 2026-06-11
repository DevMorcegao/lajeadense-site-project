import React from 'react'
import { DiagramaDuoGlass } from './DiagramaDuoGlass'
import { DiagramaBoxTemperado } from './DiagramaBoxTemperado'
import { DiagramaFortGlass } from './DiagramaFortGlass'
import { DiagramaWallGlass } from './DiagramaWallGlass'
import { DiagramaHabitat } from './DiagramaHabitat'
import { DiagramaLaminado } from './DiagramaLaminado'
import { DiagramaEspelhos } from './DiagramaEspelhos'
import { DiagramaJumbo } from './DiagramaJumbo'
import { DiagramaExtraClear } from './DiagramaExtraClear'
import { DiagramaPolarizado } from './DiagramaPolarizado'
import { DiagramaVidroPintado } from './DiagramaVidroPintado'
import { DiagramaDuploPinazio } from './DiagramaDuploPinazio'
import { DiagramaGenerico } from './DiagramaGenerico'

export const DIAGRAMAS: Record<string, React.ComponentType> = {
  'duo-glass-vidro-duplo-termoacustico': DiagramaDuoGlass,
  'vidro-temperado': DiagramaBoxTemperado,
  'fort-glass-vidro-multilaminado': DiagramaFortGlass,
  'wall-glass-guarda-corpo': DiagramaWallGlass,
  'vidro-de-protecao-solar-linha-habitat-by-cebrace': DiagramaHabitat,
  'vidro-laminado': DiagramaLaminado,
  'espelhos': DiagramaEspelhos,
  'vidro-jumbo': DiagramaJumbo,
  'vidro-extra-clear': DiagramaExtraClear,
  'vidro-polarizado-vidro-inteligente': DiagramaPolarizado,
  'vidro-pintado': DiagramaVidroPintado,
  'duo-glass-pinazio-vidro-duplo-termoacustico-com-grid-decorativo': DiagramaDuploPinazio,
}

export {
  DiagramaDuoGlass,
  DiagramaBoxTemperado,
  DiagramaFortGlass,
  DiagramaWallGlass,
  DiagramaHabitat,
  DiagramaLaminado,
  DiagramaEspelhos,
  DiagramaJumbo,
  DiagramaExtraClear,
  DiagramaPolarizado,
  DiagramaVidroPintado,
  DiagramaDuploPinazio,
  DiagramaGenerico,
}
