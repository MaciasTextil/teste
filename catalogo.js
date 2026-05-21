// Catálogo de tecidos — filtros laterais com refinamento dinâmico (vanilla JS, zero deps).
(function () {
  const dataEl = document.getElementById('produtos-data');
  const root = document.querySelector('.catalogo');
  if (!dataEl || !root) return;

  const PRODUTOS = JSON.parse(dataEl.textContent);
  const cardsEl = root.querySelector('[data-cards]');
  const emptyEl = root.querySelector('[data-empty]');
  const countEl = root.querySelector('[data-count]');
  const activeCountEl = root.querySelector('[data-active-count]');
  const searchEl = root.querySelector('#filtro-search');
  const corSearchEl = root.querySelector('[data-cor-search]');
  const corEmptyEl = root.querySelector('[data-cor-empty]');
  let corSearchTerm = '';

  // ====== Estado ======
  const FACETS = ['categoria', 'cores', 'gramatura', 'largura', 'composicao', 'ligamento', 'aplicacao'];
  const state = { search: '' };
  for (const f of FACETS) state[f] = new Set();

  // Preset via data-init-categoria (páginas /produtos/<slug>/)
  if (root.dataset.initCategoria) state.categoria.add(root.dataset.initCategoria);

  function gramaturaBucket(g) {
    if (!g) return '';
    if (g <= 100) return 'leve';
    if (g <= 150) return 'medio';
    if (g <= 200) return 'medio-pesado';
    return 'pesado';
  }

  function valoresDoFaceta(facet, p) {
    switch (facet) {
      case 'categoria':  return p.cats;
      case 'cores':      return p.cores;
      case 'gramatura':  return [gramaturaBucket(p.gr)].filter(Boolean);
      case 'largura':    return p.larg ? [String(p.larg)] : [];
      case 'composicao': return p.comp;
      case 'ligamento':  return p.lig ? [p.lig] : [];
      case 'aplicacao':  return p.apps;
      default:           return [];
    }
  }

  // TODAS as facetas usam lógica AND: o produto precisa ter cada valor selecionado.
  // Observação: facetas em que o produto tem 1 valor único (gramatura, largura,
  // ligamento) retornam 0 resultados se você selecionar dois valores — isso é o
  // comportamento correto de AND (não existe tecido "Leve E Médio" ao mesmo tempo).
  function produtoMatchFacet(facet, p) {
    if (!state[facet] || state[facet].size === 0) return true;
    const valsSet = new Set(valoresDoFaceta(facet, p));
    for (const sel of state[facet]) if (!valsSet.has(sel)) return false;
    return true;
  }

  function produtoMatchSearch(p) {
    if (!state.search) return true;
    const q = state.search.toLowerCase();
    return (p.nome + ' ' + p.codigo).toLowerCase().includes(q);
  }

  function produtoMatchAll(p) {
    if (!produtoMatchSearch(p)) return false;
    for (const f of FACETS) if (!produtoMatchFacet(f, p)) return false;
    return true;
  }

  // ====== Render ======
  function render() {
    const visible = PRODUTOS.filter(produtoMatchAll);
    const visibleIds = new Set(visible.map(p => p.id));

    // Cards: mostra/esconde
    for (const card of cardsEl.children) {
      const id = parseInt(card.dataset.id, 10);
      card.hidden = !visibleIds.has(id);
    }

    // Contador
    countEl.textContent = String(visible.length);
    emptyEl.hidden = visible.length > 0;
    cardsEl.hidden = visible.length === 0;

    // Contagem de filtros ativos (badge no botão mobile)
    let active = state.search ? 1 : 0;
    for (const f of FACETS) active += state[f].size;
    activeCountEl.textContent = active > 0 ? `(${active})` : '';

    // Refinamento dinâmico das facetas
    updateFacets(visible);
  }

  function updateFacets(visibleProducts) {
    // Tally por faceta a partir dos produtos visíveis
    const tally = {};
    for (const f of FACETS) tally[f] = new Map();

    for (const p of visibleProducts) {
      for (const f of FACETS) {
        for (const v of valoresDoFaceta(f, p)) {
          tally[f].set(v, (tally[f].get(v) || 0) + 1);
        }
      }
    }

    // Atualiza opções de cada faceta
    for (const opt of root.querySelectorAll('[data-facet][data-value]')) {
      const facet = opt.dataset.facet;
      const value = opt.dataset.value;
      if (!tally[facet]) continue;
      const count = tally[facet].get(value) || 0;
      const isSelected = state[facet] && state[facet].has(value);
      // Esconde se não aparece em nenhum visível E não está selecionado
      const facetHidden = count === 0 && !isSelected;
      if (opt.classList.contains('cor-swatch')) {
        opt.dataset.facetHidden = facetHidden ? '1' : '';
        applyCoresVisibility(opt);
      } else {
        opt.hidden = facetHidden;
      }
      const cntEl = opt.querySelector('.filtro__count');
      if (cntEl) cntEl.textContent = count;
    }
    updateCoresEmpty();

    // Esconde grupos cujas opções estão todas escondidas
    for (const group of root.querySelectorAll('[data-facet-group]')) {
      if (group.dataset.facetGroup === 'search') continue;
      const opts = group.querySelectorAll('[data-facet][data-value]');
      if (opts.length === 0) continue;
      const anyVisible = [...opts].some(o => !o.hidden);
      group.hidden = !anyVisible;
    }
  }

  function syncUI() {
    for (const opt of root.querySelectorAll('[data-facet][data-value]')) {
      const facet = opt.dataset.facet;
      const value = opt.dataset.value;
      const isSelected = state[facet] && state[facet].has(value);
      const input = opt.querySelector('input[type="checkbox"]');
      if (input) input.checked = isSelected;
      if (opt.classList.contains('cor-swatch')) opt.classList.toggle('is-active', isSelected);
    }
    if (searchEl) searchEl.value = state.search;
  }

  function clearAll() {
    state.search = '';
    for (const f of FACETS) state[f].clear();
    syncUI();
    render();
  }

  function toggleValue(facet, value) {
    if (!state[facet]) return;
    if (state[facet].has(value)) state[facet].delete(value);
    else state[facet].add(value);
  }

  // ====== Eventos ======
  root.addEventListener('change', (e) => {
    const opt = e.target.closest('[data-facet][data-value]');
    if (!opt) return;
    const facet = opt.dataset.facet;
    const value = opt.dataset.value;
    if (e.target.checked) state[facet].add(value);
    else state[facet].delete(value);
    render();
  });

  root.addEventListener('click', (e) => {
    const swatch = e.target.closest('.cor-swatch');
    if (swatch) {
      const value = swatch.dataset.value;
      toggleValue('cores', value);
      swatch.classList.toggle('is-active', state.cores.has(value));
      render();
      return;
    }
    if (e.target.closest('[data-clear]')) {
      e.preventDefault();
      clearAll();
      return;
    }
    const toggleBtn = e.target.closest('[data-toggle-filtros]');
    if (toggleBtn) {
      const open = root.classList.toggle('catalogo--filtros-open');
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      return;
    }
  });

  // Fechar mobile sheet ao clicar fora do filtros
  root.addEventListener('click', (e) => {
    if (!root.classList.contains('catalogo--filtros-open')) return;
    if (e.target.closest('.filtros') || e.target.closest('[data-toggle-filtros]')) return;
    // tappable area outside the sheet
    if (e.target === root || e.target.classList.contains('catalogo__grid')) {
      root.classList.remove('catalogo--filtros-open');
      document.body.style.overflow = '';
    }
  });

  if (searchEl) {
    let t;
    searchEl.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.search = searchEl.value.trim();
        render();
      }, 150);
    });
  }

  // Busca interna no filtro de cores (por código ou nome)
  function applyCoresVisibility(sw) {
    const facetHidden = !!sw.dataset.facetHidden;
    const codigo = (sw.dataset.value || '').toLowerCase();
    const nome = (sw.dataset.nome || '').toLowerCase();
    const searchHidden = corSearchTerm && !codigo.includes(corSearchTerm) && !nome.includes(corSearchTerm);
    sw.hidden = facetHidden || searchHidden;
  }
  function updateCoresEmpty() {
    if (!corEmptyEl || !corSearchTerm) {
      if (corEmptyEl) corEmptyEl.hidden = true;
      return;
    }
    const visible = root.querySelectorAll('.cor-swatch:not([hidden])').length;
    corEmptyEl.hidden = visible > 0;
  }
  if (corSearchEl) {
    let t;
    corSearchEl.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        corSearchTerm = corSearchEl.value.trim().toLowerCase();
        for (const sw of root.querySelectorAll('.cor-swatch')) applyCoresVisibility(sw);
        updateCoresEmpty();
      }, 100);
    });
  }

  // ESC fecha mobile sheet
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('catalogo--filtros-open')) {
      root.classList.remove('catalogo--filtros-open');
      document.body.style.overflow = '';
    }
  });

  // ====== Init ======
  syncUI();
  render();
})();
