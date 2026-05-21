# Macias Têxtil — Site Institucional

Site estático da Macias Têxtil (Tecelagem Macias Ltda., fundada em 1945). Tecidos planos sintéticos premium — poliamida, poliéster, sustentáveis, técnicos.

> 🌐 macias.com.br
> 🏭 Indaiatuba/SP · Brasil

---

## 📂 Estrutura

Tudo está num único diretório, **sem subpastas**. Total: **354 arquivos** (~44 MB).

| Tipo | Qtd | Função |
|------|-----|--------|
| `.html` | 64 | Páginas do site |
| `.png` | 145 | Imagens (cores, fotos antigas do WP, logo, ícones) |
| `.jpg` | 142 | Imagens (tecidos, fotos antigas do WP, banners) |
| `.js` | 2 | Scripts do navegador (`main.js`, `catalogo.js`) |
| `.css` | 1 | Folha de estilo única (`styles.css`) |

---

## 🗺️ Mapa de páginas (URLs)

### Home
- `index.html` — `/`

### Catálogo de produtos
- `produtos.html` — `/produtos.html` (todos os tecidos com filtros laterais)
- `produtos-lancamentos.html` — Lançamentos
- `produtos-tecnicos.html` — Linha Técnica
- `produtos-protecao-uv-50.html` — Proteção UV 50+
- `produtos-esportivos-escolares.html` — Esportivos/Escolares
- `produtos-sustentaveis.html` — Sustentáveis

### Páginas institucionais
- `contato.html` — Contato
- `institucional.html` — Sobre a empresa
- `sustentabilidade.html` — Compromisso ambiental
- `certificacoes.html` — Certificados (ABVTEX, ISO)
- `tecnologias.html` — MacWear™, MacSun™, MacFlex™, MacShield™, MacFresh™
- `politica-de-qualidade.html` — Compromisso

### Detalhe de produtos (51 tecidos)
- `produto-<slug>.html` — exemplos:
  - `produto-poliester-600.html`
  - `produto-nylon-240.html`
  - `produto-macnyl-1000.html`
  - `produto-mac-bambu.html`
  - `produto-peel-ply.html`
  - … (e mais 46)

---

## 🖼️ Convenção de nomes de imagens

Como tudo está flat, os nomes carregam o "contexto" como prefixo:

| Prefixo | Origem | Exemplo |
|---------|--------|---------|
| `cor-` | Imagens das cores Pantone | `cor-0372.png`, `cor-NA.png` (fallback) |
| `tecido-` | Foto de cada tecido | `tecido-10050.jpg`, `tecido-10050-thumb.jpg` |
| `wp-` | Uploads herdados do WordPress original (ano-mês-nome) | `wp-2022-11-Mac-Puelon.jpg`, `wp-2018-07-fundo-banner.png` |
| _(sem prefixo)_ | Imagens globais do site | `logo-macias.png`, `favicon.png`, `fachada-macias.jpg`, `slide-1.jpg`, `slide-2.jpg`, `NA.png` |

---

## 🚀 Como hospedar

### GitHub Pages (mais simples)
1. Sobe a pasta inteira para um repositório
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. Pronto. O site fica em `https://<usuario>.github.io/<repo>/`

### Qualquer servidor estático
Funciona em **qualquer hospedagem** que sirva HTML estático:
- Netlify, Vercel, Cloudflare Pages (arrasta a pasta)
- Apache, Nginx (aponta o `DocumentRoot` para esta pasta)
- AWS S3 + CloudFront
- Servidor próprio da Macias

### Testar localmente
Como tudo é HTML puro, basta abrir `index.html` no navegador. Para evitar problemas de CORS em navegadores mais restritivos, sirva via um servidor local simples:

```bash
# Python (já vem instalado na maioria das máquinas)
python -m http.server 8080

# Node
npx serve

# PHP
php -S localhost:8080
```

Acesse `http://localhost:8080/`.

---

## 📑 Conteúdo de cada página

### Home (`index.html`)
- Hero com foto aérea da fábrica e tagline
- Bloco "Linhas de produto" — 5 categorias com foto representativa
- Carrossel de lançamentos (8 produtos mais recentes)
- CTA pra solicitar amostras
- Formulário de contato + endereço/WhatsApp/e-mail

### Catálogo (`produtos.html` e variações)
- Lista de **51 tecidos** em grid 1:1 com hover shadow
- Filtros laterais com **lógica AND** em todos os campos:
  - Busca por nome ou código
  - Linha de produto (5 categorias)
  - Aplicação (esportes, militar, mochilas, etc.)
  - Composição (poliamida, poliéster, elastano, etc.)
  - Ligamento (tela, sarja, rip-stop, jacquard…)
  - Gramatura (faixas)
  - Largura (faixas)
  - Cores (com busca por código/nome)
- Refinamento dinâmico: opções com 0 resultado são ocultadas
- Mobile: gaveta lateral com backdrop blur

### Detalhe do produto (`produto-<slug>.html`)
- Foto grande do tecido (com lightbox)
- Resumo gerado automaticamente a partir da ficha técnica
- **Ficha técnica**: composição (com barras visuais), gramatura, largura, ligamento, aplicações, atributos
- **Selo MacWear™** quando o tecido tem o acabamento disponível (19 tecidos)
- **Cores disponíveis**: grid de swatches com nome, código e Pantone (clica → abre foto em nova guia)
- **Instruções de lavagem** (universais para todos os tecidos com composição)
- **Produtos semelhantes**: 4 sugeridos por categoria ou relacionados explícitos

---

## 🎨 Identidade visual

- **Cor de destaque**: `#ff3d2e` (vermelho-coral)
- **Texto**: `#0a0a0a` (preto suave)
- **Fundo**: `#f6f6f4` (off-white)
- **Tipografia**:
  - Display: **Space Grotesk** (500, 600, 700) — Google Fonts
  - Texto: **Inter** (300–800) — Google Fonts
- **Responsivo**: mobile-first, breakpoints suaves
- **Animações**: scroll reveal (IntersectionObserver), transições curtas

---

## 🔧 Tecnologias

- **HTML5 + CSS3 + Vanilla JS** (sem frameworks, sem build no deploy)
- **0 dependências de runtime** — só HTML, CSS, JS, imagens
- **Sem cookies, sem trackers, sem analytics** (até esse momento)
- **Fontes externas**: só Google Fonts (Inter + Space Grotesk)
- **Tamanho total**: 44 MB (a maior parte são as imagens dos uploads herdados do WordPress original)

---

## 📊 Dados de origem

Este site foi gerado a partir de:
- **Backup WordPress** original de macias.com.br (22/08/2023) — 1.034 produtos no banco, dos quais 51 estão em linha
- **Site 2** (projeto paralelo) — fotos dos tecidos e cores Pantone reais
- **PDFs de fichas técnicas** — composição, gramatura, largura, ligamento (`C:\Users\ti\Downloads\11-FICHA TÉCNICA DOS PRODUTOS\`)
- **Tabela de preços** (`FQ 8.2.14 Tabela de preço…`) — identificação de tecidos com acabamento MacWear™

---

## 🔄 Como editar o conteúdo

**Esta pasta contém só o site renderizado, sem código-fonte.** Para editar:

1. Os arquivos-fonte (templates, dados JSON, scripts de build) estão em:
   ```
   C:\Users\ti\Downloads\macias-novo\
   ```

2. Lá você edita:
   - Conteúdo dos tecidos → `src/data/produtos.json`
   - Categorias, menu, opções → `src/data/categorias.json`, `menu.json`, `opcoes.json`
   - Textos das páginas → `src/templates/<pagina>.js`
   - Estilo → `src/assets/css/styles.css`
   - Imagens → `src/assets/img/`

3. Roda o build:
   ```
   cd C:\Users\ti\Downloads\macias-novo
   node build.js
   ```

4. Gera nova versão flat na pasta atual (`github/`):
   - Use o script `.flatten.js` (preservado no histórico) ou regenere manualmente

> ⚠️ Edição direta dos `.html` nesta pasta é possível mas **não recomendada** — qualquer regeneração futura sobrescreve as alterações.

---

## 📜 Histórico

- **1945** — Fundação como Tecelagem Jacyra
- **2014** — Aquisição pela família Macias, renomeada para Tecelagem Macias Ltda.
- **2026** — Site refeito em HTML/CSS/JS estático (sem WordPress, sem plugins)

---

_Site 100% brasileiro · 81 anos de tradição têxtil_
