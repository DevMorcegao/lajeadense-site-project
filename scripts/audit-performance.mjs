#!/usr/bin/env node

/**
 * Pipeline de Auditoria de Performance — Lajeadense Vidros
 *
 * Orquestra as seguintes ferramentas:
 * 1. Lighthouse CLI (JSON) — 4 rotas × 2 viewports (desktop + mobile)
 * 2. Bundle Analyzer — Mapa visual de módulos via @next/bundle-analyzer
 * 3. Source Map Explorer — Contribuição de cada arquivo por chunk
 *
 * Gera relatório consolidado em reports/performance-audit.md
 *
 * Uso: node scripts/audit-performance.mjs
 */

import { execSync, exec } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from "fs";
import { join, resolve, basename } from "path";

// ─── Configuração ────────────────────────────────────────────────────────────

const BASE_URL = "https://lajeadense-site-project-w8vx.vercel.app";

const ROUTES = [
  { name: "home", path: "/" },
  { name: "portfolio", path: "/portfolio" },
  { name: "produtos", path: "/produtos" },
  { name: "produto-detalhe", path: "/produtos/duo-glass-vidro-duplo-termoacustico" },
];

const VIEWPORTS = ["desktop", "mobile"];

const REPORTS_DIR = resolve("reports");
const LIGHTHOUSE_DIR = join(REPORTS_DIR, "lighthouse");
const BUNDLE_DIR = join(REPORTS_DIR, "bundle-analyzer");
const SOURCEMAP_DIR = join(REPORTS_DIR, "source-map-explorer");

// ─── Utilitários ─────────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

function logStep(step, total, msg) {
  console.log(`\n[$${step}/${total}] ${msg}`);
  console.log("─".repeat(60));
}

function runCmd(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: "utf-8",
      stdio: options.silent ? "pipe" : "inherit",
      timeout: options.timeout || 300000, // 5 min padrão
      ...options,
    });
  } catch (err) {
    if (options.ignoreError) {
      log("⚠️", `Comando falhou (ignorado): ${cmd}`);
      return "";
    }
    throw err;
  }
}

// ─── Etapa 1: Lighthouse CLI ─────────────────────────────────────────────────

async function runLighthouse() {
  logStep(1, 3, "🔦 Executando Lighthouse CLI contra produção...");
  ensureDir(LIGHTHOUSE_DIR);

  const total = ROUTES.length * VIEWPORTS.length;
  let current = 0;

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      current++;
      const url = `${BASE_URL}${route.path}`;
      const outputFile = join(LIGHTHOUSE_DIR, `${route.name}-${viewport}.json`);

      log("🌐", `[${current}/${total}] ${route.name} (${viewport}) → ${url}`);

      const presetFlag = viewport === "desktop"
        ? '--preset=desktop'
        : '--screenEmulation.mobile --screenEmulation.width=375 --screenEmulation.height=812';

      const cmd = [
        "npx lighthouse",
        `"${url}"`,
        "--output=json",
        `--output-path="${outputFile}"`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--chrome-flags=\"--headless --no-sandbox --disable-gpu\"",
        presetFlag,
        "--quiet",
      ].join(" ");

      try {
        runCmd(cmd, { silent: true, timeout: 180000 });
        log("✅", `Salvo: ${basename(outputFile)}`);
      } catch (err) {
        log("❌", `Falha ao auditar ${route.name} (${viewport}): ${err.message}`);
      }
    }
  }
}

// ─── Etapa 2: Bundle Analyzer ────────────────────────────────────────────────

function runBundleAnalyzer() {
  logStep(2, 3, "📦 Executando Bundle Analyzer (build de produção com ANALYZE=true)...");
  ensureDir(BUNDLE_DIR);

  log("🔨", "Executando build com ANALYZE=true e productionBrowserSourceMaps...");
  log("⏳", "Isso pode levar 1-3 minutos...");

  try {
    // No Windows, usa set para definir variáveis de ambiente
    const isWin = process.platform === "win32";
    const envPrefix = isWin ? "set ANALYZE=true&&" : "ANALYZE=true";
    runCmd(`${envPrefix} npx next build --webpack`, { timeout: 600000 });

    log("✅", "Build com Bundle Analyzer concluída!");

    // Copiar os HTMLs gerados (se existirem) para reports/bundle-analyzer/
    const analyzeDir = resolve(".next", "analyze");
    if (existsSync(analyzeDir)) {
      const files = readdirSync(analyzeDir).filter(f => f.endsWith(".html"));
      for (const file of files) {
        const src = join(analyzeDir, file);
        const dest = join(BUNDLE_DIR, file);
        writeFileSync(dest, readFileSync(src));
        log("📄", `Copiado: ${file}`);
      }
    } else {
      log("⚠️", "Diretório .next/analyze não encontrado. Os HTMLs podem estar na raiz do projeto.");
      // Procurar na raiz por client.html e server.html
      for (const name of ["client.html", "server.html"]) {
        const rootFile = resolve(name);
        if (existsSync(rootFile)) {
          const dest = join(BUNDLE_DIR, name);
          writeFileSync(dest, readFileSync(rootFile));
          log("📄", `Copiado da raiz: ${name}`);
        }
      }
    }
  } catch (err) {
    log("❌", `Falha na build com Bundle Analyzer: ${err.message}`);
  }
}

// ─── Etapa 3: Source Map Explorer ────────────────────────────────────────────

function runSourceMapExplorer() {
  logStep(3, 3, "🗺️  Executando Source Map Explorer nos chunks JS...");
  ensureDir(SOURCEMAP_DIR);

  // Localizar os chunks JS com source maps na build
  const staticDir = resolve(".next", "static", "chunks");
  if (!existsSync(staticDir)) {
    log("⚠️", "Diretório .next/static/chunks não encontrado. Pulando Source Map Explorer.");
    return;
  }

  const jsFiles = readdirSync(staticDir)
    .filter(f => f.endsWith(".js") && existsSync(join(staticDir, `${f}.map`)))
    .sort((a, b) => {
      // Ordena por tamanho (maiores primeiro)
      const sizeA = readFileSync(join(staticDir, a)).length;
      const sizeB = readFileSync(join(staticDir, b)).length;
      return sizeB - sizeA;
    })
    .slice(0, 10); // Top 10 maiores chunks

  if (jsFiles.length === 0) {
    log("⚠️", "Nenhum arquivo JS com source map encontrado. Certifique-se de que productionBrowserSourceMaps está ativado.");
    return;
  }

  log("📊", `Encontrados ${jsFiles.length} chunks com source maps. Analisando os maiores...`);

  for (const jsFile of jsFiles) {
    const filePath = join(staticDir, jsFile);
    const outputJson = join(SOURCEMAP_DIR, `${jsFile.replace(".js", "")}.json`);
    const outputHtml = join(SOURCEMAP_DIR, `${jsFile.replace(".js", "")}.html`);

    try {
      const cliPath = resolve("node_modules", "source-map-explorer", "bin", "cli.js");
      runCmd(`node "${cliPath}" "${filePath}" --json "${outputJson}" --no-border-checks`, { silent: true, ignoreError: true });
      runCmd(`node "${cliPath}" "${filePath}" --html "${outputHtml}" --no-border-checks`, { silent: true, ignoreError: true });
      log("✅", `Analisado: ${jsFile}`);
    } catch (err) {
      log("⚠️", `Falha ao analisar ${jsFile}: ${err.message}`);
    }
  }
}

// ─── Consolidação do Relatório ───────────────────────────────────────────────

function generateReport() {
  log("\n📝", "Gerando relatório consolidado...\n");

  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  let report = `# 📊 Relatório de Auditoria de Performance — Lajeadense Vidros\n\n`;
  report += `> Gerado em: ${now}\n\n`;
  report += `> URL auditada: ${BASE_URL}\n\n`;
  report += `---\n\n`;

  // ─── Seção 1: Scores Gerais ──────────────────────────────────────────────

  report += `## Resumo Executivo — Scores por Página\n\n`;
  report += `| Página | Viewport | Performance | Acessibilidade | Boas Práticas | SEO | LCP | CLS | TBT |\n`;
  report += `|--------|----------|:-----------:|:--------------:|:-------------:|:---:|:---:|:---:|:---:|\n`;

  const allAudits = [];
  const allOpportunities = [];
  const allDiagnostics = [];

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const filePath = join(LIGHTHOUSE_DIR, `${route.name}-${viewport}.json`);
      if (!existsSync(filePath)) {
        report += `| ${route.name} | ${viewport} | ❌ Falha | - | - | - | - | - | - |\n`;
        continue;
      }

      try {
        const data = JSON.parse(readFileSync(filePath, "utf-8"));
        const cats = data.categories || {};
        const audits = data.audits || {};

        const perfScore = Math.round((cats.performance?.score || 0) * 100);
        const a11yScore = Math.round((cats.accessibility?.score || 0) * 100);
        const bpScore = Math.round((cats["best-practices"]?.score || 0) * 100);
        const seoScore = Math.round((cats.seo?.score || 0) * 100);

        const lcp = audits["largest-contentful-paint"]?.displayValue || "N/A";
        const cls = audits["cumulative-layout-shift"]?.displayValue || "N/A";
        const tbt = audits["total-blocking-time"]?.displayValue || "N/A";

        const perfEmoji = perfScore >= 90 ? "🟢" : perfScore >= 50 ? "🟡" : "🔴";

        report += `| ${route.name} | ${viewport} | ${perfEmoji} ${perfScore} | ${a11yScore} | ${bpScore} | ${seoScore} | ${lcp} | ${cls} | ${tbt} |\n`;

        // Coletar oportunidades (opportunities)
        if (cats.performance?.auditRefs) {
          for (const ref of cats.performance.auditRefs) {
            const audit = audits[ref.id];
            if (audit && audit.score !== null && audit.score < 1 && audit.details?.type === "opportunity") {
              allOpportunities.push({
                route: route.name,
                viewport,
                id: ref.id,
                title: audit.title,
                description: audit.description,
                displayValue: audit.displayValue || "",
                score: audit.score,
                savings: audit.details?.overallSavingsMs || 0,
                items: (audit.details?.items || []).slice(0, 5),
              });
            }
            // Diagnósticos
            if (audit && audit.score !== null && audit.score < 1 && audit.details?.type === "table") {
              allDiagnostics.push({
                route: route.name,
                viewport,
                id: ref.id,
                title: audit.title,
                description: audit.description,
                displayValue: audit.displayValue || "",
                score: audit.score,
                items: (audit.details?.items || []).slice(0, 5),
              });
            }
          }
        }
      } catch (err) {
        report += `| ${route.name} | ${viewport} | ❌ Erro ao ler | - | - | - | - | - | - |\n`;
      }
    }
  }

  report += `\n---\n\n`;

  // ─── Seção 2: Problemas Críticos (Oportunidades com maior economia) ─────

  const sortedOpps = allOpportunities
    .sort((a, b) => b.savings - a.savings)
    .filter((opp, i, arr) => arr.findIndex(o => o.id === opp.id) === i); // Deduplicar por id

  report += `## 🔴 Problemas Críticos (Oportunidades de Melhoria)\n\n`;
  report += `Ordenados por impacto estimado (maior economia de tempo primeiro).\n\n`;

  const critical = sortedOpps.filter(o => o.savings >= 500);
  const medium = sortedOpps.filter(o => o.savings >= 100 && o.savings < 500);
  const low = sortedOpps.filter(o => o.savings > 0 && o.savings < 100);

  if (critical.length === 0) {
    report += `> [!TIP]\n> Nenhum problema crítico encontrado (economia ≥ 500ms). Ótimo!\n\n`;
  }

  for (const opp of critical) {
    report += `### ${opp.title}\n\n`;
    report += `- **Página**: ${opp.route} (${opp.viewport})\n`;
    report += `- **Economia estimada**: ${opp.displayValue || `${opp.savings}ms`}\n`;
    report += `- **Descrição**: ${opp.description}\n`;
    if (opp.items.length > 0) {
      report += `- **Recursos afetados**:\n`;
      for (const item of opp.items) {
        const url = item.url || item.node?.snippet || JSON.stringify(item).substring(0, 120);
        report += `  - \`${typeof url === "string" ? url.substring(0, 100) : url}\`\n`;
      }
    }
    report += `\n`;
  }

  // ─── Seção 3: Problemas Médios ──────────────────────────────────────────

  report += `## 🟡 Problemas Médios\n\n`;

  if (medium.length === 0) {
    report += `> [!TIP]\n> Nenhum problema médio encontrado (economia 100-500ms).\n\n`;
  }

  for (const opp of medium) {
    report += `### ${opp.title}\n\n`;
    report += `- **Página**: ${opp.route} (${opp.viewport})\n`;
    report += `- **Economia estimada**: ${opp.displayValue || `${opp.savings}ms`}\n`;
    report += `- **Descrição**: ${opp.description}\n`;
    if (opp.items.length > 0) {
      report += `- **Recursos afetados**:\n`;
      for (const item of opp.items) {
        const url = item.url || item.node?.snippet || JSON.stringify(item).substring(0, 120);
        report += `  - \`${typeof url === "string" ? url.substring(0, 100) : url}\`\n`;
      }
    }
    report += `\n`;
  }

  // ─── Seção 4: Melhorias Recomendadas ────────────────────────────────────

  report += `## 🟢 Melhorias Recomendadas (Baixa Prioridade)\n\n`;

  if (low.length === 0) {
    report += `> [!TIP]\n> Nenhuma melhoria de baixa prioridade adicional encontrada.\n\n`;
  }

  for (const opp of low) {
    report += `- **${opp.title}** (${opp.route}/${opp.viewport}): ${opp.displayValue || `${opp.savings}ms`}\n`;
  }

  if (low.length > 0) report += `\n`;

  // ─── Seção 5: Diagnósticos ──────────────────────────────────────────────

  report += `## 🔍 Diagnósticos Relevantes\n\n`;

  const uniqueDiagnostics = allDiagnostics
    .filter((d, i, arr) => arr.findIndex(o => o.id === d.id) === i)
    .sort((a, b) => a.score - b.score)
    .slice(0, 15);

  for (const diag of uniqueDiagnostics) {
    report += `### ${diag.title}\n\n`;
    report += `- **Página**: ${diag.route} (${diag.viewport})\n`;
    report += `- **Valor**: ${diag.displayValue}\n`;
    report += `- **Descrição**: ${diag.description}\n`;
    if (diag.items.length > 0) {
      report += `- **Itens**:\n`;
      for (const item of diag.items) {
        const label = item.node?.snippet || item.url || item.groupLabel || JSON.stringify(item).substring(0, 120);
        report += `  - \`${typeof label === "string" ? label.substring(0, 120) : label}\`\n`;
      }
    }
    report += `\n`;
  }

  report += `---\n\n`;

  // ─── Seção 6: Bundle Analysis ───────────────────────────────────────────

  report += `## 📦 Bundle Analysis\n\n`;

  // Ler os JSONs do Source Map Explorer
  if (existsSync(SOURCEMAP_DIR)) {
    const smeFiles = readdirSync(SOURCEMAP_DIR).filter(f => f.endsWith(".json"));

    if (smeFiles.length > 0) {
      report += `### Contribuição por Arquivo (Source Map Explorer)\n\n`;
      report += `> Os chunks abaixo foram analisados. Para cada um, são listados os maiores contribuintes de tamanho.\n\n`;

      for (const smeFile of smeFiles.slice(0, 5)) {
        const filePath = join(SOURCEMAP_DIR, smeFile);
        try {
          const data = JSON.parse(readFileSync(filePath, "utf-8"));
          const results = data.results || [];

          for (const result of results) {
            const files = result.files || {};
            const entries = Object.entries(files)
              .map(([name, info]) => ({ name, size: info.size || 0 }))
              .sort((a, b) => b.size - a.size)
              .slice(0, 10);

            if (entries.length === 0) continue;

            const totalSize = entries.reduce((sum, e) => sum + e.size, 0);
            report += `#### Chunk: \`${smeFile.replace(".json", ".js")}\`\n\n`;
            report += `| Arquivo/Módulo | Tamanho | % do Chunk |\n`;
            report += `|----------------|--------:|:----------:|\n`;

            for (const entry of entries) {
              const sizeKB = (entry.size / 1024).toFixed(1);
              const pct = ((entry.size / totalSize) * 100).toFixed(1);
              report += `| \`${entry.name.substring(0, 80)}\` | ${sizeKB} KB | ${pct}% |\n`;
            }
            report += `\n`;
          }
        } catch {
          // Ignora erros de parse silenciosamente
        }
      }
    } else {
      report += `> [!WARNING]\n> Nenhum arquivo JSON do Source Map Explorer encontrado em \`reports/source-map-explorer/\`.\n\n`;
    }
  }

  // Links para relatórios visuais
  report += `### Relatórios Visuais\n\n`;
  report += `- **Bundle Analyzer**: Abra os HTMLs em \`reports/bundle-analyzer/\` no navegador\n`;
  report += `- **Source Map Explorer**: Abra os HTMLs em \`reports/source-map-explorer/\` no navegador\n`;
  report += `- **Lighthouse (JSON bruto)**: Disponíveis em \`reports/lighthouse/\`\n\n`;

  report += `---\n\n`;
  report += `## 📋 Próximos Passos\n\n`;
  report += `Com base neste relatório, as otimizações devem ser implementadas na seguinte ordem de prioridade:\n\n`;
  report += `1. **Críticos (🔴)**: Resolver todos os problemas com economia ≥ 500ms\n`;
  report += `2. **Médios (🟡)**: Atacar oportunidades de 100-500ms de ganho\n`;
  report += `3. **Bundle**: Reduzir ou lazy-load os maiores módulos identificados\n`;
  report += `4. **Diagnósticos**: Abordar os alertas do Lighthouse com menor score\n`;
  report += `5. **Recomendados (🟢)**: Polimentos finais de menor impacto\n`;

  // Escrever relatório final
  const reportPath = join(REPORTS_DIR, "performance-audit.md");
  writeFileSync(reportPath, report);
  log("✅", `Relatório gerado: ${reportPath}`);
}

// ─── Execução Principal ──────────────────────────────────────────────────────

async function main() {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("  🚀 Pipeline de Auditoria de Performance");
  console.log("  Lajeadense Vidros — Análise Completa");
  console.log("═".repeat(60));
  console.log();

  ensureDir(REPORTS_DIR);

  const startTime = Date.now();

  // Etapa 1: Lighthouse
  const skipLighthouse = process.argv.includes("--skip-lighthouse") || process.argv.includes("--no-lh");
  if (!skipLighthouse) {
    await runLighthouse();
  } else {
    log("🔦", "Pulando Lighthouse CLI (usando relatórios existentes)...");
  }

  // Etapa 2: Bundle Analyzer + Source Maps
  runBundleAnalyzer();

  // Etapa 3: Source Map Explorer
  runSourceMapExplorer();

  // Consolidação
  generateReport();

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log("\n");
  console.log("═".repeat(60));
  console.log(`  ✅ Pipeline concluído em ${elapsed} minutos`);
  console.log(`  📊 Relatório: reports/performance-audit.md`);
  console.log("═".repeat(60));
  console.log();
}

main().catch((err) => {
  console.error("❌ Erro fatal no pipeline:", err);
  process.exit(1);
});
